# Z.AI CLI

Unified CLI for Z.AI services: image generation, OCR, and code research (zread).

## Running

```bash
bun bin/z.ts <command>       # CLI mode
bun bin/z.ts mcp             # MCP server mode (all tools)
bun bin/z.ts mcp image       # MCP server mode (image only)
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
