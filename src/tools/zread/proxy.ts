import { callZreadTool } from './client';
import { searchDocToolDef, getRepoStructureToolDef, readFileToolDef } from './schema';

export const zreadToolDefs = [searchDocToolDef, getRepoStructureToolDef, readFileToolDef];

/**
 * Translate our user-friendly param names to the remote API's expected names.
 * Our CLI/MCP uses `repo` and `path`; the remote expects `repo_name` and `dir_path`.
 */
function translateArgs(name: string, args: Record<string, unknown>): Record<string, unknown> {
  const translated = { ...args };

  // repo -> repo_name
  if ('repo' in translated) {
    translated.repo_name = translated.repo;
    delete translated.repo;
  }

  // path -> dir_path (for get_repo_structure)
  if (name === 'get_repo_structure' && 'path' in translated) {
    translated.dir_path = translated.path;
    delete translated.path;
  }

  return translated;
}

export async function handleZreadTool(
  name: string,
  args: Record<string, unknown>,
): Promise<{ content: Array<{ type: string; text?: string }> }> {
  switch (name) {
    case 'search_doc':
    case 'get_repo_structure':
    case 'read_file':
      return await callZreadTool(name, translateArgs(name, args));
    default:
      throw new Error(`Unknown zread tool: ${name}`);
  }
}
