import { Command } from 'commander';
import { imageCommand } from './image';
import { ocrCommand } from './ocr';
import { zreadCommand } from './zread';
import { webSearchCommand } from './web-search';
import { webReaderCommand } from './web-reader';
import { startMcpServer } from '../mcp/start';
import type { ToolSubset } from '../mcp/server';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

function getVersion(): string {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
    return pkg.version;
  } catch {
    return '0.0.0';
  }
}

export function createProgram(): Command {
  const program = new Command('z')
    .description('Z.AI CLI - image generation, OCR, web search, and code research')
    .version(getVersion());

  program.addCommand(imageCommand);
  program.addCommand(ocrCommand);
  program.addCommand(webSearchCommand);
  program.addCommand(webReaderCommand);
  program.addCommand(zreadCommand);

  program
    .command('mcp [subset]')
    .description('Start MCP server (subsets: all, image, ocr, web, search, reader, zread)')
    .action(async (subset?: string) => {
      await startMcpServer((subset || 'all') as ToolSubset);
    });

  return program;
}
