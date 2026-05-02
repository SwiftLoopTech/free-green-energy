# Analytics and Clarity Setup

This file is the handoff checklist for adding free Google and Microsoft tracking to the site without changing the visual design.

## Fill These Placeholders

Use these exact placeholder keys when you collect the values:

```text
GTM_CONTAINER_ID=GTM-XXXXXXX
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_PROPERTY_ID=123456789
GA4_WEB_STREAM_NAME=FGE Solar Main Site
GOOGLE_SEARCH_CONSOLE_VERIFICATION_TAG=PASTE_META_TAG_CONTENT_ONLY
MICROSOFT_CLARITY_PROJECT_ID=xxxxxxxxxx
GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXX
GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXXXXXXXX
GOOGLE_BUSINESS_PROFILE_URL=https://g.page/r/...
```

## Where To Get Each Value

- `GTM_CONTAINER_ID`: Google Tag Manager container ID from `tagmanager.google.com`
- `GA4_MEASUREMENT_ID`: Web stream measurement ID from Google Analytics 4
- `GA4_PROPERTY_ID`: GA4 property numeric ID
- `GOOGLE_SEARCH_CONSOLE_VERIFICATION_TAG`: content value from the Search Console HTML meta verification tag
- `MICROSOFT_CLARITY_PROJECT_ID`: project ID from `clarity.microsoft.com`
- `GOOGLE_ADS_CONVERSION_ID` and `GOOGLE_ADS_CONVERSION_LABEL`: only if running Google Ads later

## Recommended Free Stack

- Google Tag Manager
- Google Analytics 4
- Google Search Console
- Microsoft Clarity

## Recommended Install Order

1. Create or confirm the GA4 property and web stream.
2. Create a GTM container for the same domain.
3. Add the GA4 tag inside GTM.
4. Create a Microsoft Clarity project.
5. Add Search Console domain property and verify ownership.
6. Publish GTM after testing in preview mode.

## Snippet Placement

Add the following after real IDs are available.

### 1. Google Tag Manager `<head>` snippet

Place immediately after the opening `<head>` tag on every page.

```html
<!-- Google Tag Manager -->
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');
</script>
<!-- End Google Tag Manager -->
```

### 2. Google Tag Manager `<body>` snippet

Place immediately after the opening `<body>` tag on every page.

```html
<!-- Google Tag Manager (noscript) -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->
```

### 3. Search Console verification meta tag

Place in the `<head>` of the homepage and keep it there during verification.

```html
<meta name="google-site-verification" content="PASTE_META_TAG_CONTENT_ONLY">
```

### 4. Microsoft Clarity

If you do not want to manage Clarity through GTM, place this before `</head>` on every page.

```html
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "xxxxxxxxxx");
</script>
```

## Events To Track

Track these through GTM and GA4:

- `generate_lead` for contact form submissions
- `whatsapp_click`
- `phone_click`
- `calculator_started`
- `calculator_completed`
- `district_page_view`
- `subsidy_page_view`
- `project_page_view`
- `form_submit_site_visit`

## Recommended Form Hidden Fields

Pass these values into every lead form:

```text
page_url
page_title
lead_source
lead_medium
lead_campaign
first_landing_page
district_interest
calculator_bill_range
calculator_system_size
gclid
gbraid
wbraid
msclkid
utm_source
utm_medium
utm_campaign
utm_id
utm_term
utm_content
```

## QA Checklist Before Publish

- GTM preview confirms page view fires on all main templates
- GA4 Realtime shows visits from homepage, blog, subsidy, and contact pages
- Clarity receives sessions
- Search Console verification passes
- No layout shift or visual break after snippet insertion
- Contact form still submits correctly
- WhatsApp and phone click events are visible in GA4 DebugView

## Current Repo Status

This repo now has the handoff documentation and placeholders.
Live tracking IDs have not been injected yet because real account values are still needed.
