import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Register resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    { uri: 'jess://knowledge/all', name: 'Knowledge Base', mimeType: 'application/json' },
    { uri: 'jess://linguistic/pronunciation_rules', name: 'Pronunciation Rules', mimeType: 'application/json' },
    { uri: 'jess://linguistic/speech_enhancement', name: 'Speech Enhancement', mimeType: 'application/json' },
    { uri: 'jess://linguistic/australian_patterns', name: 'Australian Patterns', mimeType: 'application/json' },
    { uri: 'jess://protocols/global_behavioral', name: 'Global Behavioral Protocols', mimeType: 'application/json' },
    { uri: 'jess://protocols/contextual_understanding', name: 'Contextual Understanding', mimeType: 'application/json' },
    { uri: 'jess://protocols/unified_closing', name: 'Unified Closing', mimeType: 'application/json' },
    { uri: 'jess://modules/reactive/all', name: 'All Reactive Modules', mimeType: 'application/json' },
  ],
}));

// Handle resource requests
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri.toString();
  
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
  
  const filename = uriMap[uri];
  if (!filename) {
    throw new Error(`Unknown resource: ${uri}`);
  }
  
  const data = await loadData(filename);
  
  return {
    contents: [
      {
        uri: request.params.uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Jess MCP Server running on stdio');
}

main().catch(console.error);
