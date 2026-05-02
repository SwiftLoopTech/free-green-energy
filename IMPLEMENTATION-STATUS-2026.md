# FGE Solar Implementation Status 2026

This is the current execution checklist for the SEO, AEO, crawl-quality, content, and analytics rollout.

## Encoding and Content Integrity

### Done

- Full site sweep completed for broken stacked entities and mojibake patterns
- Fixed broken entity encoding in:
  - `services/amc.html`
  - `subsidy/kseb-net-metering.html`
  - `subsidy/anert.html`
  - `blog/how-solar/solar-during-kerala-monsoon.html`
  - `blog/buying-guide/solar-panel-price-kerala-2025.html`
- Verified no remaining matches for:
  - `&amp;amp`
  - `&amp;#`
  - `â€™`
  - `â€œ`
  - `â€“`
  - `â€”`
  - `â‚¹`
  - replacement-character style mojibake

### Not Done Yet

- Full content refresh of older 2025 blog articles whose body copy is still year-specific
- Full author-line standardization across every blog page

### Needs Your Input

- None for encoding cleanup

## Phase 1: Trust and Freshness Updates

### Done

- Footer copyright updated to 2026 across the site
- Privacy policy updated to April 2026
- Main subsidy hub refreshed to 2026 framing
- Core subsidy pages refreshed to 2026 framing:
  - `subsidy/pm-surya-ghar.html`
  - `subsidy/kseb-net-metering.html`
  - `subsidy/anert.html`
  - `subsidy/index.html`
- Blog hub and homepage article cards updated to surface fresher 2026 content
- Added visible `Last updated`, `Reviewed by`, and source-reference blocks on core policy and money pages:
  - `subsidy/pm-surya-ghar.html`
  - `subsidy/kseb-net-metering.html`
  - `subsidy/anert.html`
  - `blog/savings/how-much-can-you-save-solar-kerala.html`
  - `blog/buying-guide/solar-panel-price-kerala-2025.html`
- Refreshed legacy article headers, titles, visible dates, and discovery labels for:
  - `blog/buying-guide/solar-panel-price-kerala-2025.html`
  - `blog/savings/how-much-can-you-save-solar-kerala.html`
  - `blog/how-solar/solar-during-kerala-monsoon.html`

### Not Done Yet

- Existing 2025 blog pages still need full 2026 factual refresh where the article body depends on dated numbers:
  - `blog/buying-guide/solar-panel-price-kerala-2025.html`
  - `blog/savings/how-much-can-you-save-solar-kerala.html`
- Older dated blog bodies still need full deep factual refresh in places where the underlying market numbers or assumptions may have shifted

### Needs Your Input

- If you want named author and reviewer identities beyond `Vishnu M, FGE Solar`, share the exact names and roles to use sitewide

## Phase 2: New High-Value Content

### Done

- Created 5 high-value 2026 blog posts:
  - `blog/govt/pm-kusum-kerala-2026.html`
  - `blog/govt/kerala-rooftop-solar-rules-2026.html`
  - `blog/buying-guide/kerala-solar-documents-checklist-2026.html`
  - `blog/buying-guide/which-solar-system-size-kerala-home-2026.html`
  - `blog/how-solar/solar-for-ev-charging-kerala.html`
- Added these new pages to:
  - `blog/index.html`
  - `sitemap.xml`
- Added internal links between new articles and subsidy/service pages

### Not Done Yet

- A separate blog specifically targeting `PM Surya Ghar in Kerala 2026: Exact Subsidy, Eligibility, Timeline, and Common Rejection Reasons` is still optional if you want a blog version in addition to the main subsidy landing page

### Needs Your Input

- None required to draft these next two articles

## Phase 3: Crawl and Discovery

### Done

- New content linked from the blog hub
- New content added to sitemap with fresh `lastmod`
- Core discovery surfaces updated with fresher article labels

### Not Done Yet

- Search Console submission and indexing requests still need to be done after publish
- Priority internal-link refresh on older district and service pages is not complete yet

### Needs Your Input

- Google Search Console property access

## Phase 4: Analytics, Attribution, and Lead Stack

### Done

- Added setup documentation:
  - `ANALYTICS-CLARITY-SETUP.md`
  - `ANALYTICS-KEYS-CHECKLIST.md`
- Added rollout tracker:
  - `SEO-AEO-IMPLEMENTATION-CHECKLIST-2026.md`
- Placeholder keys and snippet locations documented for:
  - GTM
  - GA4
  - Search Console verification
  - Microsoft Clarity
  - optional Google Ads
- Recommended hidden lead attribution fields documented

### Not Done Yet

- Live GTM snippet not injected
- Live GA4 tag not injected
- Search Console verification tag not injected
- Clarity script not injected
- Lead attribution hidden fields not yet wired into forms
- CRM or Sheets sync not yet implemented

### Needs Your Input

- `GTM_CONTAINER_ID`
- `GA4_MEASUREMENT_ID`
- `GA4_PROPERTY_ID`
- `GOOGLE_SEARCH_CONSOLE_VERIFICATION_TAG`
- `MICROSOFT_CLARITY_PROJECT_ID`
- Optional:
  - `GOOGLE_ADS_CONVERSION_ID`
  - `GOOGLE_ADS_CONVERSION_LABEL`
  - business profile and social URLs

## Phase 5: Local and District SEO

### Done

- Existing district pages remain live and linked
- No styling changes made that would risk responsive layout

### Not Done Yet

- District pages are still too templated overall
- Top district pages still need unique local proof, local FAQs, and district-specific economics
- Project references by district still need to be strengthened

### Needs Your Input

- Real district-level proof points if available:
  - completed towns/areas
  - project sizes
  - roof types
  - customer segments

## Phase 6: E-E-A-T and Entity Signals

### Done

- About, subsidy, and new blog content now point more clearly to official bodies like MNRE, PM Surya Ghar, KSEB, and ANERT
- New high-intent blogs use named authorship format

### Not Done Yet

- Older blogs still need named author and reviewer format
- Stronger Organization schema and `sameAs` links still need to be expanded
- More case-study proof still needs to be added to project and service flows

### Needs Your Input

- Official social profile URLs
- Preferred company identity fields if different from current schema

## Phase 7: Final QA Before Launching Tracking and Requesting Indexing

### Done

- No CSS edits made
- No responsive layout changes introduced
- New pages reuse existing page structure safely
- Added responsive implementation notes in `RESPONSIVE-QA-NOTES.md`
- Verified the newly added trust blocks and CTA sections use responsive-safe patterns like `flex-wrap` and `auto-fit` grids

### Not Done Yet

- Final manual browser QA on key pages and viewport sizes
- Final Search Console submission
- Final analytics verification after IDs are available

### Needs Your Input

- Real tracking IDs and console access

## Recommended Next Execution Order

1. Refresh the 3 older dated blog articles fully for 2026
2. Inject GTM, GA4, Search Console, and Clarity once you provide IDs
3. Add attribution hidden fields to the main lead forms
4. Rewrite the top district pages with unique local content
5. Strengthen project and proof content with district-level evidence
