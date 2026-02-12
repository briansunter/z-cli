import { Command } from 'commander';
import { vision } from '../tools/vision/api';

export const visionCommand = new Command('vision')
  .description('Analyze an image using Z.AI vision model')
  .argument('<image>', 'Image URL or local file path')
  .argument('<prompt>', 'Question or instruction about the image')
  .option('--model <model>', 'Vision model (default: glm-4.6v)')
  .option('--thinking', 'Enable thinking/reasoning mode')
  .option('--max-tokens <n>', 'Maximum tokens in response', parseInt)
  .action(async (image: string, prompt: string, opts: {
    model?: string;
    thinking?: boolean;
    maxTokens?: number;
  }) => {
    try {
      const result = await vision({
        image,
        prompt,
        model: opts.model,
        thinking: opts.thinking,
        maxTokens: opts.maxTokens,
      });

      if (result.usage) {
        console.error(`Model: ${result.model} | Tokens: ${result.usage.total_tokens}`);
        console.error('---');
      }
      console.log(result.text);
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });
