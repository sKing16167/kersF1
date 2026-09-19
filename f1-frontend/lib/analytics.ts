/**
 * KERS F1 - Privacy-First Telemetry Analytics Service
 * Strictly respects GDPR/ePrivacy user consent before emitting client metrics.
 */

import { CONSENT_STORAGE_KEY } from '@/components/ui/CookieConsentBanner';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function isAnalyticsPermitted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted';
  } catch {
    return false;
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (!isAnalyticsPermitted()) return;

  // 1. Google Analytics integration (if configured)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // 2. Local telemetry diagnostics logger in development mode
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[KERS Analytics] Event: ${eventName}`, params);
  }
}

export function trackPageView(url: string) {
  if (!isAnalyticsPermitted()) return;

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: url,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.debug(`[KERS Analytics] PageView: ${url}`);
  }
}

export function trackCircuitView(circuitId: number, circuitName: string) {
  trackEvent('view_circuit', {
    circuit_id: circuitId,
    circuit_name: circuitName,
  });
}

export function trackDriverComparison(driverA: string, driverB: string, circuitName?: string) {
  trackEvent('compare_telemetry', {
    driver_a: driverA,
    driver_b: driverB,
    circuit: circuitName,
  });
}
