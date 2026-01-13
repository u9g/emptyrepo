#!/usr/bin/env python3
"""
Update data/repos.json by estimating how many *other* GitHub repos reference each target
signature inside mixin-related source files.

This script uses the authenticated GitHub CLI ("gh") to call the REST API:
  GET /search/code?q=...

Notes / limitations:
- GitHub code search only returns up to 1000 results per query.
- We approximate "referencing repos" by deduping repository.full_name across returned items.
- We restrict matches to files whose path contains "mixin" and also contain "@Mixin".
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from urllib.parse import quote_plus
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TARGETS_PATH = ROOT / "data" / "targets.json"
OUTPUT_PATH = ROOT / "data" / "repos.json"


def run_gh_api_search_code(query: str, page: int, per_page: int) -> dict:
    # `gh api` switches to POST when using `-f` form fields; search endpoints are GET-only.
    # Use a URL with query params and force GET.
    q = quote_plus(query)
    cmd = ["gh", "api", "-X", "GET", f"/search/code?q={q}&page={page}&per_page={per_page}"]
    for attempt in range(1, 6):
        try:
            out = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)
            return json.loads(out)
        except subprocess.CalledProcessError as e:
            # GitHub returns 403 when the (very low) code search limit is exceeded.
            if "rate limit exceeded" in (e.output or "").lower():
                wait_for_code_search_reset()
                continue
            raise RuntimeError(
                f"GitHub API query failed (exit {e.returncode}). Output:\n{e.output}"
            ) from e
    raise RuntimeError("GitHub API query failed after repeated rate-limit retries.")


def get_rate_limit() -> dict:
    out = subprocess.check_output(["gh", "api", "/rate_limit"], text=True)
    return json.loads(out)


def wait_for_code_search_reset() -> None:
    data = get_rate_limit()
    code = ((data.get("resources") or {}).get("code_search")) or {}
    remaining = int(code.get("remaining") or 0)
    reset = int(code.get("reset") or 0)
    now = int(time.time())

    if remaining > 0:
        return

    sleep_for = max(0, reset - now) + 2
    print(f"Code search rate limit reached; sleeping {sleep_for}s until reset...", file=sys.stderr)
    time.sleep(sleep_for)


def build_query(signature: str, target_repo: str) -> str:
    # Keep this conservative: avoid advanced operators that behave inconsistently in code search.
    # - path:mixin narrows to typical mixin directories (common across modding repos).
    # - "@Mixin" ensures we’re actually in Mixin code, not random references.
    # - exclude the target repo itself to count only "other repos".
    return f"\"{signature}\" \"@Mixin\" path:mixin -repo:{target_repo}"


def estimate_unique_repos_for_signature(
    signature: str,
    target_repo: str,
    *,
    max_pages: int,
    per_page: int,
    sleep_ms: int,
) -> tuple[int, int]:
    seen_repos: set[str] = set()
    fetched_items = 0

    query = build_query(signature, target_repo)
    for page in range(1, max_pages + 1):
        data = run_gh_api_search_code(query=query, page=page, per_page=per_page)
        items = data.get("items") or []
        if not items:
            break

        fetched_items += len(items)
        for it in items:
            repo = (it.get("repository") or {}).get("full_name")
            if repo and repo.lower() != target_repo.lower():
                seen_repos.add(repo)

        # polite backoff to reduce secondary rate limit risk
        if sleep_ms > 0:
            time.sleep(sleep_ms / 1000.0)

        # If GitHub indicates incomplete results (rare but possible), continuing pagination
        # doesn’t necessarily help; still, we try up to max_pages.

        # GitHub search caps at 1000 results; stop before we waste calls.
        if page * per_page >= 1000:
            break

    return len(seen_repos), fetched_items


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--targets", default=str(TARGETS_PATH), help="Path to targets.json")
    ap.add_argument("--out", default=str(OUTPUT_PATH), help="Output path for repos.json")
    ap.add_argument("--max-pages", type=int, default=3, help="Max pages to fetch per target (100 results/page)")
    ap.add_argument("--per-page", type=int, default=100, help="Items per page (max 100)")
    ap.add_argument("--sleep-ms", type=int, default=250, help="Sleep between API requests per page")
    args = ap.parse_args()

    targets_path = Path(args.targets)
    out_path = Path(args.out)

    targets_doc = json.loads(targets_path.read_text(encoding="utf-8"))
    targets = targets_doc.get("targets") or []

    items_out = []
    for t in targets:
        repo = t.get("repo")
        signature = t.get("signature")
        desc = t.get("description", "")
        if not repo or not signature:
            continue

        count, fetched_items = estimate_unique_repos_for_signature(
            signature=signature,
            target_repo=repo,
            max_pages=args.max_pages,
            per_page=args.per_page,
            sleep_ms=args.sleep_ms,
        )

        items_out.append(
            {
                "repo": repo,
                "signature": signature,
                "description": desc,
                "referencingRepoCount": count,
                "debug": {
                    "query": build_query(signature, repo),
                    "fetchedItems": fetched_items,
                    "maxPages": args.max_pages,
                    "perPage": args.per_page,
                },
            }
        )

        print(f"{repo}: {count} unique repos (sampled from {fetched_items} code results)")

    items_out.sort(key=lambda x: int(x.get("referencingRepoCount") or 0), reverse=True)

    out_doc = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "note": (
            "Counts are approximate. For each target signature, we run GitHub code search for "
            "\"<signature>\" \"@Mixin\" path:mixin excluding the target repo itself, then dedupe "
            "repositories from the returned code results. GitHub code search is capped (1000 results/query) "
            "and this script may sample only the first N pages."
        ),
        "items": items_out,
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out_doc, indent=2, sort_keys=False) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

