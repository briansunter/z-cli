import { promises as fs } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { getApiKey } from '../../shared/auth';
import { CHAT_API_ENDPOINT } from '../../shared/config';
import type { VisionRequest, VisionResponse, VisionError, VisionInput, VisionResult } from './types';

function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

async function imageToUrl(image: string): Promise<string> {
  if (isUrl(image)) return image;

  const resolvedPath = image.startsWith('/') ? image : join(cwd(), image);
  const buffer = await fs.readFile(resolvedPath);
  const base64 = buffer.toString('base64');

  const ext = image.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
  };
  const mimeType = mimeTypes[ext] || 'image/png';

  return `data:${mimeType};base64,${base64}`;
}

async function callVisionAPI(request: VisionRequest): Promise<VisionResponse> {
  const apiKey = getApiKey();

  const response = await fetch(CHAT_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData: VisionError = await response.json().catch(() => ({
      error: { type: 'unknown', message: response.statusText },
    }));
    throw new Error(`Vision API error (${response.status}): ${errorData.error.message}`);
  }

  return await response.json() as VisionResponse;
}

export async function vision(input: VisionInput): Promise<VisionResult> {
  if (!input.image || input.image.trim().length === 0) {
    throw new Error('Image path or URL cannot be empty');
  }
  if (!input.prompt || input.prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }

  const imageUrl = await imageToUrl(input.image);
  const model = input.model || 'glm-4.6v';

  const request: VisionRequest = {
    model,
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: imageUrl } },
        { type: 'text', text: input.prompt },
      ],
    }],
  };

  if (input.thinking) {
    request.thinking = { type: 'enabled' };
  }
  if (input.maxTokens) {
    request.max_tokens = input.maxTokens;
  }

  const response = await callVisionAPI(request);

  if (!response.choices || response.choices.length === 0) {
    throw new Error('No response from vision model');
  }

  return {
    text: response.choices[0].message.content,
    model: response.model,
    usage: response.usage,
  };
}
