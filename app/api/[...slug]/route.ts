import serverless from 'serverless-http';
import { app } from '@/api/server';

const expressHandler = serverless(app);

async function forward(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params;
  const url = new URL(request.url);
  const body = Buffer.from(await request.arrayBuffer());
  const headers = Object.fromEntries(request.headers.entries());
  const result = await expressHandler({
    httpMethod: request.method,
    path: `/api/${slug.join('/')}`,
    headers,
    queryStringParameters: Object.fromEntries(url.searchParams.entries()),
    body: body.length ? body.toString('utf8') : null,
    isBase64Encoded: false,
  }, {}) as { statusCode: number; headers?: Record<string, string | string[]>; body?: string; isBase64Encoded?: boolean };
  const responseHeaders = new Headers();
  Object.entries(result.headers ?? {}).forEach(([key, value]) => responseHeaders.set(key, String(value)));
  const responseBody = [204, 205, 304].includes(result.statusCode) ? null : result.isBase64Encoded ? Buffer.from(result.body ?? '', 'base64') : result.body ?? '';
  return new Response(responseBody, { status: result.statusCode, headers: responseHeaders });
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
