import { Command } from 'commander';
import { generateImage } from '../tools/image/api';
import { getDefaultSize, getDefaultQuality } from '../shared/config';

export const imageCommand = new Command('image')
  .description('Generate an image using Z.AI GLM Image API')
  .argument('<prompt>', 'Text description of the image to generate')
  .option('--quality <quality>', 'Image quality: hd or standard')
  .option('--size <size>', 'Image size (e.g., 1280x1280)')
  .option('--model <model>', 'Model: glm-image (default) or cogview-4-250304')
  .option('--output <dir>', 'Output directory (default: current directory)')
  .option('--filename <name>', 'Custom filename (without .png extension)')
  .action(async (prompt: string, opts: {
    quality?: string;
    size?: string;
    model?: string;
    output?: string;
    filename?: string;
  }) => {
    try {
      const model = opts.model || 'glm-image';
      const quality = opts.quality || getDefaultQuality(model);
      const size = opts.size || getDefaultSize(model);

      console.log(`Generating image with model: ${model}, quality: ${quality}, size: ${size}...`);

      const result = await generateImage({
        prompt,
        model,
        quality,
        size,
        outputPath: opts.output,
        filename: opts.filename,
      });

      console.log(`\nImage generated successfully!`);
      console.log(`URL: ${result.url}`);
      console.log(`Saved: ${result.filePath}`);
      console.log(`ID: ${result.id}`);
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });
