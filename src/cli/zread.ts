import { Command } from 'commander';
import { handleZreadTool } from '../tools/zread/proxy';

function extractText(result: { content: Array<{ type: string; text?: string }> }): string {
  return result.content
    .filter((c) => c.type === 'text' && c.text)
    .map((c) => c.text!)
    .join('\n');
}

const searchCommand = new Command('search')
  .description('Search documentation, issues, and commits within a GitHub repository')
  .argument('<repo>', 'GitHub repository (owner/repo)')
  .argument('<query>', 'Search query')
  .option('--language <lang>', 'Response language: en or zh', 'en')
  .action(async (repo: string, query: string, opts: { language: string }) => {
    try {
      const result = await handleZreadTool('search_doc', {
        repo,
        query,
        language: opts.language,
      });
      console.log(extractText(result));
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

const structureCommand = new Command('structure')
  .description('View repository directory structure')
  .argument('<repo>', 'GitHub repository (owner/repo)')
  .argument('[path]', 'Directory path to inspect')
  .action(async (repo: string, path: string | undefined) => {
    try {
      const args: Record<string, unknown> = { repo };
      if (path) args.path = path;

      const result = await handleZreadTool('get_repo_structure', args);
      console.log(extractText(result));
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

const readCommand = new Command('read')
  .description('Read a file from a GitHub repository')
  .argument('<repo>', 'GitHub repository (owner/repo)')
  .argument('<file>', 'Path to file in repository')
  .action(async (repo: string, filePath: string) => {
    try {
      const result = await handleZreadTool('read_file', {
        repo,
        file_path: filePath,
      });
      console.log(extractText(result));
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

export const zreadCommand = new Command('zread')
  .description('Research GitHub repositories using Zread')
  .addCommand(searchCommand)
  .addCommand(structureCommand)
  .addCommand(readCommand);
