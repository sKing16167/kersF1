'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { isAnalyticsPermitted, trackPageView } from '@/lib/analytics';
import { CONSENT_EVENT_NAME } from '@/components/ui/CookieConsentBanner';

export function AnalyticsProvider() {
  const pathname = usePathname();
  const [hasConsent, setHasConsent] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    // Initial consent check on mount
    setHasConsent(isAnalyticsPermitted());

    // Listen for live consent updates from CookieConsentBanner
    const onConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ status: string }>;
      setHasConsent(customEvent.detail?.status === 'accepted');
    };

    window.addEventListener(CONSENT_EVENT_NAME, onConsentUpdate);
    return () => {
      window.removeEventListener(CONSENT_EVENT_NAME, onConsentUpdate);
    };
  }, []);

  // Track page views on route change if consent is granted
  useEffect(() => {
    if (hasConsent && pathname) {
      trackPageView(pathname);
    }
  }, [pathname, hasConsent]);

  // If no Google Analytics ID is provided or user has not consented, do not inject scripts
  if (!gaId || !hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="kers-google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  );
}
