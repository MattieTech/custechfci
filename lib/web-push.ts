import webpush from 'web-push';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BL5kvgSe2StMcW2uZ_EQxU2F4hzUm5JBTTzizjOJ8kJD5edPbk2NfLyMsuRteZnf59Qh5BoFcR2f2HVwMbUiKAQ';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '0TArlLf9MlQVZuRjaDnb018chI6K43EP706aOvgNsf0';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@custech.edu.ng';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

export interface StoredSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: string;
  userAgent?: string;
  department?: string;
  level?: string;
}

const BUCKET_NAME = 'push_data';

// Helper to get safe file name from endpoint
function getSubscriptionFileName(endpoint: string): string {
  const hash = crypto.createHash('sha256').update(endpoint).digest('hex');
  return `subscriptions/${hash}.json`;
}

// Ensure the push_data bucket exists
async function ensureBucket(supabaseAdmin: ReturnType<typeof createAdminClient>) {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = (buckets || []).some((b) => b.name === BUCKET_NAME);
    if (!exists) {
      await supabaseAdmin.storage.createBucket(BUCKET_NAME, { public: false });
    }
  } catch (e) {
    console.error('Error ensuring push_data bucket exists:', e);
  }
}

/**
 * Save or update a push subscription
 */
export async function savePushSubscription(sub: StoredSubscription) {
  const supabaseAdmin = createAdminClient();
  await ensureBucket(supabaseAdmin);

  const fileName = getSubscriptionFileName(sub.endpoint);
  const dataBuffer = Buffer.from(JSON.stringify(sub, null, 2));

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(fileName, dataBuffer, {
      contentType: 'application/json',
      upsert: true,
    });

  if (error) {
    console.error('Failed to save push subscription:', error);
    throw error;
  }
  return { success: true };
}

/**
 * Delete a push subscription
 */
export async function deletePushSubscription(endpoint: string) {
  const supabaseAdmin = createAdminClient();
  const fileName = getSubscriptionFileName(endpoint);
  await supabaseAdmin.storage.from(BUCKET_NAME).remove([fileName]);
  return { success: true };
}

/**
 * Get all active push subscriptions
 */
export async function getAllPushSubscriptions(): Promise<StoredSubscription[]> {
  const supabaseAdmin = createAdminClient();
  await ensureBucket(supabaseAdmin);

  const { data: files, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .list('subscriptions', { limit: 1000 });

  if (error || !files) {
    console.error('Error listing subscriptions:', error);
    return [];
  }

  const subscriptions: StoredSubscription[] = [];

  for (const file of files) {
    if (!file.name.endsWith('.json')) continue;
    try {
      const { data: blob, error: downloadError } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .download(`subscriptions/${file.name}`);

      if (downloadError || !blob) continue;
      const text = await blob.text();
      const parsed = JSON.parse(text);
      if (parsed.endpoint && parsed.keys?.p256dh && parsed.keys?.auth) {
        subscriptions.push(parsed);
      }
    } catch (e) {
      console.warn(`Failed reading subscription file ${file.name}:`, e);
    }
  }

  return subscriptions;
}

/**
 * Broadcast a notification to all subscribed student devices
 */
export async function broadcastPushNotification({
  title,
  body,
  url = '/',
  icon = '/images/school-logo-crest.png',
  tag,
}: {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  tag?: string;
}) {
  const subscriptions = await getAllPushSubscriptions();
  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0, total: 0 };
  }

  const payload = JSON.stringify({
    title,
    body,
    url,
    icon,
    tag: tag || `fci-notif-${Date.now()}`,
    timestamp: Date.now(),
  });

  let sent = 0;
  let failed = 0;
  const expiredEndpoints: string[] = [];

  const promises = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.keys.p256dh,
            auth: sub.keys.auth,
          },
        },
        payload
      );
      sent++;
    } catch (err: any) {
      failed++;
      // If subscription expired or unsubscribed, mark for pruning (HTTP 410 or 404)
      if (err.statusCode === 410 || err.statusCode === 404) {
        expiredEndpoints.push(sub.endpoint);
      }
    }
  });

  await Promise.all(promises);

  // Clean up expired subscriptions
  if (expiredEndpoints.length > 0) {
    for (const endpoint of expiredEndpoints) {
      await deletePushSubscription(endpoint).catch(() => {});
    }
  }

  return { sent, failed, total: subscriptions.length };
}
