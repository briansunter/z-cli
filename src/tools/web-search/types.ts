export interface WebSearchRequest {
  search_engine: string;
  search_query: string;
  count?: number;
  search_domain_filter?: string;
  search_recency_filter?: string;
}

export interface WebSearchResultItem {
  title: string;
  content: string;
  link: string;
  media: string;
  icon: string;
  refer: string;
  publish_date: string;
}

export interface WebSearchResponse {
  id: string;
  created: number;
  search_result: WebSearchResultItem[];
}

export interface WebSearchInput {
  query: string;
  count?: number;
  domainFilter?: string;
  recencyFilter?: string;
}

export interface WebSearchResult {
  id: string;
  results: WebSearchResultItem[];
}
