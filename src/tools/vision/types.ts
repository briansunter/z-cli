export interface VisionMessage {
  role: 'user' | 'assistant';
  content: Array<VisionContentPart>;
}

export type VisionContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export interface VisionRequest {
  model: string;
  messages: VisionMessage[];
  thinking?: { type: 'enabled' };
  max_tokens?: number;
}

export interface VisionResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface VisionError {
  error: { type: string; message: string };
}

export interface VisionInput {
  image: string;
  prompt: string;
  model?: string;
  thinking?: boolean;
  maxTokens?: number;
}

export interface VisionResult {
  text: string;
  model: string;
  usage?: VisionResponse['usage'];
}
