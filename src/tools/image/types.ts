export interface GLMImageRequest {
  prompt: string;
  model?: string;
  quality?: string;
  size?: string;
}

export interface GLMImageData {
  url: string;
  b64_json?: string;
}

export interface GLMImageResponse {
  created: number;
  data: GLMImageData[];
  id: string;
  request_id: string;
}

export interface GLMImageError {
  error: {
    type: string;
    message: string;
  };
}

export interface GenerateImageInput {
  prompt: string;
  model?: string;
  quality?: string;
  size?: string;
  outputPath?: string;
  filename?: string;
}

export interface GenerateImageResult {
  url: string;
  filePath?: string;
  id: string;
  requestId: string;
}
