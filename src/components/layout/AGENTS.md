# Layout components

| File | Purpose |
|---|---|
| `Footer.tsx` | Footer renders branding, quick links, contact details and filings; omits gold contact heading in both languages. Export: `Footer`. See change: remove-footer-contact-heading. |
| `Header.tsx` | Fixed navy top bar: logo, desktop/mobile nav from `NAV_ITEMS`, language switch, search modal. `'use client'`. Export: `Header`. |
| `HeroBanner.tsx` | Shared 60vh image hero with gold accent bar for inner pages (about/contact/…). Takes `title`, optional `subtitle`, `backgroundImageUrl`. Export: `HeroBanner`. |
| `PageLayout.tsx` | Async shell: resolves logo/firmName/firmTagline from `SiteConfig` (prop overrides win), renders Header + `<main className="flex-1 pt-16">` + Footer. Export: `PageLayout`. |
| `index.ts` | Barrel re-exporting the four components above. |