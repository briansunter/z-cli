export const IMAGE_API_ENDPOINT = 'https://api.z.ai/api/paas/v4/images/generations';
export const OCR_API_ENDPOINT = 'https://api.z.ai/api/paas/v4/layout_parsing';
export const ZREAD_MCP_ENDPOINT = 'https://api.z.ai/api/mcp/zread/mcp';
export const WEB_SEARCH_API_ENDPOINT = 'https://api.z.ai/api/paas/v4/web_search';

export const VALID_IMAGE_MODELS = ['glm-image', 'cogview-4-250304'] as const;
export type ValidImageModel = (typeof VALID_IMAGE_MODELS)[number];

export const VALID_QUALITIES = ['standard', 'hd'] as const;
export type ValidQuality = (typeof VALID_QUALITIES)[number];

export function getDefaultSize(model: string): string {
  return model === 'glm-image' ? '1280x1280' : '1024x1024';
}

export function getDefaultQuality(model: string): string {
  return model === 'glm-image' ? 'hd' : 'standard';
}
