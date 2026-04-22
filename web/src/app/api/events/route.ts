import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { NextResponse } from 'next/server';

const ALLOWED_TYPES = new Set([
  'stream_check',
  'song_favorite',
  'share',
  'download',
]);

const TABLE_NAME = process.env.EVENTS_TABLE_NAME || 'danin-log-events';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-northeast-1',
  ...(process.env.DYNAMODB_ENDPOINT && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
  }),
});

type EventPayload = {
  type: string;
  action: string;
  targetId?: string;
  page?: string;
};

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: EventPayload;
  try {
    const text = await request.text();
    body = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(body.type) || !body.action) {
    return new NextResponse(null, { status: 400 });
  }

  const now = new Date().toISOString();
  const id = `${now}#${crypto.randomUUID()}`;

  try {
    await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
          pk: { S: body.type },
          sk: { S: id },
          action: { S: body.action },
          target_id: { S: body.targetId || '' },
          page: { S: body.page || '' },
          created_at: { S: now },
        },
      }),
    );
  } catch (err) {
    console.error('[events] DynamoDB write failed:', err);
    return new NextResponse(null, { status: 503 });
  }

  return new NextResponse(null, { status: 204 });
}
