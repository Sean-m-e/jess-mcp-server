import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Load JSON data files - FIXED PATH
const loadData = async (filename: string) => {
  const filePath = path.join(process.cwd(), 'src', 'data', filename);
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
};

// URI to filename mapping with proper typing
const resources: Record<string, { file: string; name: string }> = {
  'jess://knowledge/all': { file: 'knowledge.json', name: 'Knowledge Base' },
  'jess://linguistic/pronunciation_rules': { file: 'pronunciation.json', name: 'Pronunciation Rules' },
  'jess://linguistic/speech_enhancement': { file: 'speech_enhancement.json', name: 'Speech Enhancement' },
  'jess://linguistic/australian_patterns': { file: 'australian_patterns.json', name: 'Australian Patterns' },
  'jess://protocols/global_behavioral': { file: 'behavioral_protocols.json', name: 'Global Behavioral Protocols' },
  'jess://protocols/contextual_understanding': { file: 'contextual_understanding.json', name: 'Contextual Understanding' },
  'jess://protocols/unified_closing': { file: 'closing_protocols.json', name: 'Unified Closing' },
  'jess://modules/reactive/all': { file: 'reactive_modules.json', name: 'Reactive Modules' }
};

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
app.get('/resources', (req, res) => {
  const resourceList = Object.keys(resources).map(uri => ({
    uri,
    name: resources[uri].name,
    mimeType: 'application/json'
  }));
  
  res.json({
    resources: resourceList
  });
});

// Get specific resource by URI
app.get('/resource', async (req, res) => {
  try {
    const uri = req.query.uri as string;
    
    if (!uri) {
      return res.status(400).json({ error: 'URI parameter required' });
    }
    
    const resource = resources[uri];
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found', uri });
    }
    
    const data = await loadData(resource.file);
    
    res.json({
      uri,
      name: resource.name,
      data
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Get resource by short name
app.get('/data/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const fileMap: Record<string, string> = {
      'knowledge': 'knowledge.json',
      'pronunciation': 'pronunciation.json',
      'speech': 'speech_enhancement.json',
      'australian': 'australian_patterns.json',
      'behavioral': 'behavioral_protocols.json',
      'contextual': 'contextual_understanding.json',
      'closing': 'closing_protocols.json',
      'reactive': 'reactive_modules.json'
    };
    
    const filename = fileMap[name];
    if (!filename) {
      return res.status(404).json({ 
        error: 'Resource not found',
        available: Object.keys(fileMap)
      });
    }
    
    const data = await loadData(filename);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Jess MCP Server running on port ${PORT}`);
});
