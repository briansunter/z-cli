export function getApiKey(): string {
  const key = process.env.Z_AI_API_KEY;
  if (!key) {
    throw new Error('Z_AI_API_KEY environment variable is not set');
  }
  return key;
}
