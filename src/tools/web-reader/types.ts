export interface WebReaderRequest {
  url: string;
  timeout?: number;
  no_cache?: boolean;
  return_format?: string;
  retain_images?: boolean;
  no_gfm?: boolean;
  keep_img_data_url?: boolean;
  with_images_summary?: boolean;
  with_links_summary?: boolean;
}

export interface WebReaderResult {
  content: string;
  description: string;
  title: string;
  url: string;
  metadata?: {
    keywords?: string;
    description?: string;
  };
}

export interface WebReaderResponse {
  id: string;
  created: number;
  request_id: string;
  model: string;
  reader_result: WebReaderResult;
}

export interface WebReaderInput {
  url: string;
  format?: string;
  noCache?: boolean;
  retainImages?: boolean;
  withImagesSummary?: boolean;
  withLinksSummary?: boolean;
}

export interface ReadPageResult {
  title: string;
  description: string;
  url: string;
  content: string;
}
