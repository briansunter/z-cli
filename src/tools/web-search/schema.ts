import { z } from 'zod';

export const webSearchSchema = z.object({
  query: z.string().min(1).describe('The search query'),
  count: z.number().int().min(1).max(50).optional().describe('Number of results to return (1-50, default: 10)'),
  domainFilter: z.string().optional().describe('Limit results to a specific domain (e.g., "docs.anthropic.com")'),
  recencyFilter: z.enum(['oneDay', 'oneWeek', 'oneMonth', 'oneYear', 'noLimit']).optional()
    .describe('Time range filter: oneDay, oneWeek, oneMonth, oneYear, or noLimit (default)'),
});

export const webSearchToolDef = {
  name: 'web_search',
  description: 'Search the web using Z.AI Web Search API. Returns titles, URLs, summaries, and publication dates. Optimized for LLM consumption.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description: 'The search query',
      },
      count: {
        type: 'number',
        description: 'Number of results to return (1-50, default: 10)',
      },
      domainFilter: {
        type: 'string',
        description: 'Limit results to a specific domain (e.g., "docs.anthropic.com")',
      },
      recencyFilter: {
        type: 'string',
        description: 'Time range filter: oneDay, oneWeek, oneMonth, oneYear, or noLimit (default)',
        enum: ['oneDay', 'oneWeek', 'oneMonth', 'oneYear', 'noLimit'],
      },
    },
    required: ['query'],
  },
};
