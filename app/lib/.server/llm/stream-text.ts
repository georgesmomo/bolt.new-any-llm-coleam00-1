// @ts-nocheck
// Preventing TS checks with files presented in the video for a better presentation.
import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { getModel } from '~/lib/.server/llm/model';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';
import { MODEL_LIST, DEFAULT_MODEL, DEFAULT_PROVIDER } from '~/utils/constants';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
  model?: string;
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

/**
 * Extracts the model from a message if specified in the format "[Model: model_name]"
 * and returns the model along with the cleaned-up content.
 */
function extractModelFromMessage(message: Message): { model: string; content: string } {
  const modelRegex = /^\[Model: (.*?)\]\n\n/;
  const match = message.content.match(modelRegex);

  if (match) {
    const model = match[1];
    const content = message.content.replace(modelRegex, '');
    return { model, content };
  }

  // Use default model if none is specified
  return { model: DEFAULT_MODEL, content: message.content };
}

/**
 * Streams text from the provided messages, selecting the appropriate model and provider.
 */
export function streamText(messages: Messages, env: Env, options?: StreamingOptions) {
  let currentModel = DEFAULT_MODEL;

  // Process each message, extracting models and updating currentModel if a valid one is found
  const processedMessages = messages.map((message) => {
    if (message.role === 'user') {
      const { model, content } = extractModelFromMessage(message);
      if (model && MODEL_LIST.some((m) => m.name === model)) {
        currentModel = model; // Update the current model based on the user's specification
      }
      return { ...message, content };
    }
    return message;
  });

  // Determine the provider for the current model, falling back to the default if not found
  const provider = MODEL_LIST.find((model) => model.name === currentModel)?.provider || DEFAULT_PROVIDER;

  // Stream the text using the selected model and options
  return _streamText({
    model: getModel(provider, currentModel, env),
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    messages: convertToCoreMessages(processedMessages),
    ...options,
  });
}
