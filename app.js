async function loadData() {
  const res = await fetch("./data/repos.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load data/repos.json (${res.status})`);
  return res.json();
}

function $(id) {
  return document.getElementById(id);
}

function formatNum(n) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString();
}

function normalize(s) {
  return String(s ?? "")
    .toLowerCase()
    .trim();
}

function renderRows(rowsEl, items, filterText) {
  const q = normalize(filterText);

  const filtered = items.filter((it) => {
    if (!q) return true;
    return (
      normalize(it.repo).includes(q) ||
      normalize(it.description).includes(q) ||
      normalize(it.signature).includes(q)
    );
  });

  filtered.sort((a, b) => (b.referencingRepoCount ?? 0) - (a.referencingRepoCount ?? 0));

  const html = filtered
    .map((it, idx) => {
      const rank = idx + 1;
      const url = `https://github.com/${it.repo}`;
      const desc = it.description ? `<span class="desc">${escapeHtml(it.description)}</span>` : "";
      return `
        <tr>
          <td class="rank-col">${rank}</td>
          <td class="repo">
            <a href="${url}" target="_blank" rel="noreferrer">${escapeHtml(it.repo)}</a>
            ${desc}
          </td>
          <td class="num-col">${formatNum(it.referencingRepoCount)}</td>
          <td><code>${escapeHtml(it.signature || "")}</code></td>
        </tr>
      `;
    })
    .join("");

  rowsEl.innerHTML =
    html ||
    `<tr><td colspan="4" class="muted" style="padding:16px 14px;">No matches.</td></tr>`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

(async function main() {
  const rowsEl = $("rows");
  const filterEl = $("filter");
  const lastUpdatedEl = $("last-updated");
  const dataNoteEl = $("data-note");

  try {
    const data = await loadData();
    const items = Array.isArray(data.items) ? data.items : [];

    lastUpdatedEl.textContent = data.generatedAt
      ? `Last updated: ${new Date(data.generatedAt).toLocaleString()}`
      : "";

    dataNoteEl.textContent = data.note || "";

    const rerender = () => renderRows(rowsEl, items, filterEl.value);
    filterEl.addEventListener("input", rerender);
    rerender();
  } catch (e) {
    rowsEl.innerHTML = `<tr><td colspan="4" style="padding:16px 14px;">
      <span class="pill warn">Data failed to load</span>
      <div class="muted" style="margin-top:8px;"><code>${escapeHtml(e?.message || String(e))}</code></div>
    </td></tr>`;
  }
})();

