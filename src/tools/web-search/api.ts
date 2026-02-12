import { getApiKey } from '../../shared/auth';
import { WEB_SEARCH_API_ENDPOINT } from '../../shared/config';
import type { WebSearchRequest, WebSearchResponse, WebSearchInput, WebSearchResult } from './types';

const VALID_RECENCY_FILTERS = ['oneDay', 'oneWeek', 'oneMonth', 'oneYear', 'noLimit'] as const;

function validateQuery(query: string): void {
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty');
  }
}

function validateCount(count?: number): void {
  if (count !== undefined && (count < 1 || count > 50)) {
    throw new Error('Count must be between 1 and 50');
  }
}

function validateRecencyFilter(filter?: string): void {
  if (filter && !(VALID_RECENCY_FILTERS as readonly string[]).includes(filter)) {
    throw new Error(`Invalid recency filter: ${filter}. Must be one of: ${VALID_RECENCY_FILTERS.join(', ')}`);
  }
}

export async function callWebSearchAPI(request: WebSearchRequest): Promise<WebSearchResponse> {
  const apiKey = getApiKey();

  const response = await fetch(WEB_SEARCH_API_ENDPOINT, {
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
    throw new Error(`Web Search API error (${response.status}): ${errorData.message || response.statusText}`);
  }

  return await response.json() as WebSearchResponse;
}

export function formatResults(results: WebSearchResponse): string {
  if (!results.search_result || results.search_result.length === 0) {
    return 'No results found.';
  }

  return results.search_result.map((item, i) => {
    const parts: string[] = [];
    parts.push(`[${i + 1}] ${item.title}`);
    if (item.link) parts.push(`    ${item.link}`);
    if (item.media) parts.push(`    Source: ${item.media}`);
    if (item.publish_date) parts.push(`    Date: ${item.publish_date}`);
    if (item.content) parts.push(`    ${item.content}`);
    return parts.join('\n');
  }).join('\n\n');
}

export async function webSearch(input: WebSearchInput): Promise<WebSearchResult> {
  validateQuery(input.query);
  validateCount(input.count);
  validateRecencyFilter(input.recencyFilter);

  const request: WebSearchRequest = {
    search_engine: 'search-prime',
    search_query: input.query,
  };

  if (input.count) request.count = input.count;
  if (input.domainFilter) request.search_domain_filter = input.domainFilter;
  if (input.recencyFilter) request.search_recency_filter = input.recencyFilter;

  const response = await callWebSearchAPI(request);

  return {
    id: response.id,
    results: response.search_result || [],
  };
}
