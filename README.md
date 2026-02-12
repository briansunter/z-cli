# Z.AI CLI

Unified command-line interface for Z.AI services: image generation, OCR, vision, web search, web reader, and code research.

## Install

```bash
# Run directly (no install needed)
bunx @briansunter/z-cli --help

# Or install globally
bun install -g @briansunter/z-cli
```

## CLI Usage

```bash
# Image generation
bunx @briansunter/z-cli image "a sunset over mountains" --quality hd --size 1280x1280

# OCR - extract text from images and PDFs
bunx @briansunter/z-cli ocr ./document.pdf
bunx @briansunter/z-cli ocr https://example.com/image.png

# Vision - analyze images with AI
bunx @briansunter/z-cli vision ./photo.png "Describe this image"
bunx @briansunter/z-cli vision https://example.com/image.jpg "What objects are in this image?"

# Web search
bunx @briansunter/z-cli search "Claude Code MCP server"
bunx @briansunter/z-cli search "bun runtime" --count 5 --recency oneWeek

# Web reader - read and parse web pages
bunx @briansunter/z-cli read https://bun.com
bunx @briansunter/z-cli read https://docs.anthropic.com --format text --no-images

# Code research via Zread
bunx @briansunter/z-cli zread search facebook/react "hooks"
bunx @briansunter/z-cli zread structure vercel/next.js
bunx @briansunter/z-cli zread read vercel/next.js package.json
```

## MCP Server

Exposes all tools as a single MCP server for Claude Code:

```bash
bunx @briansunter/z-cli mcp              # All 8 tools
bunx @briansunter/z-cli mcp image        # generate_image only
bunx @briansunter/z-cli mcp ocr          # layout_parsing only
bunx @briansunter/z-cli mcp vision       # vision only
bunx @briansunter/z-cli mcp web          # web_search + web_reader
bunx @briansunter/z-cli mcp search       # web_search only
bunx @briansunter/z-cli mcp reader       # web_reader only
bunx @briansunter/z-cli mcp zread        # search_doc, get_repo_structure, read_file
```

### Claude Code Integration

Add to your `.mcp.json`:

```json
{
  "mcpServers": {
    "z-ai": {
      "command": "bunx",
      "args": ["@briansunter/z-cli", "mcp"],
      "env": { "Z_AI_API_KEY": "${Z_AI_API_KEY}" }
    }
  }
}
```

## Environment

Set `Z_AI_API_KEY` in your environment or `.env` file.

## License

MIT
