---
name: z-ai-tools
description: Use this skill for Z.AI services including generating images from text prompts, extracting text from images/PDFs (OCR), searching the web, reading/parsing web pages, or researching GitHub repositories. Activates for image generation, document OCR, web search, web reading, and code research tasks.
keywords: [image generation, OCR, web search, web reader, code research, GitHub, zai, z-cli]
topics: [image-generation, ocr, web-search, web-reader, code-research, zai]
license: MIT
---

# Z.AI Tools

Unified CLI and MCP tools for image generation, OCR, web search, web reading, and GitHub code research via [`@briansunter/z-cli`](https://www.npmjs.com/package/@briansunter/z-cli).

## Setup

```bash
npx -y @briansunter/z-cli --help
```

Set API key in `~/.dotfiles/local/.env`:

```bash
export Z_AI_API_KEY="your-api-key"
```

## Tools

### generate_image

Generate images from text prompts. Auto-downloads to current directory.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Text description (max 4000 chars) |
| `quality` | enum | No | `hd` (default) or `standard` |
| `size` | string | No | Dimensions (default: `1280x1280`) |
| `outputPath` | string | No | Save directory |
| `filename` | string | No | Custom filename |

Sizes: `1280x1280`, `1568x1056`, `1056x1568`, `1472x1088`, `1088x1472`, `1728x960`, `960x1728`. Custom: 1024-2048px, divisible by 32.

### layout_parsing

Extract text, tables, and structured content from images and PDFs (OCR).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | string | Yes | URL or local file path |
| `model` | string | No | Model (default: `glm-ocr`) |

Supports JPG, PNG (max 10MB), PDFs (max 50MB, 100 pages).

### web_search

Search the web with results optimized for LLM consumption.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `count` | number | No | Results count (1-50, default: 10) |
| `domainFilter` | string | No | Limit to domain |
| `recencyFilter` | string | No | `oneDay`, `oneWeek`, `oneMonth`, `oneYear`, `noLimit` |

### web_reader

Read and parse web pages to markdown or plain text.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | URL to read |
| `format` | string | No | `markdown` (default) or `text` |
| `noCache` | boolean | No | Disable caching |
| `retainImages` | boolean | No | Keep images (default: true) |
| `withImagesSummary` | boolean | No | Include image summary |
| `withLinksSummary` | boolean | No | Include links summary |

### search_doc

Search documentation and code within a GitHub repository.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `repo` | string | Yes | GitHub repo (`owner/repo`) |
| `query` | string | Yes | Search query |
| `language` | string | No | `en` or `zh` |

### get_repo_structure

View GitHub repository directory structure.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `repo` | string | Yes | GitHub repo (`owner/repo`) |
| `path` | string | No | Subdirectory path |

### read_file

Read a file from a GitHub repository.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `repo` | string | Yes | GitHub repo (`owner/repo`) |
| `file_path` | string | Yes | Path to file |

## CLI Usage

```bash
# Image generation
npx -y @briansunter/z-cli image "A sunset over mountains" --quality hd --size 1568x1056

# OCR
npx -y @briansunter/z-cli ocr ./document.pdf
npx -y @briansunter/z-cli ocr https://example.com/image.png

# Web search
npx -y @briansunter/z-cli search "Claude Code MCP server" --count 5
npx -y @briansunter/z-cli search "bun runtime" --recency oneWeek

# Web reader
npx -y @briansunter/z-cli read https://bun.com
npx -y @briansunter/z-cli read https://docs.anthropic.com --format text --no-images

# Code research
npx -y @briansunter/z-cli zread search facebook/react "hooks"
npx -y @briansunter/z-cli zread structure vercel/next.js
npx -y @briansunter/z-cli zread read vercel/next.js package.json
```

## MCP Server

Single unified server exposes all 7 tools:

```json
{
  "z-ai": {
    "command": "bunx",
    "args": ["@briansunter/z-cli", "mcp"],
    "env": { "Z_AI_API_KEY": "${Z_AI_API_KEY}" }
  }
}
```

Subset modes: `mcp image`, `mcp ocr`, `mcp web`, `mcp search`, `mcp reader`, `mcp zread`.
