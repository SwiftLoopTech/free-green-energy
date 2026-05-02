# Responsive QA Notes

This rollout did not intentionally change the visual design system or core responsive CSS.

## What Was Added Safely

- New trust blocks use `display:flex` with `flex-wrap:wrap`
- New CTA clusters use `flex-wrap:wrap`
- New next-step sections use `repeat(auto-fit, minmax(260px, 1fr))`
- New article pages reuse the existing blog template and media-query system
- No fixed-width desktop-only layout blocks were added in the new content sections

## What Was Verified Structurally

- Viewport meta tags are present on the affected pages
- New inline blocks are using flexible wrapping instead of rigid widths
- Existing templates already contain mobile breakpoints and auto-fit grid patterns

## What Still Needs Manual Browser QA

- iPhone SE / narrow Android viewport check
- Standard mobile width check around 360 to 430 px
- Tablet width check around 768 to 1024 px
- Laptop width check around 1280 px
- Large desktop / TV width check above 1600 px

## Priority Pages To Test First

- `/`
- `/blog/`
- `/subsidy/pm-surya-ghar.html`
- `/subsidy/kseb-net-metering.html`
- `/subsidy/anert.html`
- `/blog/govt/kerala-rooftop-solar-rules-2026.html`
- `/blog/buying-guide/which-solar-system-size-kerala-home-2026.html`
- `/blog/how-solar/solar-for-ev-charging-kerala.html`

## Important Note

I can make the code structurally responsive-safe, which I have done for the new additions.
But a true `100% all screens` guarantee still requires live browser/device QA because visual issues can only be fully confirmed in rendering, not by static code review alone.
