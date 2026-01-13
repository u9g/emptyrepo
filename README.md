# Minecraft Mixin References Leaderboard

This website lists popular Minecraft repositories ordered by how many other repositories on GitHub reference them in a Mixin.

## How it works

1.  A script `scripts/fetch-mixin-stats.ts` queries the GitHub Code Search API.
2.  It searches for usages of `@Mixin` combined with the base package of the target repository (e.g., `net.fabricmc.fabric` for Fabric API).
3.  The results are saved to `public/data.json`.
4.  The Next.js app displays this data.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Fetch Data

You need a GitHub token to fetch data (or rely on the environment's `gh` CLI auth).

```bash
npx tsx scripts/fetch-mixin-stats.ts
```

This will generate `public/data.json`. Note that the script includes delays to respect GitHub API rate limits.

### 3. Run the Website

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Build for Production

```bash
npm run build
npm start
```

## Adding more Repositories

Edit `scripts/fetch-mixin-stats.ts` and add entries to the `REPOS` array:

```typescript
const REPOS = [
  // ...
  { owner: 'Owner', repo: 'RepoName', package: 'com.example.package' },
];
```
