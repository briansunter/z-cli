import { getApiKey } from '../../shared/auth';
import { WEB_READER_API_ENDPOINT } from '../../shared/config';
import type { WebReaderRequest, WebReaderResponse, WebReaderInput, ReadPageResult } from './types';

function validateUrl(url: string): void {
  if (!url || url.trim().length === 0) {
    throw new Error('URL cannot be empty');
  }
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }
}

export async function callWebReaderAPI(request: WebReaderRequest): Promise<WebReaderResponse> {
  const apiKey = getApiKey();

  const response = await fetch(WEB_READER_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      code: response.status,
      message: response.statusText,
    }));
    throw new Error(`Web Reader API error (${response.status}): ${errorData.message || response.statusText}`);
  }

  return await response.json() as WebReaderResponse;
}

export async function readPage(input: WebReaderInput): Promise<ReadPageResult> {
  validateUrl(input.url);

  const request: WebReaderRequest = {
    url: input.url,
  };

  if (input.format) request.return_format = input.format;
  if (input.noCache !== undefined) request.no_cache = input.noCache;
  if (input.retainImages !== undefined) request.retain_images = input.retainImages;
  if (input.withImagesSummary !== undefined) request.with_images_summary = input.withImagesSummary;
  if (input.withLinksSummary !== undefined) request.with_links_summary = input.withLinksSummary;

  const response = await callWebReaderAPI(request);
  const result = response.reader_result;

  return {
    title: result.title || '',
    description: result.description || '',
    url: result.url || input.url,
    content: result.content || 'No content extracted.',
  };
}
