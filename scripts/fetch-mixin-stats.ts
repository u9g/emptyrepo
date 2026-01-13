
import { Octokit } from "@octokit/rest";
import fs from 'fs/promises';
import path from 'path';

// We'll use the GH CLI token if available, or just rely on public (rate limited) if not, 
// but code search requires auth.
// In this environment, we can try to get the token from gh auth token
import { execSync } from 'child_process';

const REPOS = [
  { owner: 'FabricMC', repo: 'fabric', package: 'net.fabricmc.fabric' },
  { owner: 'SpongePowered', repo: 'Sponge', package: 'org.spongepowered.api' }, // narrowed
  { owner: 'MinecraftForge', repo: 'MinecraftForge', package: 'net.minecraftforge' },
  { owner: 'CaffeineMC', repo: 'sodium-fabric', package: 'me.jellysquid.mods.sodium' },
  { owner: 'IrisShaders', repo: 'Iris', package: 'net.irisshaders.iris' },
  { owner: 'VazkiiMods', repo: 'Botania', package: 'vazkii.botania' },
  { owner: 'AppliedEnergistics', repo: 'Applied-Energistics-2', package: 'appeng' },
  { owner: 'mekanism', repo: 'Mekanism', package: 'mekanism' },
  { owner: 'TerraformersMC', repo: 'ModMenu', package: 'com.terraformersmc.modmenu' },
  { owner: 'shedaniel', repo: 'RoughlyEnoughItems', package: 'me.shedaniel.rei' },
];

async function getGhToken() {
  try {
    return execSync('gh auth token').toString().trim();
  } catch (e) {
    console.error("Could not get gh token", e);
    return process.env.GITHUB_TOKEN;
  }
}

async function main() {
  const token = await getGhToken();
  if (!token) {
    console.error("No GitHub token found. Please set GITHUB_TOKEN or login with gh.");
    process.exit(1);
  }

  const octokit = new Octokit({ auth: token });
  const results = [];

  console.log("Starting data fetch...");

  for (const item of REPOS) {
    // Query: usage of @Mixin and the package name, excluding the repo itself
    // Note: GitHub search syntax: "string" repo:owner/name
    // To exclude own repo: -repo:owner/name
    
    // We search for the package name AND "@Mixin"
    // This is an approximation.
    const query = `"${item.package}" "@Mixin" language:java -repo:${item.owner}/${item.repo}`;
    
    console.log(`Searching for ${item.owner}/${item.repo} using query: [${query}]`);

    try {
      // Rate limit handling: wait 6 seconds between requests (10 per minute limit safety)
      await new Promise(r => setTimeout(r, 6000));

      const { data } = await octokit.search.code({
        q: query,
        per_page: 1 // We only care about total_count
      });

      console.log(`Found ${data.total_count} references.`);
      
      results.push({
        ...item,
        count: data.total_count,
        url: `https://github.com/${item.owner}/${item.repo}`
      });

    } catch (error: any) {
      console.error(`Error searching for ${item.repo}:`, error.message);
      // If secondary rate limit, wait longer?
      if (error.status === 403) {
          console.log("Rate limit hit, waiting 30s...");
          await new Promise(r => setTimeout(r, 30000));
      }
      results.push({
        ...item,
        count: 0, // Mark as 0 or null on error
        error: true
      });
    }
  }

  // Sort by count descending
  results.sort((a, b) => (b.count || 0) - (a.count || 0));

  const outputPath = path.join(process.cwd(), 'public', 'data.json');
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  console.log(`Data written to ${outputPath}`);
}

main().catch(console.error);
