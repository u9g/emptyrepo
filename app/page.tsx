
import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';

interface RepoData {
  owner: string;
  repo: string;
  package: string;
  count: number;
  url: string;
  error?: boolean;
}

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  let data: RepoData[] = [];
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (e) {
    console.error("Failed to load data", e);
    // Fallback or empty state
  }

  // Format number helper
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 text-green-400">
            Minecraft Mixin Leaderboard
          </h1>
          <p className="text-lg text-neutral-400">
            Ranking Minecraft repositories by how many other repositories reference them in a Mixin.
          </p>
          <p className="text-sm text-neutral-500 mt-2">
             Based on GitHub code search for <code>@Mixin</code> targeting the repo's base package.
          </p>
        </div>

        <div className="bg-neutral-800 shadow overflow-hidden sm:rounded-md border border-neutral-700">
          <ul role="list" className="divide-y divide-neutral-700">
            {data.map((repo, index) => (
              <li key={repo.url} className="hover:bg-neutral-750 transition duration-150 ease-in-out">
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="block p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-neutral-700 text-neutral-300 font-bold text-lg border border-neutral-600">
                        #{index + 1}
                      </div>
                      <div className="ml-4 truncate">
                        <div className="flex items-center">
                          <p className="text-lg font-medium text-green-400 truncate mr-2">
                            {repo.owner}/{repo.repo}
                          </p>
                        </div>
                        <p className="text-sm text-neutral-500 truncate">
                          Package: <code className="bg-neutral-900 px-1 py-0.5 rounded text-neutral-300">{repo.package}</code>
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                      <span className="px-3 py-1 inline-flex text-lg leading-5 font-semibold rounded-full bg-green-900 text-green-200 border border-green-800">
                        {repo.error ? 'Error' : formatNumber(repo.count)} refs
                      </span>
                    </div>
                  </div>
                </a>
              </li>
            ))}
            
            {data.length === 0 && (
              <li className="px-6 py-12 text-center text-neutral-500">
                No data available. Please run the fetch script.
              </li>
            )}
          </ul>
        </div>
        
        <div className="mt-8 text-center text-neutral-500 text-sm">
           Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </main>
  );
}
