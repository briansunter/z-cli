import { z } from 'zod';

export const layoutParsingSchema = z.object({
  file: z.string().min(1).describe('URL or local file path to the image or PDF to process'),
  model: z.string().optional().default('glm-ocr').describe('Model to use for OCR. Default: glm-ocr'),
});

export const layoutParsingToolDef = {
  name: 'layout_parsing',
  description: 'Extract text and structured content from images or PDFs using GLM-OCR. Supports documents, tables, handwriting, and multi-page PDFs (up to 100 pages). Input can be a URL or local file path.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      file: {
        type: 'string',
        description: 'URL or local file path to the image or PDF to process. Supported formats: JPG, PNG (max 10MB), PDF (max 50MB, up to 100 pages).',
      },
      model: {
        type: 'string',
        description: 'Model to use for OCR. Default: glm-ocr',
        default: 'glm-ocr',
      },
    },
    required: ['file'],
  },
};
