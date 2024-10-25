// @ts-nocheck
// Preventing TS checks with files presented in the video for a better presentation.
import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS } from '~/lib/.server/llm/constants';
import { CONTINUE_PROMPT } from '~/lib/.server/llm/prompts';
import { streamText, type Messages, type StreamingOptions } from '~/lib/.server/llm/stream-text';
import SwitchableStream from '~/lib/.server/llm/switchable-stream';

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

async function chatAction({ context, request }: ActionFunctionArgs) {
  try {
    // Récupération des messages depuis la requête
    const { messages } = await request.json<{ messages: Messages }>();

    // Création d'un nouveau flux
    const stream = new SwitchableStream();

    const options: StreamingOptions = {
      toolChoice: 'none',
      onFinish: async ({ text: content, finishReason }) => {
        if (finishReason !== 'length') {
          return stream.close();
        }

        if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
          throw new Error('Cannot continue message: Maximum segments reached');
        }

        const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches;
        console.log(`Reached max token limit (${MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`);

        // Ajout des messages de continuation
        messages.push({ role: 'assistant', content });
        messages.push({ role: 'user', content: CONTINUE_PROMPT });

        // Génération d'une réponse continue
        const result = await streamText(messages, context.cloudflare.env, options);
        return stream.switchSource(result.toAIStream());
      },
    };

    // Initialisation du flux de texte
    const result = await streamText(messages, context.cloudflare.env, options);
    stream.switchSource(result.toAIStream());

    // Retourne la réponse avec le flux de texte lisible
    return new Response(stream.readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error processing chat action:', error);

    // Retourne une réponse d'erreur avec un statut HTTP 500
    return new Response('Internal Server Error', {
      status: 500,
    });
  }
}
