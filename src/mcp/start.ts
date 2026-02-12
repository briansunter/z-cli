import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer, type ToolSubset } from './server';

const VALID_SUBSETS: ToolSubset[] = ['all', 'image', 'ocr', 'zread'];

export async function startMcpServer(subset: ToolSubset = 'all'): Promise<void> {
  if (!VALID_SUBSETS.includes(subset)) {
    console.error(`Invalid MCP subset: ${subset}. Must be one of: ${VALID_SUBSETS.join(', ')}`);
    process.exit(1);
  }

  const server = createServer(subset);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
