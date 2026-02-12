import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { getApiKey } from '../../shared/auth';
import { ZREAD_MCP_ENDPOINT } from '../../shared/config';

let clientInstance: Client | null = null;
let initPromise: Promise<Client> | null = null;

async function createClient(): Promise<Client> {
  const apiKey = getApiKey();

  const transport = new StreamableHTTPClientTransport(
    new URL(ZREAD_MCP_ENDPOINT),
    {
      requestInit: {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      },
    },
  );

  const client = new Client({
    name: 'z-cli-zread-proxy',
    version: '1.0.0',
  });

  await client.connect(transport);
  return client;
}

export async function getZreadClient(): Promise<Client> {
  if (clientInstance) return clientInstance;

  if (!initPromise) {
    initPromise = createClient().then((client) => {
      clientInstance = client;
      return client;
    }).catch((err) => {
      initPromise = null;
      throw err;
    });
  }

  return initPromise;
}

export async function callZreadTool(toolName: string, args: Record<string, unknown>): Promise<{
  content: Array<{ type: string; text?: string }>;
}> {
  const client = await getZreadClient();
  const result = await client.callTool({ name: toolName, arguments: args });
  return result as { content: Array<{ type: string; text?: string }> };
}
