# FGE Solar Marketing Lead Stack

## What the current site already has

- Static landing pages, district pages, blog pages, and a calculator.
- Lead forms already post to Web3Forms from [`assets/js/forms.js`](C:/Users/Home/Downloads/fgesolar.in/assets/js/forms.js).
- Existing event hooks already fire for form submits, WhatsApp clicks, phone clicks, calculator completion, and blog engagement from [`assets/js/global.js`](C:/Users/Home/Downloads/fgesolar.in/assets/js/global.js) and [`assets/js/calculator.js`](C:/Users/Home/Downloads/fgesolar.in/assets/js/calculator.js).
- The main gap is that no actual analytics/CRM stack is connected yet, so intent signals are not becoming daily follow-up work.

## Best realistic setup

### Free-first stack

1. Google Tag Manager
   - Add all tracking scripts through one place.
   - Use it to manage GA4, Clarity, Meta Pixel, and custom lead events without editing every page again.

2. GA4
   - Track page views, district-page visits, calculator completions, WhatsApp clicks, phone clicks, and lead form submissions.
   - Best for source/medium/campaign reporting and landing-page performance.

3. Microsoft Clarity
   - Free heatmaps and session recordings.
   - Best for seeing why users do not submit forms.

4. Web3Forms + Google Sheets or CRM
   - Keep Web3Forms for quick form delivery.
   - Forward every lead into a sheet or CRM instead of relying on email inboxes.

5. Zoho CRM or HubSpot CRM
   - Use as the marketing head’s daily lead queue.
   - Store source, district, bill range, property type, calculator intent, and follow-up status.

### Paid stack worth considering later

1. Official WhatsApp Business API through Zoho, WATI, Interakt, or Brevo
   - For structured follow-up, reminders, and reactivation campaigns.

2. Meta Pixel + retargeting ads
   - Useful only after GA4 and CRM are clean.
   - Good for visitors who used calculator or opened contact page but did not submit.

3. Call tracking
   - Useful later if phone calls become a major lead source.

## What data to capture from every lead

### Must-have

- Name
- Mobile / WhatsApp
- Email
- District
- Monthly bill band
- Property type
- Lead source form id
- Landing page URL
- First page seen
- Referrer
- UTM source / medium / campaign / content / term
- Submission timestamp

### High-value intent fields

- Calculator completed: yes/no
- Estimated system size
- Estimated subsidy
- Estimated savings
- Visited district page: yes/no
- Visited subsidy page: yes/no
- Visited commercial page: yes/no
- Clicked WhatsApp before submit: yes/no
- Number of sessions before lead

### Lead score idea

- `+30` calculator completed
- `+20` visited contact page
- `+15` visited district page
- `+15` monthly bill above higher-value threshold
- `+10` clicked WhatsApp
- `+10` visited subsidy page

## What should be implemented on this site

### 1. Install tracking foundation

- Add GTM sitewide.
- Publish GA4 through GTM.
- Publish Clarity through GTM.

### 2. Enrich form submissions

In [`assets/js/forms.js`](C:/Users/Home/Downloads/fgesolar.in/assets/js/forms.js), add hidden values before submit:

- `page_title`
- `page_url`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `fbclid`
- `first_touch_page`
- `first_touch_time`
- `calculator_completed`
- `estimated_system_size`
- `estimated_subsidy`
- `estimated_monthly_savings`

### 3. Turn calculator into a lead qualifier

In [`assets/js/calculator.js`](C:/Users/Home/Downloads/fgesolar.in/assets/js/calculator.js):

- Save calculator outputs to `sessionStorage`.
- Pre-fill the lead form with those values.
- Send a GA4 event with district, bill band, recommended system size, and subsidy band.

### 4. Make WhatsApp measurable

In [`assets/js/global.js`](C:/Users/Home/Downloads/fgesolar.in/assets/js/global.js):

- Expand the current `whatsapp_click` event to include page type, district, and CTA position.
- Use different prefilled WhatsApp messages for home, commercial, calculator, and subsidy visitors so the team knows user intent immediately.

### 5. Push leads into a working queue

Minimum version:

- Web3Forms -> email
- Email -> Google Sheets through automation
- Marketing head updates status manually

Better version:

- Web3Forms -> Zapier / Make -> Zoho CRM or HubSpot CRM
- Auto-create lead owner, lead score, last activity, next follow-up date

## Best tool choices for FGE Solar

### Cheapest good setup

- GTM
- GA4
- Clarity
- Web3Forms
- Google Sheets
- Make or Zapier only if needed

This is enough to start getting usable daily work for marketing.

### Best practical business setup

- GTM
- GA4
- Clarity
- Web3Forms
- Zoho CRM
- WhatsApp Business integration later

This is the best balance if the team wants lead tracking plus follow-up discipline.

## What the marketing head should do every day

1. Open CRM or lead sheet and filter new leads from last 24 hours.
2. Sort by lead score.
3. Call high-intent leads first:
   - Calculator completed
   - High bill amount
   - Contact page visitors
   - District-specific page visitors
4. Send WhatsApp follow-up to non-responsive leads.
5. Mark each lead:
   - New
   - Contacted
   - Site visit booked
   - Quote sent
   - Won
   - Lost
6. Check GA4:
   - top landing pages
   - best districts
   - calculator completion rate
   - contact form conversion rate
7. Check Clarity:
   - rage clicks
   - form drop-offs
   - dead sections

## Important reality check

- You cannot reliably get personal details of anonymous visitors "just because they visited".
- What you can realistically and safely get is:
  - source
  - campaign
  - page interest
  - device/location approximation
  - session behavior
  - calculator intent
  - submitted contact details
- Anything claiming to fully identify all anonymous visitors is usually expensive, inaccurate, or legally risky.

## Recommended next build order

1. Add GTM + GA4 + Clarity.
2. Add hidden attribution fields to all forms.
3. Save calculator outputs into the lead payload.
4. Route all leads into Zoho CRM or at least Google Sheets.
5. Create lead score and follow-up statuses.
6. Add retargeting only after the above is clean.
