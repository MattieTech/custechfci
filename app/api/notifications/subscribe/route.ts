import { NextRequest, NextResponse } from 'next/server';
import { savePushSubscription, deletePushSubscription } from '@/lib/web-push';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, userAgent, department, level } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Invalid subscription payload' }, { status: 400 });
    }

    await savePushSubscription({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      createdAt: new Date().toISOString(),
      userAgent: userAgent || request.headers.get('user-agent') || 'Unknown',
      department: department || 'General',
      level: level || 'All',
    });

    return NextResponse.json({ success: true, message: 'Subscribed to push notifications' });
  } catch (err: any) {
    console.error('Error saving subscription:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save subscription' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json();
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint required' }, { status: 400 });
    }

    await deletePushSubscription(endpoint);
    return NextResponse.json({ success: true, message: 'Unsubscribed from notifications' });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to unsubscribe' }, { status: 500 });
  }
}

