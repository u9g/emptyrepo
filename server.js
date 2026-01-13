const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to make HTTPS requests
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Minecraft-Mixin-Tracker/1.0',
        'Accept': 'application/vnd.github.v3+json',
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// API endpoint to fetch GitHub repo info
app.get('/api/github/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  
  try {
    const result = await httpsGet(`https://api.github.com/repos/${owner}/${repo}`);
    
    if (result.status === 200) {
      res.json({
        success: true,
        data: {
          name: result.data.name,
          full_name: result.data.full_name,
          description: result.data.description,
          stars: result.data.stargazers_count,
          forks: result.data.forks_count,
          watchers: result.data.watchers_count,
          open_issues: result.data.open_issues_count,
          language: result.data.language,
          updated_at: result.data.updated_at,
          html_url: result.data.html_url
        }
      });
    } else {
      res.status(result.status).json({
        success: false,
        error: result.data.message || 'Failed to fetch repository'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// API endpoint to search for mixin references in a repo
app.get('/api/search/mixin/:query', async (req, res) => {
  const { query } = req.params;
  
  try {
    // Search for mixin configuration files referencing the query
    const searchQuery = encodeURIComponent(`"${query}" filename:*.mixins.json`);
    const result = await httpsGet(`https://api.github.com/search/code?q=${searchQuery}&per_page=100`);
    
    if (result.status === 200) {
      res.json({
        success: true,
        data: {
          total_count: result.data.total_count,
          items: result.data.items?.slice(0, 20).map(item => ({
            repo: item.repository.full_name,
            path: item.path,
            html_url: item.html_url
          })) || []
        }
      });
    } else {
      res.status(result.status).json({
        success: false,
        error: result.data.message || 'Failed to search'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log('  GET /api/github/:owner/:repo - Fetch GitHub repo info');
  console.log('  GET /api/search/mixin/:query - Search for mixin references');
});
