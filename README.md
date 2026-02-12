# Z.AI CLI

Unified command-line interface for Z.AI services: image generation, OCR, and code research.

## Install

```bash
bun install
bun link
```

## CLI Usage

```bash
# Image generation
z image "a sunset over mountains" --quality hd --size 1280x1280

# OCR - extract text from images and PDFs
z ocr ./document.pdf
z ocr https://example.com/image.png

# Code research via Zread
z zread search facebook/react "hooks"
z zread structure vercel/next.js
z zread read vercel/next.js package.json
```

## MCP Server

Exposes all tools as a single MCP server for Claude Code:

```bash
z mcp              # All 5 tools
z mcp image        # generate_image only
z mcp ocr          # layout_parsing only
z mcp zread        # search_doc, get_repo_structure, read_file
```

### Claude Code Integration

Add to your `.mcp.json`:

```json
{
  "mcpServers": {
    "z-ai": {
      "command": "bun",
      "args": ["path/to/z-cli/bin/z.ts", "mcp"],
      "env": { "Z_AI_API_KEY": "${Z_AI_API_KEY}" }
    }
  }
}
```

## Environment

Set `Z_AI_API_KEY` in your environment or `.env` file.

## License

MIT
