import { z } from 'zod';

export const generateImageSchema = z.object({
  prompt: z.string().min(1).max(4000).describe('Text description of the image to generate (max 4000 characters)'),
  quality: z.enum(['hd', 'standard']).optional().describe('Image quality. "hd" (default): detailed/rich (~20 sec). "standard": faster (~5-10 sec).'),
  size: z.string().optional().describe('Image size. Options: 1280x1280 (default), 1568x1056, 1056x1568, 1472x1088, 1088x1472, 1728x960, 960x1728.'),
  outputPath: z.string().optional().describe('Directory to save image (default: current directory)'),
  filename: z.string().optional().describe('Custom filename without extension (default: auto-generated from prompt)'),
});

export const generateImageToolDef = {
  name: 'generate_image',
  description: 'Generate an image using Z.AI GLM Image API and save to current directory.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      prompt: {
        type: 'string',
        description: 'Text description of the image to generate (max 4000 characters)',
      },
      quality: {
        type: 'string',
        description: 'Image quality. "hd" (default): detailed/rich (~20 sec). "standard": faster (~5-10 sec).',
        enum: ['hd', 'standard'],
      },
      size: {
        type: 'string',
        description: 'Image size. Options: 1280x1280 (default), 1568x1056, 1056x1568, 1472x1088, 1088x1472, 1728x960, 960x1728. Custom: 1024-2048px, divisible by 32, max 2^22 pixels.',
      },
      outputPath: {
        type: 'string',
        description: 'Directory to save image (default: current directory)',
      },
      filename: {
        type: 'string',
        description: 'Custom filename without extension (default: auto-generated from prompt)',
      },
    },
    required: ['prompt'],
  },
};
