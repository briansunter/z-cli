import { promises as fs } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { getApiKey } from '../../shared/auth';
import { IMAGE_API_ENDPOINT, VALID_IMAGE_MODELS, VALID_QUALITIES, getDefaultSize, getDefaultQuality } from '../../shared/config';
import type { GLMImageRequest, GLMImageResponse, GLMImageError, GenerateImageInput, GenerateImageResult } from './types';

function validatePrompt(prompt: string): void {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }
  if (prompt.length > 4000) {
    throw new Error('Prompt cannot exceed 4000 characters');
  }
}

function validateModel(model?: string): string {
  if (!model) return 'glm-image';
  if (!(VALID_IMAGE_MODELS as readonly string[]).includes(model)) {
    throw new Error(`Invalid model: ${model}. Must be one of: ${VALID_IMAGE_MODELS.join(', ')}`);
  }
  return model;
}

function validateQuality(quality?: string, model?: string): string {
  if (quality && !(VALID_QUALITIES as readonly string[]).includes(quality)) {
    throw new Error(`Invalid quality: ${quality}. Must be one of: ${VALID_QUALITIES.join(', ')}`);
  }
  if (!quality) {
    return getDefaultQuality(model || 'glm-image');
  }
  return quality;
}

export function generateFilename(prompt: string, customFilename?: string): string {
  if (customFilename) {
    return customFilename.endsWith('.png') ? customFilename : `${customFilename}.png`;
  }
  const slug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
  const timestamp = Date.now();
  return `glm-${slug}-${timestamp}.png`;
}

async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export async function callGLMImageAPI(request: GLMImageRequest): Promise<GLMImageResponse> {
  const apiKey = getApiKey();

  const response = await fetch(IMAGE_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: request.model || 'glm-image',
      prompt: request.prompt,
      quality: request.quality,
      size: request.size,
    }),
  });

  if (!response.ok) {
    const errorData: GLMImageError = await response.json().catch(() => ({
      error: { type: 'unknown', message: response.statusText },
    }));
    throw new Error(`GLM Image API error (${response.status}): ${errorData.error.message}`);
  }

  return await response.json() as GLMImageResponse;
}

export async function downloadImage(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(buffer));
}

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageResult> {
  validatePrompt(input.prompt);
  const model = validateModel(input.model);
  const quality = validateQuality(input.quality, model);
  const size = input.size || getDefaultSize(model);

  const response = await callGLMImageAPI({ prompt: input.prompt, model, quality, size });

  if (!response.data || response.data.length === 0) {
    throw new Error('No images generated');
  }

  const imageUrl = response.data[0].url;
  const outputDir = input.outputPath || cwd();
  const filename = generateFilename(input.prompt, input.filename);
  const fullPath = join(outputDir, filename);

  await ensureDirectory(outputDir);
  await downloadImage(imageUrl, fullPath);

  return {
    url: imageUrl,
    filePath: fullPath,
    id: response.id,
    requestId: response.request_id,
  };
}
