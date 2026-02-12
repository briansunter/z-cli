import { promises as fs } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { getApiKey } from '../../shared/auth';
import { OCR_API_ENDPOINT } from '../../shared/config';
import type { GLMOCRResponse, GLMOCRError, LayoutParsingRequest, LayoutParsingInput, LayoutParsingResult } from './types';

function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

async function fileToDataUrl(filePath: string): Promise<string> {
  const resolvedPath = filePath.startsWith('/') ? filePath : join(cwd(), filePath);

  const buffer = await fs.readFile(resolvedPath);
  const base64 = buffer.toString('base64');

  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'pdf': 'application/pdf',
  };
  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  return `data:${mimeType};base64,${base64}`;
}

export async function prepareFile(file: string): Promise<string> {
  if (isUrl(file)) return file;
  return await fileToDataUrl(file);
}

export async function callGLMOCRAPI(request: LayoutParsingRequest): Promise<GLMOCRResponse> {
  const apiKey = getApiKey();

  const response = await fetch(OCR_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: request.model || 'glm-ocr',
      file: request.file,
    }),
  });

  if (!response.ok) {
    const errorData: GLMOCRError = await response.json().catch(() => ({
      error: { type: 'unknown', message: response.statusText },
    }));
    throw new Error(`GLM-OCR API error (${response.status}): ${errorData.error.message}`);
  }

  return await response.json() as GLMOCRResponse;
}

export function formatOutput(response: GLMOCRResponse): string {
  // Primary format: md_results field (current API)
  if (response.md_results) return response.md_results;

  // Legacy format: output.markdown / output.pages
  if (response.output) {
    const { output } = response;
    if (output.markdown) return output.markdown;
    if (output.pages && output.pages.length > 0) {
      return output.pages.map((page) => {
        const header = output.pages!.length > 1 ? `\n## Page ${page.page_no}\n\n` : '';
        return `${header}${page.content || page.markdown || ''}`;
      }).join('\n\n---\n\n');
    }
  }

  return 'No content extracted';
}

export async function layoutParsing(input: LayoutParsingInput): Promise<LayoutParsingResult> {
  if (!input.file || input.file.trim().length === 0) {
    throw new Error('File path or URL cannot be empty');
  }

  const preparedFile = await prepareFile(input.file);
  const response = await callGLMOCRAPI({
    file: preparedFile,
    model: input.model || 'glm-ocr',
  });

  const text = formatOutput(response);

  return {
    text,
    model: response.model,
    usage: response.usage,
  };
}
