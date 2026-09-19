import { NextRequest, NextResponse } from 'next/server';
import { parseWebhookPayload, verifyWebhookSignature } from '@/lib/whatsapp/cloud-api';

const VERIFY_TOKEN = process.env.WA_WEBHOOK_VERIFY_TOKEN;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WA Webhook] Verification successful');
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn('[WA Webhook] Verification failed', { mode, token: token?.slice(0, 10) });
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-hub-signature-256') || '';
    const rawBody = JSON.stringify(body);

    // Verify signature (optional but recommended)
    const appSecret = process.env.WA_APP_SECRET;
    if (appSecret && !verifyWebhookSignature(rawBody, signature, appSecret)) {
      console.warn('[WA Webhook] Invalid signature');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { messages, statuses, contacts } = parseWebhookPayload(body);

    // Handle incoming messages
    for (const msg of messages) {
      console.log('[WA Webhook] Incoming message:', {
        id: msg.id,
        from: msg.from,
        type: msg.type,
        text: msg.text?.body?.slice(0, 100)
      });
      
      // TODO: Process incoming message (notify Telegram, update DB, etc.)
      // This is where you'd handle replies from prospects
    }

    // Handle delivery statuses
    for (const status of statuses) {
      console.log('[WA Webhook] Status update:', {
        id: status.id,
        status: status.status,
        recipient: status.recipient_id
      });
      // TODO: Update outreachLog with delivery status
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('[WA Webhook] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}