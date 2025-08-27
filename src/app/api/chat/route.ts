import { NextRequest } from 'next/server';
import { HashbrownOpenAI } from '@hashbrownai/openai';
import { Chat } from '@hashbrownai/core'

export const runtime = 'nodejs'; // ensure Node runtime (not edge)

export async function POST(req: NextRequest) {
  const body: Chat.Api.CompletionCreateParams = await req.json()

  const stream = HashbrownOpenAI.stream.text({
    apiKey: process.env.OPENAI_API_KEY!,
    request: body,
  });

  // Transform the stream into a Web standard ReadableStream
  const transformStream = new TransformStream();
  const writer = transformStream.writable.getWriter();
  
  // Process the stream in the background
  (async () => {
    try {
      for await (const chunk of stream) {
        await writer.write(new TextEncoder().encode(chunk.toString()));
      }
    } catch (error) {
      console.error('Stream error:', error);
    } finally {
      await writer.close();
    }
  })();

  // Return the stream as a response
  return new Response(transformStream.readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
