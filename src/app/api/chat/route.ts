import { NextRequest } from 'next/server';
import { HashbrownOpenAI } from '@hashbrownai/openai';

export const runtime = 'nodejs'; // ensure Node runtime (not edge)

export async function POST(req: Request) {

  const stream = HashbrownOpenAI.stream.text({
    
  });

  const res = new Response(stream);

  res.header('Content-Type', 'application/octet-stream');

  for await (const chunk of stream) {
    res.write(chunk);
  }

  res.end();
}
