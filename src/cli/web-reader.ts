import { Command } from 'commander';
import { readPage } from '../tools/web-reader/api';

export const webReaderCommand = new Command('read')
  .description('Read and parse a web page using Z.AI Web Reader')
  .argument('<url>', 'URL to read')
  .option('--format <format>', 'Return format: markdown or text (default: markdown)')
  .option('--no-cache', 'Disable caching')
  .option('--no-images', 'Strip images from output')
  .option('--links-summary', 'Include links summary')
  .option('--images-summary', 'Include images summary')
  .action(async (url: string, opts: {
    format?: string;
    cache?: boolean;
    images?: boolean;
    linksSummary?: boolean;
    imagesSummary?: boolean;
  }) => {
    try {
      const result = await readPage({
        url,
        format: opts.format,
        noCache: opts.cache === false,
        retainImages: opts.images,
        withLinksSummary: opts.linksSummary,
        withImagesSummary: opts.imagesSummary,
      });

      if (result.title) console.error(`Title: ${result.title}`);
      if (result.description) console.error(`Description: ${result.description}`);
      console.error(`URL: ${result.url}`);
      console.error('---');
      console.log(result.content);
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });
