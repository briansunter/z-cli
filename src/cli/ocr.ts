import { Command } from 'commander';
import { layoutParsing } from '../tools/ocr/api';

export const ocrCommand = new Command('ocr')
  .description('Extract text from images or PDFs using Z.AI GLM-OCR')
  .argument('<file>', 'URL or local file path to image/PDF')
  .option('--model <model>', 'OCR model (default: glm-ocr)', 'glm-ocr')
  .action(async (file: string, opts: { model: string }) => {
    try {
      console.error(`Processing: ${file}...`);

      const result = await layoutParsing({ file, model: opts.model });

      // Metadata to stderr so stdout is clean text
      if (result.model || result.usage) {
        const meta: string[] = [];
        if (result.model) meta.push(`Model: ${result.model}`);
        if (result.usage) {
          meta.push(`Tokens: ${result.usage.total_tokens}`);
        }
        console.error(meta.join(' | '));
      }

      // Output extracted text to stdout
      console.log(result.text);
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });
