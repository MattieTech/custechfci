'use client';

import { useEffect, useState } from 'react';
import { Bell, BellRing, BellOff, Check, X, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BL5kvgSe2StMcW2uZ_EQxU2F4hzUm5JBTTzizjOJ8kJD5edPbk2NfLyMsuRteZnf59Qh5BoFcR2f2HVwMbUiKAQ';

export function NotificationBell() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  const [showPromptBanner, setShowPromptBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Check current subscription
      navigator.serviceWorker.ready.then(async (reg) => {
        try {
          const sub = await reg.pushManager.getSubscription();
          setIsSubscribed(!!sub);

          // Show polite prompt after 4 seconds if not yet subscribed and not denied
          const dismissed = localStorage.getItem('fci_notif_dismissed');
          if (!sub && Notification.permission === 'default' && !dismissed) {
            const timer = setTimeout(() => {
              setShowPromptBanner(true);
            }, 4000);
            return () => clearTimeout(timer);
          }
        } catch (e) {
          console.warn('Push subscription check error:', e);
        }
      });
    }
  }, []);

  const subscribeToPush = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported by this browser.');
      return;
    }

    setLoading(true);
    try {
      // 1. Request permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== 'granted') {
        toast.error('Notification permission was not granted.', {
          description: 'You can enable notifications in your browser or phone site settings anytime.',
        });
        setLoading(false);
        setShowPromptBanner(false);
        return;
      }

      // 2. Get SW registration
      const reg = await navigator.serviceWorker.ready;

      // 3. Subscribe with VAPID key
      const convertedKey = urlB64ToUint8Array(VAPID_PUBLIC_KEY);
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      // 4. Send to server
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save push subscription on server');
      }

      setIsSubscribed(true);
      setShowPromptBanner(false);
      localStorage.setItem('fci_notif_subscribed', 'true');

      toast.success('Notifications Enabled!', {
        description: 'You will receive timely alerts for announcements, timetables, and materials even when offline.',
      });

      // Show welcome notification
      if ('showNotification' in reg) {
        reg.showNotification('CUSTECH FCI — Notifications Active', {
          body: 'You are now set up to receive instant alerts on exam updates and materials.',
          icon: '/images/school-logo-crest.png',
          badge: '/images/school-logo-crest.png',
        });
      }
    } catch (err: any) {
      console.error('Push subscribe error:', err);
      toast.error('Could not enable notifications', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/notifications/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setIsSubscribed(false);
      localStorage.removeItem('fci_notif_subscribed');
      toast.info('Notifications turned off');
    } catch (err: any) {
      toast.error('Failed to unsubscribe', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) return null;

  return (
    <>
      {/* Header Bell Button */}
      <button
        onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
        disabled={loading}
        title={
          isSubscribed
            ? 'Notifications active (Click to mute)'
            : 'Enable push notifications for announcements & materials'
        }
        className={`relative p-2 rounded-xl border transition-all duration-200 ${
          isSubscribed
            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
            : 'bg-brand-50/80 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300 hover:text-brand-900 dark:hover:text-white border-brand-200 dark:border-brand-800 hover:bg-brand-100'
        }`}
      >
        {isSubscribed ? (
          <BellRing className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
        ) : (
          <Bell className="w-4 h-4" />
        )}
        {!isSubscribed && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-600 dark:bg-brand-400 rounded-full animate-ping" />
        )}
      </button>

      {/* Polite Floating Notification Prompt (First-time visitors) */}
      {showPromptBanner && !isSubscribed && permission === 'default' && (
        <div className="fixed bottom-20 left-4 sm:left-auto right-4 sm:right-6 z-40 w-auto sm:w-full sm:max-w-sm bg-white dark:bg-brand-900 p-4 rounded-2xl shadow-xl border border-brand-200 dark:border-brand-800 animate-fade-in print:hidden">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-200 rounded-xl shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1">
              <h4 className="font-heading font-bold text-sm text-brand-900 dark:text-brand-100">
                Get Instant Portal Updates
              </h4>
              <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5 leading-relaxed">
                Stay updated when timetable schedules, past questions, or faculty announcements are published — even when the app is closed.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={subscribeToPush}
                  disabled={loading}
                  className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Check size={13} />
                  <span>{loading ? 'Enabling...' : 'Enable Alerts'}</span>
                </button>
                <button
                  onClick={() => {
                    setShowPromptBanner(false);
                    localStorage.setItem('fci_notif_dismissed', 'true');
                  }}
                  className="px-3 py-1.5 text-xs text-brand-500 hover:text-brand-700 font-medium"
                >
                  Later
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setShowPromptBanner(false);
                localStorage.setItem('fci_notif_dismissed', 'true');
              }}
              className="text-brand-400 hover:text-brand-600 p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

