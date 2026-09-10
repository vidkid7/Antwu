import { getPublicContent } from '@/lib/server/store';
export const dynamic = 'force-dynamic';
export async function GET() { return Response.json(getPublicContent(), { headers: { 'Cache-Control': 'no-store' } }); }
