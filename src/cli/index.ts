import { Command } from 'commander';
import { imageCommand } from './image';
import { ocrCommand } from './ocr';
import { zreadCommand } from './zread';
import { startMcpServer } from '../mcp/start';
import type { ToolSubset } from '../mcp/server';

export function createProgram(): Command {
  const program = new Command('z')
    .description('Z.AI CLI - image generation, OCR, and code research')
    .version('1.0.0');

  program.addCommand(imageCommand);
  program.addCommand(ocrCommand);
  program.addCommand(zreadCommand);

  program
    .command('mcp [subset]')
    .description('Start MCP server (subsets: all, image, ocr, zread)')
    .action(async (subset?: string) => {
      await startMcpServer((subset || 'all') as ToolSubset);
    });

  return program;
}
