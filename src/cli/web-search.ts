import { Command } from 'commander';
import { webSearch, formatResults } from '../tools/web-search/api';

export const webSearchCommand = new Command('search')
  .description('Search the web using Z.AI Web Search')
  .argument('<query>', 'Search query')
  .option('--count <n>', 'Number of results (1-50, default: 10)', parseInt)
  .option('--domain <domain>', 'Limit to specific domain')
  .option('--recency <filter>', 'Time filter: oneDay, oneWeek, oneMonth, oneYear, noLimit')
  .action(async (query: string, opts: {
    count?: number;
    domain?: string;
    recency?: string;
  }) => {
    try {
      const result = await webSearch({
        query,
        count: opts.count,
        domainFilter: opts.domain,
        recencyFilter: opts.recency,
      });

      if (result.results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(formatResults({ id: result.id, created: 0, search_result: result.results }));
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });
