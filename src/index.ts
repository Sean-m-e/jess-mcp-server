import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Create MCP server
const server = new Server(
  {
    name: 'jess-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
    },
  }
);

// Load JSON data files
const loadData = async (filename: string) => {
  const filePath = path.join(__dirname, 'data', filename);
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
};

// URI to filename mapping
const uriMap: Record<string, string> = {
  'jess://knowledge/all': 'knowledge.json',
  'jess://linguistic/pronunciation_rules': 'pronunciation.json',
  'jess://linguistic/speech_enhancement': 'speech_enhancement.json',
  'jess://linguistic/australian_patterns': 'australian_patterns.json',
  'jess://protocols/global_behavioral': 'behavioral_protocols.json',
  'jess://protocols/contextual_understanding': 'contextual_understanding.json',
  'jess://protocols/unified_closing': 'closing_protocols.json',
  'jess://modules/reactive/all': 'reactive_modules.json',
};

// Register MCP handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: Object.keys(uriMap).map(uri => ({
    uri,
    name: uri.split('/').pop() || uri,
    mimeType: 'application/json'
  })),
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri.toString();
  const filename = uriMap[uri];
  
  if (!filename) {
    throw new Error(`Unknown resource: ${uri}`);
  }
  
  const data = await loadData(filename);
  
  return {
    contents: [{
      uri: request.params.uri.toString(),
      mimeType: 'application/json',
      text: JSON.stringify(data, null, 2),
    }],
  };
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    name: 'jess-mcp-server', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// List all available resources
app.get('/resources', async (req, res) => {
  try {
    const result = await server.request(
      { method: 'resources/list' },
      ListResourcesRequestSchema
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Get specific resource
app.get('/resource', async (req, res) => {
  try {
    const uri = req.query.uri as string;
    if (!uri) {
      return res.status(400).json({ error: 'URI parameter required' });
    }
    
    const result = await server.request(
      { 
        method: 'resources/read',
        params: { uri }
      },
      ReadResourceRequestSchema
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Jess MCP Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Resources: http://localhost:${PORT}/resources`);
  console.log(`🔍 Get resource: http://localhost:${PORT}/resource?uri=jess://knowledge/all`);
});
