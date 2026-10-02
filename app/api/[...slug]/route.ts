import { createServer } from 'node:http';
import { app } from '@/api/server';

async function forward(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params;
  const incomingUrl = new URL(request.url);
  const body = Buffer.from(await request.arrayBuffer());
  const server = createServer(app);
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', () => resolve()); });
  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Unable to start API bridge');
    const headers = new Headers(request.headers);
    headers.delete('host');
    const response = await fetch(`http://127.0.0.1:${address.port}/api/${slug.join('/')}${incomingUrl.search}`, { method: request.method, headers, body: ['GET', 'HEAD'].includes(request.method) ? undefined : body });
    const responseBody = [204, 205, 304].includes(response.status) ? null : await response.arrayBuffer();
    return new Response(responseBody, { status: response.status, headers: response.headers });
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
