# Minecraft Mixin Reference Website

Static website that ranks Minecraft-related GitHub repositories by how many **other** GitHub repos reference them inside mixin source files (approximate; derived from GitHub code search).

## Run locally

Serve the static site:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Update the dataset

This repo includes a small updater that calls the GitHub Search API via the authenticated `gh` CLI.

```bash
python3 scripts/update_data.py
```

Targets (repos + signatures) live in `data/targets.json`. Output is written to `data/repos.json`.
