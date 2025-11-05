# Google Analytics Setup Instructions

## Step 1: Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use an existing one)
3. Navigate to **Admin** → **Data Streams** → Select your web stream
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

## Step 2: Add Your Measurement ID to the Project

Replace `G-XXXXXXXXXX` with your actual Measurement ID in these files:

### File 1: `index.html`
Find and replace both instances on lines 28 and 31:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID-HERE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR-ID-HERE', {
    page_path: window.location.pathname,
    send_page_view: true
  });
</script>
```

### File 2: `src/lib/analytics.ts`
Replace on line 27:
```typescript
gtag('config', 'G-YOUR-ID-HERE', {
  page_path: path,
  page_title: title || document.title,
});
```

## What's Being Tracked

### Automatic Tracking
- **Page views** - Every page load
- **Scroll depth** - At 25%, 50%, 75%, and 100% of page
- **Core Web Vitals** - Performance metrics

### Custom Events
- **CTA Clicks** - "Schedule Consultation" buttons with location context
- **Phone Clicks** - "Call Now" button clicks
- **Form Submissions** - Contact form submissions
- **Property Views** - Property card interactions (when implemented)
- **Outbound Links** - External link clicks

### Event Categories
All custom events are organized into categories:
- `engagement` - User interactions (CTAs, scroll, properties)
- `contact` - Communication actions (phone, email)
- `outbound` - External link clicks

## Analytics Dashboard

After setup, you can view:
1. **Real-time** - Live user activity
2. **Engagement** - Time on page, scroll depth, interactions
3. **Conversions** - Form submissions, CTA clicks
4. **Mobile vs Desktop** - Device-specific behavior
5. **Traffic Sources** - Where visitors come from
6. **Page Performance** - Load times, Core Web Vitals

## Custom Analytics Functions

Use these functions anywhere in your code:

```typescript
import { trackEvent, trackCTAClick, trackFormSubmission } from '@/lib/analytics';

// Track custom events
trackEvent('custom_event_name', { 
  category: 'category',
  label: 'label',
  value: 123 
});

// Track CTA clicks
trackCTAClick('Button Name', 'section_name');

// Track form submissions
trackFormSubmission('form_name');
```

## Testing Your Setup

1. Deploy your changes
2. Visit your website
3. Open Google Analytics Real-time view
4. You should see your session appear within 30 seconds
5. Interact with CTAs and forms to verify event tracking

## Privacy Compliance

Consider adding a cookie consent banner if required by your jurisdiction (GDPR, CCPA, etc.). The current setup uses GA4's default cookie settings.

## Support

For issues or questions about the analytics implementation, refer to:
- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- Project analytics utility: `src/lib/analytics.ts`
