import { z } from 'zod';

export const searchDocSchema = z.object({
  repo: z.string().min(1).describe('GitHub repository in format owner/repo'),
  query: z.string().min(1).describe('Search query for documentation/code'),
  language: z.enum(['en', 'zh']).optional().describe('Response language: en or zh (default: en)'),
});

export const getRepoStructureSchema = z.object({
  repo: z.string().min(1).describe('GitHub repository in format owner/repo'),
  path: z.string().optional().describe('Directory path to inspect (default: root)'),
});

export const readFileSchema = z.object({
  repo: z.string().min(1).describe('GitHub repository in format owner/repo'),
  file_path: z.string().min(1).describe('Path to file in repository'),
});

export const searchDocToolDef = {
  name: 'search_doc',
  description: 'Search documentation, issues, and commits of a GitHub repository.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      repo: { type: 'string', description: 'GitHub repository: owner/repo (e.g. "facebook/react")' },
      query: { type: 'string', description: 'Search keywords or question about the repository' },
      language: { type: 'string', description: 'Response language: "en" or "zh" (choose according to context)', enum: ['en', 'zh'] },
    },
    required: ['repo', 'query'],
  },
};

export const getRepoStructureToolDef = {
  name: 'get_repo_structure',
  description: 'Get the directory structure and file list of a GitHub repository.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      repo: { type: 'string', description: 'GitHub repository: owner/repo (e.g. "facebook/react")' },
      path: { type: 'string', description: 'Directory path to inspect (default: root "/")' },
    },
    required: ['repo'],
  },
};

export const readFileToolDef = {
  name: 'read_file',
  description: 'Read the full code content of a specific file in a GitHub repository.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      repo: { type: 'string', description: 'GitHub repository: owner/repo (e.g. "facebook/react")' },
      file_path: { type: 'string', description: 'Relative path to the file (e.g. "src/index.ts")' },
    },
    required: ['repo', 'file_path'],
  },
};
