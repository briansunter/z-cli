# Z.AI CLI

Unified CLI for Z.AI services: image generation, OCR, and code research (zread).

## Running

```bash
bunx @briansunter/z-cli <command>       # CLI mode
bunx @briansunter/z-cli mcp             # MCP server mode (all tools)
bunx @briansunter/z-cli mcp image       # MCP server mode (image only)
bunx @briansunter/z-cli mcp ocr         # MCP server mode (ocr only)
bunx @briansunter/z-cli mcp zread       # MCP server mode (zread only)
```

For local development:

```bash
bun bin/z.ts <command>
```

## Architecture

- `src/tools/*/api.ts` - Pure business logic (shared by CLI and MCP)
- `src/cli/*.ts` - CLI subcommands (terminal formatting, arg parsing)
- `src/mcp/server.ts` - MCP server factory
- `src/shared/` - Auth, config, constants

## Environment

- `Z_AI_API_KEY` - Required API key for all Z.AI services
- Bun auto-loads `.env` files

## Dependencies

Use `bun install` and `bun` to run everything. No build step needed.
