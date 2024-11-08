// @ts-nocheck
// Preventing TS checks with files presented in the video for a better presentation.
import { env } from 'node:process';

export function getAPIKey(cloudflareEnv: Env, provider: string) {
  /**
   * The `cloudflareEnv` is only used when deployed or when previewing locally.
   * In development the environment variables are available through `env`.
   */
/* on adapte pour faire fonctionner sur vercel, on ajoute process devant env
  switch (provider) {
    case 'Anthropic':
      return process.env.ANTHROPIC_API_KEY || cloudflareEnv.ANTHROPIC_API_KEY;
    case 'OpenAI':
      return process.env.OPENAI_API_KEY || cloudflareEnv.OPENAI_API_KEY;
    case 'Google':
      return process.env.GOOGLE_GENERATIVE_AI_API_KEY || cloudflareEnv.GOOGLE_GENERATIVE_AI_API_KEY;
    case 'Groq':
      return process.env.GROQ_API_KEY || cloudflareEnv.GROQ_API_KEY;
    case 'OpenRouter':
      return process.env.OPEN_ROUTER_API_KEY || cloudflareEnv.OPEN_ROUTER_API_KEY;
    case 'Deepseek':
      return process.env.DEEPSEEK_API_KEY || cloudflareEnv.DEEPSEEK_API_KEY
    case 'Mistral':
      return process.env.MISTRAL_API_KEY || cloudflareEnv.MISTRAL_API_KEY;        
    case "OpenAILike":
      return process.env.OPENAI_LIKE_API_KEY || cloudflareEnv.OPENAI_LIKE_API_KEY;
    default:
      return "";
  }
}

export function getBaseURL(cloudflareEnv: Env, provider: string) {
  switch (provider) {
    case 'OpenAILike':
      return process.env.OPENAI_LIKE_API_BASE_URL || cloudflareEnv.OPENAI_LIKE_API_BASE_URL;
    case 'Ollama':
        return process.env.OLLAMA_API_BASE_URL || cloudflareEnv.OLLAMA_API_BASE_URL || "http://localhost:11434";
    default:
      return "";
  }
}
  */

switch (provider) {
  case 'Anthropic':
    return process.env.ANTHROPIC_API_KEY || cloudflareEnv.ANTHROPIC_API_KEY;
  case 'OpenAI':
    return process.env.OPENAI_API_KEY || cloudflareEnv.OPENAI_API_KEY;
  case 'Google':
    return process.env.GOOGLE_GENERATIVE_AI_API_KEY || cloudflareEnv.GOOGLE_GENERATIVE_AI_API_KEY;
  case 'Groq':
    return process.env.GROQ_API_KEY || cloudflareEnv.GROQ_API_KEY;
  case 'OpenRouter':
    return process.env.OPEN_ROUTER_API_KEY || cloudflareEnv.OPEN_ROUTER_API_KEY;
  case 'Deepseek':
    return process.env.DEEPSEEK_API_KEY || cloudflareEnv.DEEPSEEK_API_KEY
  case 'Mistral':
    return process.env.MISTRAL_API_KEY || cloudflareEnv.MISTRAL_API_KEY;        
  case "OpenAILike":
    return process.env.OPENAI_LIKE_API_KEY || cloudflareEnv.OPENAI_LIKE_API_KEY;
  default:
    return "";
}
}

export function getBaseURL(cloudflareEnv: Env, provider: string) {
switch (provider) {
  case 'OpenAILike':
    return process.env.OPENAI_LIKE_API_BASE_URL || cloudflareEnv.OPENAI_LIKE_API_BASE_URL;
  case 'Ollama':
      return process.env.OLLAMA_API_BASE_URL || cloudflareEnv.OLLAMA_API_BASE_URL || "http://localhost:11434";
  default:
    return "";
}
}
