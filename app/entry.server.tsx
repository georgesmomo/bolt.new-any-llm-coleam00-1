import type { AppLoadContext, EntryContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { renderHeadToString } from 'remix-island';
import { Head } from './root';
import { themeStore } from '~/lib/stores/theme';
import { PassThrough } from 'stream';

// Adaptation pour Vercel
function createReadableStreamFromPassThrough(passThrough: PassThrough): ReadableStream {
  return new ReadableStream({
    start(controller) {
      passThrough.on('data', (chunk) => controller.enqueue(chunk));
      passThrough.on('end', () => controller.close());
      passThrough.on('error', (error) => controller.error(error));
    },
    cancel() {
      passThrough.destroy();
    }
  });
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false;
    const passThrough = new PassThrough();

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady() {
          responseHeaders.set('Content-Type', 'text/html');
          responseHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
          responseHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
          responseHeaders.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          responseHeaders.setHeader("Access-Control-Allow-Origin", "*");
          responseHeaders.setHeader("Access-Control-Allow-Methods", "GET");

          // Injection de l'en-tête HTML et du thème
          passThrough.write(
            `<!DOCTYPE html><html lang="en" data-theme="${themeStore.value}"><head>${renderHeadToString({
              request,
              remixContext,
              Head,
            })}</head><body><div id="root" class="w-full h-full">`
          );

          pipe(passThrough);

          passThrough.end(`</div></body></html>`);

          const readableStream = createReadableStreamFromPassThrough(passThrough);

          resolve(
            new Response(readableStream, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          );
        },
        onError(error) {
          didError = true;
          console.error('Streaming error:', error);
        },
      }
    );

    // Arrêter le flux si la requête est annulée
    request.signal?.addEventListener('abort', abort);
  });
}
