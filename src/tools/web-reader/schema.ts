import { z } from 'zod';

export const webReaderSchema = z.object({
  url: z.string().url().describe('The URL to read and parse'),
  format: z.enum(['markdown', 'text']).optional().describe('Return format: markdown (default) or text'),
  noCache: z.boolean().optional().describe('Disable caching (default: false)'),
  retainImages: z.boolean().optional().describe('Retain images in output (default: true)'),
  withImagesSummary: z.boolean().optional().describe('Include image summary (default: false)'),
  withLinksSummary: z.boolean().optional().describe('Include links summary (default: false)'),
});

export const webReaderToolDef = {
  name: 'web_reader',
  description: 'Read and parse the content of a web page. Returns the page title, description, and content in markdown or text format.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      url: {
        type: 'string',
        description: 'The URL to read and parse',
      },
      format: {
        type: 'string',
        description: 'Return format: markdown (default) or text',
        enum: ['markdown', 'text'],
      },
      noCache: {
        type: 'boolean',
        description: 'Disable caching (default: false)',
      },
      retainImages: {
        type: 'boolean',
        description: 'Retain images in output (default: true)',
      },
      withImagesSummary: {
        type: 'boolean',
        description: 'Include image summary (default: false)',
      },
      withLinksSummary: {
        type: 'boolean',
        description: 'Include links summary (default: false)',
      },
    },
    required: ['url'],
  },
};
