# FGE Solar — SEO Implementation Checklist

Last reconciled: 2026-07-24

## Source reconciliation

- Updated SEO-team PDF reviewed from disk on 2026-07-23: 12 pages, 614,864 bytes, SHA-256 `F2B882860BE6D96123A268899032716A8ACE3187A3468344D86D61F6CA296F40`.
- Pages 1–8 cover the Summary, Roadmap, SEO Plan, Task Tracker, Website Audit, Keyword Rankings, Keyword Gap, and On-Page Recommendations.
- Page 9 is a PageSpeed/Lighthouse snapshot dated 2026-07-17. Its lab scores and savings estimates are a baseline, not proof of the current local build or a guarantee of the post-deployment score.
- Page 10 is a full-site crawl snapshot of the earlier live site. Several observed titles, descriptions, missing-alt counts, schema types, and district-page assumptions are stale after local implementation, so every row must be re-tested against the final source instead of copied blindly.
- Pages 11–12 cover the seven proposed district pages and twelve-post blog plan. All 14 district pages now exist; blog copy remains assigned to the other employee, while image/technical integration stays in this checklist.
- The PDF remains the recommendation source. The implementation checklist and final validation evidence determine the accurate completion status.
- The local source was revalidated on 2026-07-24 after the regulatory-accuracy and calculator update. The workbook is updated only after these final results are reconciled.
- Regulatory source of truth checked on 2026-07-24: final [KSERC 2025 Renewable Energy Regulations](https://dev.erckerala.org/api/storage/final-regulations/BDm5OZBLIuAbHoyTX0xoploDz82DbFy1O6klxxfS.pdf), current [KSERC tariff order](https://dev.erckerala.org/api/storage/orders/o0sDy6ZmrpxIKwgD9dz8lMNuYvVEq11l9P1VcHeP.pdf), and official [PM Surya Ghar CFA guidelines](https://solarrooftop.pmsuryaghar.gov.in/notification/172_notification.pdf).

## PDF / ODS row-status crosswalk

These statuses are the values to reconcile into the corresponding workbook rows after final validation.

### Roadmap and SEO Plan

| PDF / ODS task | Current status | Accurate remark |
| --- | --- | --- |
| Website Technical Audit & Error Fixes | Done locally / external release checks remain | Final crawl passes across 48 tracked pages, 3,253 internal links, 200 images and 155 JSON-LD blocks. All 48 pages also pass desktop and mobile browser regression; host headers, deployed PageSpeed and Google processing remain external. |
| Internal Link Canonicalisation | Done | Production root-relative internal links use extensionless canonicals; legacy `.html` requests permanently redirect. |
| Core Pages On-Page Optimisation | Done locally | Search/social metadata is within the intended ranges. Home, Calculator, PM Surya Ghar, KSEB Net Metering, Residential, Commercial and related guides now use the verified 2025/2026 tariff, CFA and net-metering rules; the commercial page retains the approved 25 kW Ernakulam project proof. |
| District Pages Expansion | Done / original assumption superseded | All 14 Kerala district pages exist. Improve evidence and uniqueness rather than create duplicates. |
| Schema Rollout | Done locally | Applicable LocalBusiness/entity, Service, FAQPage and BreadcrumbList JSON-LD parses locally. |
| Blog Content Phase 1 | External / other employee | Copy remains with the assigned employee; technical/image integration is handled here. |
| Google Business Profile | External | Requires GBP manager access and real profile/review actions. |
| Local Citations | External | Requires confirmed NAP and directory account work. |
| Backlink Phase 1 | External | Requires budget, outreach approval and third-party publication. |
| Indexing & Crawling Optimisations | Partial | Sitemap/robots/canonical source is repaired; GSC submission and coverage inspection require access. |
| Malayalam Localisation Pilot | Needs owner input | Requires page priorities and Malayalam-native review. |
| Rank Tracking & Reporting | Needs owner input | Requires GSC or a selected rank-tracking account and a truthful baseline. |

### Regulatory accuracy gate — 24 July 2026

| Item | Status | Verified implementation |
| --- | --- | --- |
| LT-I domestic tariff | Done | Home and calculator use ₹3.35, ₹4.25, ₹5.35, ₹7.20 and ₹8.50 for the five telescopic slabs effective 1 April 2025–31 March 2027. The calculator also models the published non-telescopic energy rates and single-phase fixed charges, while clearly excluding duty, surcharge, ToD and bill-specific adjustments. |
| Domestic net-metering eligibility | Done | KSEB guide now states 1–20 kW subject to the final regulations; 3 kW is identified as the normal single-phase inverter limit rather than a universal plant cap. |
| Storage thresholds | Done | False “30% above 3 kW” copy is removed. The guide states 10% above 10–15 kW, 20% above 15–20 kW, and the 10% above 5–10 kW threshold for feasibility sought from 1 April 2027. |
| Banking and settlement | Done | Guide explains time-zone accounting, the 2% monthly banking charge, and ₹3.08/kWh existing / ₹2.79/kWh new solar year-end settlement. |
| Net billing and commercial treatment | Done | Net billing is described as available to all consumers/prosumers; commercial/industrial treatment is no longer described as identical to residential. |
| PM Surya Ghar CFA | Done | Visible copy, tables and calculator use ₹30,000/kW for the first 2 kW plus ₹18,000 for the third kW, maximum ₹78,000 for an eligible individual household. |
| CFA timing and payment claims | Done | Unsupported 30/45/60-day promises are removed from general copy. Pages state that installation, DISCOM inspection/approval and portal processing must complete and that no installer can guarantee a payment date. |
| Calculator | Done | Flat ₹7.50/unit and flat ₹18,000/kW logic are removed. Automated checks return ₹30,000 at 1 kW, ₹60,000 at 2 kW and ₹78,000 above 3 kW; long-term output is shown in today's tariff terms without an assumed annual tariff hike. |
| Affected-page regression | Done | 9 affected routes × desktop/mobile = 18 browser cases, with zero HTTP, overflow, H1, schema, stale-claim, selector, console or runtime failures. |

### Task Tracker and Website Audit

| Finding | Current status | Accurate remark |
| --- | --- | --- |
| Internal `.html` links | Done | Extensionless internal targets verified. |
| Homepage hero PNG / LCP delivery | Done locally; deployed measurement pending | Responsive WebP, intrinsic dimensions, preload and fetch priority are implemented. All four protected hero files remain byte-identical to Git `HEAD`. |
| Homepage hero alt | Done with accessibility rationale | The hero is adjacent decorative imagery and retains intentional empty alt instead of duplicating the visible headline. |
| Homepage title too long | Done | Current title is 51 characters. |
| Homepage H1 lacks topic relevance | Done locally | Conversion hook now includes “Solar in Kerala”; services H2 adds natural company/topic context. |
| Seven district pages missing | Done / stale finding | All 14 district routes exist in source. |
| FAQPage schema absent | Done locally | Applicable visible FAQs have parsing FAQPage JSON-LD. |
| LocalBusiness schema absent | Done locally | Core entity schema is present; district pages correctly use Service rather than inventing branches. |
| Brand confusion with `fgesolar.com` | Partial / external | On-site entity signals are strengthened; GBP/NAP/brand-SERP monitoring remains external. |
| Sitemap / robots validation | Done locally; GSC external | Sitemap has 44 valid unique canonical URLs and robots points to it; GSC processing still needs access. |
| GSC coverage and sitemap submission | External | Requires Search Console access. |
| Blog velocity / content freshness | External / other employee | Do not invent articles merely to change status. |
| Testimonials / third-party reviews | External | Preserve approved on-site testimonials; obtain genuine Google reviews with consent and no self-serving review schema. |
| Sitewide alt text | Done | All 200 tracked image occurrences have an alt attribute and intrinsic dimensions; decorative images use intentional empty alt. |
| Local SEO / citations | External | GBP, citations and review generation cannot be completed in source code. |
| E-E-A-T author/reviewer pattern | Partial | Existing strong subsidy review/source pattern is present; new copy needs named reviewer/source information from the content owner. |
| Conversion tracking | Partial | GA4/Clarity and event code exist; receipt/conversion configuration requires GA4 access. |
| Standardised next-step/internal links | Partial | Core templates include planning links; final blog-to-money-page linking follows approved finished content. |

### PageSpeed, accessibility and security

| Finding | Current status | Accurate remark |
| --- | --- | --- |
| Render-blocking requests | Partial / measured | All 41 synchronous icon-sprite loads now use `defer`. Remaining render blocking is the shared CSS and external webfonts; changing their load order without critical CSS would risk FOUC/CLS and requires a build-level CSS split. |
| Image delivery | Done locally | The 84-asset WebP package is referenced correctly with validated dimensions, alt/loading attributes and no binary duplicates. Legacy square core OGs were replaced, visible PM Surya Ghar/KSEB cards now use true 16:9 thumbnails, and text-clipping hover zoom was removed. Below-fold Home assets are lazy and the protected homepage hero is unchanged. |
| Unused third-party JavaScript | Partial | First-party script work is scoped; GTM/Clarity timing must balance measurement loss against performance and be validated. |
| Cache lifetimes | External | Requires host/Cloudflare cache configuration. |
| CSS minification | Pending validation | Minify only as a release/build output after functional and visual checks. |
| Main-thread work / forced reflow | Partial / external trade-off | Fresh Lighthouse attributes the dominant forced reflow and unused JS to Google Analytics/Clarity. Do not delay or remove measurement without GA4/marketing approval. |
| Heading-order skip | Done | Shared footer headings and in-page component headings are corrected; the final source-order audit reports zero heading-level jumps. |
| CSP, HSTS, COOP, frame protection, Trusted Types | Needs owner input / host access | Roll out cautiously at Cloudflare/host after inventorying required origins and HTTPS coverage. |

Authoritative SEO report reviewed: `C:\Users\Home\Downloads\FGE Solar - SEO plan.pdf`
PDF version: 12 pages, modified 2026-07-23 12:52:45, SHA-256 `F2B882860BE6D96123A268899032716A8ACE3187A3468344D86D61F6CA296F40`.

## Working rules

- No commit or push without the owner's explicit final approval.
- Mark an item `Done` only after its stated verification passes.
- Do not invent prices, product specifications, local addresses, reviews, certifications, or service claims.
- `Needs owner input` means a precise business/account decision is required before implementation.

| Status | Meaning |
| --- | --- |
| Done | Implemented and verified in source or live site. |
| In progress | Safe implementation is actively underway. |
| Partial | Some work is complete; the remaining work is listed. |
| Needs owner input | Cannot be accurately completed without confirmed business/account data. |
| External | Requires Google, Cloudflare, directories, customers, or outreach. |
| Superseded | The original sheet assumption is false or no longer a useful task. |

## Updated PDF page reconciliation

| PDF page | Report section | Current reconciliation |
| --- | --- | --- |
| 1 | SEO Report Summary | Reconciled. Original counts are audit baselines, not current completion counts. Canonical links, schema, sitemap, and 14-district coverage have changed since the audit. |
| 2 | SEO Roadmap | Partial. On-site technical implementation is active; GBP, citations, backlinks, GSC reporting, and Malayalam localisation remain separate external workstreams. |
| 3 | SEO Plan | Partial. Core technical/schema/local-page work is substantially implemented. Blog copy remains assigned externally; GBP/citations/backlinks/rank reporting require accounts or outreach. |
| 4 | Task Tracker | Website-side work done locally. Canonicals, title/H1, district coverage, schema, sitemap, image delivery, semantic headings and opener safety validate; external-account and release checks remain. |
| 5 | Website Audit | Website-side findings reconciled and validated locally. External GBP, citations, reviews, GSC, rank tracking, host headers and outreach remain separate workstreams. |
| 6 | Keyword Rankings | External baseline. Target URL mapping is retained, but position cells require GSC or a rank-tracking source. |
| 7 | Keyword Gap Opportunities | Partial. Application-status content exists; planned article copy belongs to the assigned content employee. Core service/subsidy targets are being handled on existing pages without keyword stuffing. |
| 8 | On-Page Recommendations | Done locally. Homepage, hub, metadata, schema, residential table, calculator tracking/formula, PM Surya Ghar jump links/H2, KSEB final-regulation rewrite, commercial project proof and district structure validate. |
| 9 | PageSpeed / Lighthouse | Local implementation and baseline complete. Mobile 46/100/77/100 and desktop 85/100/77/100 for Performance/Accessibility/Best Practices/SEO on the uncompressed local server; deployed testing and host cache/security headers remain. |
| 10 | Full URL Crawl Inventory | Done locally. The final 48-page source crawl covers 3,253 internal links, 200 image occurrences and 155 JSON-LD blocks; the 48-page desktop/mobile browser regression reports zero title/description range, duplicate, H1, canonical, schema, internal-link, image, heading, overflow, runtime or opener errors. |
| 11 | District Pages Plan | Done locally for page coverage. All 14 district URLs exist; final unique-image and template/content-quality validation is active. |
| 12 | Blog Content Plan | External / other employee for copy. Image/thumbnail implementation and technical integration remain in this development checklist. |

## P0 — complete before any SEO claims

| Task | Status | Verification / next action | Owner input needed |
| --- | --- | --- | --- |
| Repair sitemap URLs | Done | 44 valid, unique `<loc>` URLs; XML parses locally and live; all URLs map to local pages. Commit `d5c18b6` was pushed before the no-commit rule. | Search Console access to submit/monitor the repaired sitemap. |
| Confirm sitemap in Google Search Console | External | Submit `https://fgesolar.in/sitemap.xml`, then review sitemap processing and URL coverage after Google recrawls. | GSC invitation/access. |
| Freeze commits pending checklist approval | In progress | Keep all future site/image changes uncommitted until final review. | Final approval only when owner is satisfied. |

## Technical, on-page, and schema

| Task | Status | Correct action | Owner input needed |
| --- | --- | --- | --- |
| Extensionless internal links | Done | No root-relative internal `.html` links remain; legacy `.html` page URL redirects 308 to canonical URL. | None. |
| Homepage title and meta description | Done | Current title is 51 characters; description is 154 characters. | None. |
| Homepage H1 and above-fold relevance | Done locally | The conversion-led H1 is retained; the services-section H2 now naturally establishes FGE as one solar company for Kerala homes and businesses. Hero image untouched. | None. |
| Hero image delivery | Partial | Responsive WebP sources and preload are live. Re-test real mobile/desktop PageSpeed before changing further. | None for baseline test. |
| Core page metadata | Done locally | All indexable tracked pages now have unique titles and descriptions within the intended ranges; search, OG and Twitter metadata is aligned without changing employee-owned article copy. | None for current pages. |
| Core-page content recommendations | Done locally | The existing Residential comparison table is retained, PM Surya Ghar has jump links and corrected CFA tiers/timing, KSEB Net Metering is rewritten to the final Gazette, the calculator uses current LT-I slabs and tiered CFA, and Commercial retains the published 25 kW Ernakulam warehouse facts. | None; existing published company/project facts are owner-approved. |
| District page coverage | Superseded | All 14 district pages already exist. Improve unique proof, local relevance, and internal links instead of creating duplicates. | Real district/service evidence if available. |
| District schema | Done | All 14 district pages use `Service` schema; no fake district LocalBusiness locations. | None. |
| Core LocalBusiness/entity schema | Done | JSON-LD parses and uses the owner-approved FGE identity, Kerala service area, Thiruvananthapuram locality, hours, phone/email, credentials, and official social profiles. A street/PIN and GBP URL are optional future enrichments, not release blockers. | None for current release. |
| Existing company facts and numeric claims | Done | Published FGE credentials, installed-capacity/count figures, warranty/AMC terms, savings ranges, and testimonials are owner-approved. Main 50+ installation / 700 kW figures are consistent across Home, About, Projects, Calculator, Services, and blog references. Preserve them. | None unless a future page introduces a conflicting value. |
| FAQ schema | Done | FAQPage markup is present on applicable visible service, district, and subsidy FAQ content and parses successfully. Do not treat it as a guaranteed rich-result tactic. | None. |
| Accessibility labels and image alt text | Done | No image lacks an `alt` attribute; no unlabeled icon-only SVG links remain. Review new generated images as they are added. | None. |
| Heading hierarchy | Done | All 138 shared footer headings and the remaining in-page hierarchy patterns are corrected; the 48-page audit reports zero source-order heading jumps. | None. |
| Render-blocking CSS/JS and main-thread work | Partial / measured | All 41 icon scripts use `defer`. Fresh Lighthouse shows remaining delay in shared CSS/webfonts and Google/Clarity; a future build-level critical-CSS split must be tested for FOUC/CLS before release. | Hosting/build decision if further optimization is required. |
| External-link opener isolation | Done | All tracked `target="_blank"` links now include `noopener`; verification count is zero. | None. |
| Image payload, cache policy, and LCP | Done locally / host cache external | 84 manifest assets and 200 HTML image occurrences pass path, dimension, alt, loading and duplicate checks. The refreshed package includes 13 card thumbnails, six newly tracked core OGs and a dedicated PM Surya Ghar section photo. Deep Home images are lazy; the protected hero remains unchanged. Kasaragod's 416 KB primary image is retained to avoid another lossy re-encode. | Host cache configuration and fresh source/generation only if Kasaragod must be reduced further. |
| Forced reflow and network payload | Measured / external trade-off | Fresh mobile trace attributes 276 ms forced reflow to Google Analytics versus 11 ms to first-party `global.js`; GA4/Clarity timing needs measurement-owner approval. | GA4/marketing approval before delaying measurement. |
| Security headers | Needs owner input | Configure CSP report-only then enforce, HSTS after domain review, and frame protection in Cloudflare/host configuration. | Cloudflare/hosting access and confirmation of all HTTPS subdomains. |
| Cookie/privacy and browser-isolation policy | Needs owner input | Review actual analytics/cookie behaviour, decide consent requirements, then configure privacy policy, CSP, `frame-ancestors`, HSTS, and any appropriate COOP/Trusted Types policy at the host. | Cloudflare/hosting access and consent-policy decision. |
| PageSpeed baseline | Done locally; deployed rerun pending | Final local Home results: mobile Performance 46, Accessibility 100, Best Practices 77, SEO 100, LCP 8.1 s, TBT 540 ms, CLS 0; desktop 85/100/77/100, LCP 1.9 s, TBT 100 ms, CLS 0. Local Python serving is uncompressed; repeat on the deployed host after approval. | Deployment approval for the production rerun. |

## Content, images, and discovery

| Task | Status | Correct action | Owner input needed |
| --- | --- | --- | --- |
| PM Surya Ghar application-status guide | Done | Added, rebuilt to match the native blog template, and linked from the blog hub. | None. |
| Blog content plan | Partial | Existing coverage: application status, system comparison, monsoon. Partial coverage: price, 3 kW, 5 kW, AMC, ANERT comparison. Missing: tariff slabs, brand comparison, inverter prices, houseboat guide. | See content-input list below. |
| Image refresh — blog/service/location/OG | Done locally | The final manifest contains 84 referenced WebP assets: 13 card thumbnails, 11 blog OGs, 14 district primaries, 14 district OGs, 7 service primaries, 7 service OGs, 5 support primaries, 6 support OGs, 6 core OGs and 1 section photo. Contact sheets, desktop/mobile visual QA, dimensions, hashes, alts, loading and duplicate checks pass. Homepage hero blobs match `HEAD`. | Fresh source only for an optional smaller Kasaragod primary image. |

### Image regeneration acceptance gate

- [x] Replace weak, undersized, or repeated blog, service, district/location, and OG/social images; include the already regenerated blog set in the same audit.
- [x] Give every page a context-aware visual that explains its topic instead of another generic solar-roof image.
- [x] Use realistic Kerala architecture, vegetation, climate, equipment, roof types, and installation details.
- [x] Keep compositions genuinely varied across location, service, weather, time of day, viewpoint, and use case.
- [x] Keep solar modules, rails, clamps, spacing, wiring, conduit, inverters, meters, batteries, and charging equipment physically credible.
- [x] Humans, especially adult men, may appear naturally; keep them non-identifiable, correctly proportioned, and visibly safe for the task.
- [x] Do not show unsafe electrical/roof work, exposed energized equipment, sensitive imagery, or misleading explicit context.
- [x] Do not present generated people as named FGE staff/customers or generated scenes as documented completed FGE projects.
- [x] Blog thumbnails and most OG/social images use one concise, mobile-readable topic headline, normally 3–8 words.
- [x] State the exact intended headline, text-safe area, and logo-safe area inside each generation prompt/manifest.
- [x] Generate the photographic scene with deliberate negative space, then apply the exact headline deterministically so spelling and punctuation are reliable.
- [x] Keep ordinary in-page service/location photography text-free; district primary images remain text-free.
- [x] District OG variants may use only the minimal headline `Solar in {District}`.
- [x] Avoid paragraphs, clutter, price claims, promotional badges, or unapproved numbers inside image artwork.
- [x] Never trust model-generated words, labels, UI, watermarks, or logos.
- [x] Use the supplied official FGE logo only. Integrate it creatively with an FGE green/white/dark editorial tab, band, or frame where branding improves the thumbnail.
- [x] Keep branding restrained and legible; do not simply paste an oversized corner logo or cover the scene with a template.
- [x] Generate distinct district scenes for all 14 districts; a page's OG image may be derived only from that page's own accepted scene.
- [x] Do not replace the homepage hero image, its sources, or its references.
- [x] Export visually high-quality, compact WebP files; use responsive variants where they improve delivery.
- [x] Give every installed image a correct path, intrinsic dimensions, useful alt text or intentional empty alt, and appropriate eager/lazy loading.
- [x] Produce labeled contact sheets for the actual packaged exports, not only unlabeled generation masters.
- [x] Verify missing files, duplicate primary references, exact binary duplicates, dimensions, alt text, loading, and mobile/desktop crops before marking Done.
- [x] Do not change company facts, article copy, metadata, schema, stage files, commit, or push as part of the image pass.

#### Exact thumbnail / OG headline map

| Asset topic | Exact overlay headline |
| --- | --- |
| Solar panel price | Solar Panel Price in Kerala |
| Choosing an installer | How to Choose a Solar Company |
| Documents | Solar Documents Checklist |
| System sizing | Choose the Right Solar System Size |
| Rooftop rules | Kerala Rooftop Solar Rules 2026 |
| PM-KUSUM | PM-KUSUM Solar for Kerala Farms |
| Application status | Check PM Surya Ghar Application Status |
| System comparison | On-Grid vs Off-Grid vs Hybrid |
| Monsoon performance | Solar in the Kerala Monsoon |
| EV charging | Solar EV Charging at Home |
| Savings | How Much Can Solar Save You? |
| PM Surya Ghar core guide | PM Surya Ghar Kerala Guide |
| KSEB net metering core guide | KSEB Net Metering Kerala |
| Homepage social preview | Solar Company in Kerala |
| Contact social preview | Talk to FGE Solar |
| Calculator social preview | Kerala Solar Savings Calculator |
| Projects social preview | Kerala Solar Projects |
| Residential service | Residential Solar in Kerala |
| Commercial service | Commercial Solar in Kerala |
| On-grid service | On-Grid Solar in Kerala |
| Off-grid service | Off-Grid Solar in Kerala |
| Hybrid service | Hybrid Solar in Kerala |
| AMC service | Solar AMC in Kerala |
| Water heater service | Solar Water Heaters in Kerala |
| Services hub | Solar Services Across Kerala |
| About | About FGE Solar |
| ANERT | ANERT Solar Schemes in Kerala |
| Subsidy hub | Solar Subsidy in Kerala |
| District OG | Solar in `{District}` |
| Blog content production | External / other employee | Keep copy ownership with the assigned employee; integrate only source-checked finished articles. | Final approved copy and sources. |
| Projects page depth | Needs owner input | Expand only with real completed-project facts, photos, system sizes, locations approved for publication, and customer permission. | Approved project evidence and photo consent. |
| Internal linking | Partial | New guide links to money pages. Standardise useful next-step links only after planned content exists. | None. |
| Malayalam localisation | Needs owner input | Translate only source-verified priority pages and arrange Malayalam-native review before publishing. | Pages to prioritise and review arrangement. |

## Local SEO, authority, and measurement

| Task | Status | Correct action | Owner input needed |
| --- | --- | --- | --- |
| Google Business Profile | External | Complete service areas, services, photos, posts, and real review-request process. | GBP manager access and final business facts. |
| Reviews | External | Request genuine reviews with customer consent; never manufacture reviews or add self-serving review schema. | Approved outreach process and customer consent. |
| Local citations | External | Publish consistent NAP only after final published contact data is confirmed. | Business name, address, phone, website, hours, categories. |
| Backlinks/PR | External | Prepare source-backed outreach assets after content and local entity details are accurate. | Budget, target publications, approval of outreach. |
| Brand-confusion monitoring | External | Monitor branded searches for the unrelated `fgesolar.com`; strengthen consistent GBP, NAP, social, and Organization signals. | GBP access and confirmation of official profiles. |
| On-site testimonials and E-E-A-T | Needs owner input | Keep named, permissioned testimonials only; add transparent author/reviewer information and cited official sources to new guides. Never add self-serving review rich-result markup. | Customer approval, reviewer details, and source links. |
| Google Search Console | Needs owner input | Inspect indexing, submit sitemap, use URL Inspection, export/query ranking baseline. | GSC invitation/access. |
| GA4/Clarity | Partial | Base tags are on all tracked pages; verify event receipt in GA4 DebugView and define conversion events. | GA4 access. |
| Rank tracking | Needs owner input | Populate blank position cells from GSC or a chosen rank-tracking tool; do not claim rankings before baseline data exists. | GSC access or rank-tracker account. |

## Exact content inputs — ask only when the relevant article is ready

| Planned topic | Exact approved input required |
| --- | --- |
| Solar price / 3 kW / 5 kW | Current price ranges, inclusions/exclusions, subsidy treatment, battery/add-on costs, current date and source. |
| Panel brand comparison | Brands/models FGE actually installs, warranty, technical data sheets, why/when each is recommended. |
| Inverter article | Models actually supplied, warranty, price range, sizing guidance, official data sheets. |
| AMC article | Contract duration, scope, visit frequency, exclusions, response process, price model. |
| ANERT vs PM Surya Ghar | Current official scheme sources and which customer type each applies to. |
| Houseboat / remote-home guide | Confirmation that FGE serves this use case, system design boundaries, project evidence, and location coverage. |

## Final release gate

- [ ] Sitemap accepted/processed in Google Search Console.
- [x] All planned website changes have local/static validation.
- [x] Image manifest reviewed; each replacement has correct dimensions, WebP compression, reference, and alt text.
- [x] Current PageSpeed mobile and desktop checks recorded.
- [x] No fabricated commercial/local claims.
- [x] Owner-input items supplied or explicitly left out.
- [ ] Owner reviews the final diff and explicitly authorizes commit/push.
