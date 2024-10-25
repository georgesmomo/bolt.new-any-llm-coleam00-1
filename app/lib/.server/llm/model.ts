// @ts-nocheck
// Preventing TS checks with files presented in the video for a better presentation.
import { getAPIKey, getBaseURL } from '~/lib/.server/llm/api-key';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { ollama } from 'ollama-ai-provider';
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createMistral } from '@ai-sdk/mistral';

/**
 * Initializes the Anthropic model.
 * @param apiKey - The API key for Anthropic.
 * @param model - The model name.
 */
export function getAnthropicModel(apiKey: string, model: string) {
  const anthropic = createAnthropic({ apiKey });
  return anthropic(model);
}

/**
 * Initializes an OpenAI-like model with a base URL.
 * @param baseURL - The base URL for the API.
 * @param apiKey - The API key.
 * @param model - The model name.
 */
export function getOpenAILikeModel(baseURL: string, apiKey: string, model: string) {
  const openai = createOpenAI({ baseURL, apiKey });
  return openai(model);
}

/**
 * Initializes an OpenAI model.
 * @param apiKey - The API key for OpenAI.
 * @param model - The model name.
 */
export function getOpenAIModel(apiKey: string, model: string) {
  const openai = createOpenAI({ apiKey });
  return openai(model);
}

/**
 * Initializes a Mistral model.
 * @param apiKey - The API key for Mistral.
 * @param model - The model name.
 */
export function getMistralModel(apiKey: string, model: string) {
  const mistral = createMistral({ apiKey });
  return mistral(model);
}

/**
 * Initializes a Google Generative AI model.
 * @param apiKey - The API key for Google.
 * @param model - The model name.
 */
export function getGoogleModel(apiKey: string, model: string) {
  const google = createGoogleGenerativeAI(apiKey);
  return google(model);
}

/**
 * Initializes a Groq model.
 * @param apiKey - The API key for Groq.
 * @param model - The model name.
 */
export function getGroqModel(apiKey: string, model: string) {
  const openai = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey,
  });
  return openai(model);
}

/**
 * Initializes an Ollama model.
 * @param baseURL - The base URL for the API.
 * @param model - The model name.
 */
export function getOllamaModel(baseURL: string, model: string) {
  let Ollama = ollama(model);
  Ollama.config.baseURL = `${baseURL}/api`;
  return Ollama;
}

/**
 * Initializes a Deepseek model.
 * @param apiKey - The API key for Deepseek.
 * @param model - The model name.
 */
export function getDeepseekModel(apiKey: string, model: string) {
  const openai = createOpenAI({
    baseURL: 'https://api.deepseek.com/beta',
    apiKey,
  });
  return openai(model);
}

/**
 * Initializes an OpenRouter model.
 * @param apiKey - The API key for OpenRouter.
 * @param model - The model name.
 */
export function getOpenRouterModel(apiKey: string, model: string) {
  const openRouter = createOpenRouter({ apiKey });
  return openRouter.chat(model);
}

/**
 * Retrieves a model based on the provider.
 * @param provider - The name of the provider.
 * @param model - The model name.
 * @param env - The environment variables object.
 */
export function getModel(provider: string, model: string, env: Env) {
  const apiKey = getAPIKey(env, provider);
  if (!apiKey) {
    throw new Error(`API key for provider ${provider} is missing.`);
  }

  const baseURL = getBaseURL(env, provider);
  if (provider === 'OpenAILike' && !baseURL) {
    throw new Error(`Base URL for provider ${provider} is missing.`);
  }

  switch (provider) {
    case 'Anthropic':
      return getAnthropicModel(apiKey, model);
    case 'OpenAI':
      return getOpenAIModel(apiKey, model);
    case 'Groq':
      return getGroqModel(apiKey, model);
    case 'OpenRouter':
      return getOpenRouterModel(apiKey, model);
    case 'Google':
      return getGoogleModel(apiKey, model);
    case 'OpenAILike':
      return getOpenAILikeModel(baseURL, apiKey, model);
    case 'Deepseek':
      return getDeepseekModel(apiKey, model);
    case 'Mistral':
      return getMistralModel(apiKey, model);
    default:
      return getOllamaModel(baseURL, model);
  }
}
