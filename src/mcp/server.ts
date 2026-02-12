import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { generateImage } from '../tools/image/api';
import { generateImageToolDef } from '../tools/image/schema';
import { layoutParsing } from '../tools/ocr/api';
import { layoutParsingToolDef } from '../tools/ocr/schema';
import { zreadToolDefs, handleZreadTool } from '../tools/zread/proxy';

export type ToolSubset = 'all' | 'image' | 'ocr' | 'zread';

const TOOL_GROUPS: Record<ToolSubset, string[]> = {
  all: ['generate_image', 'layout_parsing', 'search_doc', 'get_repo_structure', 'read_file'],
  image: ['generate_image'],
  ocr: ['layout_parsing'],
  zread: ['search_doc', 'get_repo_structure', 'read_file'],
};

const ALL_TOOL_DEFS = [generateImageToolDef, layoutParsingToolDef, ...zreadToolDefs];

export function createServer(subset: ToolSubset = 'all'): Server {
  const allowedTools = new Set(TOOL_GROUPS[subset]);
  const toolDefs = ALL_TOOL_DEFS.filter((t) => allowedTools.has(t.name));

  const server = new Server(
    { name: 'z-ai', version: '1.0.0' },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefs,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (!allowedTools.has(name)) {
      return {
        content: [{ type: 'text', text: `Tool "${name}" is not available in this server mode (${subset})` }],
        isError: true,
      };
    }

    try {
      switch (name) {
        case 'generate_image': {
          const result = await generateImage(args as any);
          return {
            content: [{ type: 'text', text: `Image saved: ${result.filePath}` }],
          };
        }

        case 'layout_parsing': {
          const result = await layoutParsing(args as any);
          const metadata: string[] = [];
          if (result.model) metadata.push(`Model: ${result.model}`);
          if (result.usage) {
            metadata.push(`Tokens: ${result.usage.total_tokens} (prompt: ${result.usage.prompt_tokens}, completion: ${result.usage.completion_tokens})`);
          }
          const text = metadata.length > 0
            ? `---\n${metadata.join(' | ')}\n---\n\n${result.text}`
            : result.text;
          return { content: [{ type: 'text', text }] };
        }

        case 'search_doc':
        case 'get_repo_structure':
        case 'read_file':
          return await handleZreadTool(name, args as Record<string, unknown>);

        default:
          return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
          };
      }
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  });

  return server;
}
