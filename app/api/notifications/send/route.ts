import { NextRequest, NextResponse } from 'next/server';
import { broadcastPushNotification, getAllPushSubscriptions } from '@/lib/web-push';

export async function GET() {
  try {
    const subscriptions = await getAllPushSubscriptions();
    return NextResponse.json({
      subscribersCount: subscriptions.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to get subscriber count' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, body: notificationBody, url, icon, tag } = body;

    if (!title || !notificationBody) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const result = await broadcastPushNotification({
      title: title.trim(),
      body: notificationBody.trim(),
      url: url || '/',
      icon: icon || '/images/school-logo-crest.png',
      tag: tag || `notif-${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      message: `Notification broadcast sent to ${result.sent} of ${result.total} devices.`,
      result,
    });
  } catch (err: any) {
    console.error('Error broadcasting push notification:', err);
    return NextResponse.json({ error: err?.message || 'Failed to send broadcast' }, { status: 500 });
  }
}
