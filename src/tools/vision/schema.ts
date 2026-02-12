import { z } from 'zod';

export const visionSchema = z.object({
  image: z.string().min(1).describe('URL or local file path of the image to analyze'),
  prompt: z.string().min(1).describe('Question or instruction about the image'),
  model: z.string().optional().describe('Vision model to use (default: glm-4.6v)'),
  thinking: z.boolean().optional().describe('Enable thinking/reasoning mode (default: false)'),
  maxTokens: z.number().int().positive().optional().describe('Maximum tokens in response'),
});

export const visionToolDef = {
  name: 'vision',
  description: 'Analyze an image using Z.AI vision model (glm-4.6v). Accepts a URL or local file path. Supports image recognition, description, OCR, object detection, and visual Q&A.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      image: {
        type: 'string',
        description: 'URL or local file path of the image to analyze. Supports JPG, PNG, GIF, WebP, BMP.',
      },
      prompt: {
        type: 'string',
        description: 'Question or instruction about the image (e.g., "Describe this image", "What text is in this image?")',
      },
      model: {
        type: 'string',
        description: 'Vision model to use (default: glm-4.6v)',
      },
      thinking: {
        type: 'boolean',
        description: 'Enable thinking/reasoning mode for complex analysis (default: false)',
      },
      maxTokens: {
        type: 'number',
        description: 'Maximum tokens in response',
      },
    },
    required: ['image', 'prompt'],
  },
};
