// Google Analytics utility functions
// Replace G-XXXXXXXXXX in index.html with your actual GA4 Measurement ID

interface EventParams {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Track custom events in Google Analytics
 * @param eventName - Name of the event (e.g., 'button_click', 'form_submit')
 * @param params - Additional event parameters
 */
export const trackEvent = (eventName: string, params?: EventParams) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
};

/**
 * Track page views manually (useful for SPA navigation)
 * @param path - Page path to track
 * @param title - Page title (optional)
 */
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'G-XXXXXXXXXX', {
      page_path: path,
      page_title: title || document.title,
    });
  }
};

/**
 * Track outbound link clicks
 * @param url - The destination URL
 * @param label - Optional label for the link
 */
export const trackOutboundLink = (url: string, label?: string) => {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: label || url,
    transport_type: 'beacon',
  });
};

/**
 * Track form submissions
 * @param formName - Name/ID of the form
 */
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submit', {
    event_category: 'engagement',
    event_label: formName,
  });
};

/**
 * Track CTA button clicks
 * @param buttonName - Name/ID of the button
 * @param location - Where on the page the button is located
 */
export const trackCTAClick = (buttonName: string, location?: string) => {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: buttonName,
    button_location: location,
  });
};

/**
 * Track phone call clicks
 */
export const trackPhoneClick = () => {
  trackEvent('phone_click', {
    event_category: 'contact',
    event_label: 'phone_number',
  });
};

/**
 * Track property view interactions
 * @param propertyName - Name of the property
 * @param propertyPrice - Price of the property
 */
export const trackPropertyView = (propertyName: string, propertyPrice?: number) => {
  trackEvent('property_view', {
    event_category: 'engagement',
    event_label: propertyName,
    value: propertyPrice,
  });
};

/**
 * Track scroll depth
 * @param percentage - Percentage of page scrolled (25, 50, 75, 100)
 */
export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll', {
    event_category: 'engagement',
    event_label: `${percentage}%`,
    value: percentage,
  });
};
