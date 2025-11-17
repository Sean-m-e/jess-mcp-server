# Jess MCP Server v1.0.0

Model Context Protocol (MCP) server for Jess voice agent v3.33, providing externalized knowledge base and behavioral protocols for OBrien Real Estate Brighton.

## Overview

This MCP server externalizes 8 major sections from the Jess v3.33 prompt (1,024 lines extracted), reducing the main prompt size by providing on-demand access to:

1. **Knowledge Base** (96 lines) - Q&A responses for customer queries
2. **Pronunciation Rules** (138 lines) - Phonetic guidelines for Australian locations and monetary values
3. **Speech Enhancement** (45 lines) - Natural response variations and contextual matching
4. **Australian Patterns** (82 lines) - Recognition patterns for Australian English
5. **Behavioral Protocols** (237 lines) - Phase control and continuous information extraction
6. **Contextual Understanding** (56 lines) - Complex response handling
7. **Closing Protocols** (67 lines) - Call closing logic for all outcomes
8. **Reactive Modules** (303 lines) - Modules R1-R24 for specific scenarios

## Architecture

```
jess-mcp-server/
├── src/
│   ├── index.ts              # Main MCP server
│   └── data/                 # Extracted JSON data files
│       ├── knowledge.json
│       ├── pronunciation.json
│       ├── speech_enhancement.json
│       ├── australian_patterns.json
│       ├── behavioral_protocols.json
│       ├── contextual_understanding.json
│       ├── closing_protocols.json
│       └── reactive_modules.json
├── package.json
├── tsconfig.json
├── railway.json             # Railway deployment config
└── README.md
```

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the server:**
   ```bash
   npm run build
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

4. **Development mode (with watch):**
   ```bash
   npm run watch
   ```

## Railway Deployment

### Prerequisites
- GitHub account
- Railway account (https://railway.app)
- Git installed locally

### Deployment Steps

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial MCP server for Jess v3.33"
   ```

2. **Push to GitHub:**
   ```bash
   # Create new repository on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/jess-mcp-server.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Railway:**
   - Go to https://railway.app/dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `jess-mcp-server` repository
   - Railway will auto-detect Node.js and deploy
   - Wait for deployment to complete

4. **Get your MCP server URL:**
   - Once deployed, Railway will provide a URL
   - Copy this URL for voice platform integration

5. **Configure in Voice Platform:**
   - Use Railway deployment URL as "MCP ID"
   - Add to voice platform MCP settings
   - Test connection
   - Verify resources are accessible

## Available Resources

The server exposes 8 resources via MCP protocol:

| URI | Name | Description |
|-----|------|-------------|
| `jess://knowledge/all` | Knowledge Base | Q&A responses for customer queries |
| `jess://linguistic/pronunciation_rules` | Pronunciation Rules | Phonetic guidelines for locations and values |
| `jess://linguistic/speech_enhancement` | Speech Enhancement | Natural response variations |
| `jess://linguistic/australian_patterns` | Australian Patterns | Australian English recognition |
| `jess://protocols/global_behavioral` | Behavioral Protocols | Phase control and extraction rules |
| `jess://protocols/contextual_understanding` | Contextual Understanding | Complex response handling |
| `jess://protocols/unified_closing` | Closing Protocols | Call closing logic |
| `jess://modules/reactive/all` | Reactive Modules | Modules R1-R24 |

## Testing

### Test Resource Availability

After deployment, you can test resource availability:

```bash
# List all resources
curl -X POST https://your-railway-url/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "resources/list"}'

# Read specific resource
curl -X POST https://your-railway-url/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "resources/read", "params": {"uri": "jess://knowledge/all"}}'
```

## Integration with Voice Platform

1. **Copy Railway URL** from Railway dashboard
2. **Add to voice platform** MCP settings as "MCP ID"
3. **Configure resources** that Jess should access
4. **Test connection** to verify accessibility

## Content Integrity

All extracted content is byte-for-byte identical to source (JESS_V3_33_FIXED_OPTION_A.txt):

- **Total lines extracted:** 1,024 lines
- **Total characters:** 43,998 characters
- **JSON validation:** All 8 files validated successfully
- **Escaping verified:** Special characters properly escaped

## Validation Reports

See `/mnt/user-data/outputs/validation/` for:
- `EXTRACTION_LOG.json` - Detailed extraction log
- `SECTION_BOUNDARIES.json` - Exact line numbers for each section
- `CHARACTER_COUNT_LOG.json` - Character count verification
- `JSON_INTEGRITY_REPORT.json` - JSON validation results

## Version Compatibility

- **Jess Prompt Version:** v3.33+
- **MCP Server Version:** 1.0.0
- **Node.js:** >= 18.0.0
- **MCP SDK:** ^0.5.0

## Rollback Strategy

If issues occur in production:

1. **Disable MCP integration** in voice platform
2. **Revert to Jess v3.33** (full inline prompt)
3. **Investigate issue** using validation logs
4. **Fix and redeploy** when ready

## Troubleshooting

### Build fails
- Check Node.js version (>= 18.0.0)
- Verify all dependencies installed: `npm install`
- Check TypeScript compilation: `npm run build`

### Railway deployment fails
- Verify `railway.json` is present
- Check build logs on Railway dashboard
- Ensure `package.json` scripts are correct

### Resources not accessible
- Verify server is running: Check Railway logs
- Check resource URIs match expected format
- Test with curl commands above

### Content corruption
- Check JSON files in `src/data/` directory
- Verify character counts match extraction logs
- Re-run validation scripts

## Support

For issues or questions:
- Check validation logs in `/mnt/user-data/outputs/validation/`
- Review Railway deployment logs
- Verify MCP integration in voice platform

## License

MIT License - See project documentation for details.

---

**Version:** 1.0.0  
**Date:** 2025-11-17  
**Source:** Jess v3.33 (JESS_V3_33_FIXED_OPTION_A.txt)  
**Total Extracted:** 1,024 lines across 8 sections
