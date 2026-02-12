export interface GLMOCRLayoutDetail {
  bbox_2d: number[];
  content: string;
  height: number;
  width: number;
  index: number;
  label: string;
  native_label: string;
}

export interface GLMOCRResponse {
  id?: string;
  created?: number;
  model?: string;
  md_results?: string;
  layout_details?: GLMOCRLayoutDetail[][];
  data_info?: {
    num_pages: number;
    pages: Array<{ height: number; width: number }>;
  };
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  // Legacy format (some endpoints may still return this)
  output?: {
    pages?: Array<{
      page_no: number;
      content: string;
      markdown?: string;
    }>;
    markdown?: string;
  };
}

export interface GLMOCRError {
  error: {
    type: string;
    message: string;
    code?: string;
  };
}

export interface LayoutParsingRequest {
  model: string;
  file: string;
}

export interface LayoutParsingInput {
  file: string;
  model?: string;
}

export interface LayoutParsingResult {
  text: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
