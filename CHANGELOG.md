# Changelog

All notable changes to GetStack are documented here.

---

## [Unreleased]

### Added
- **Blog system** — `/blog` index and `/blog/:slug` article reader with clean typography, OG meta tags, and a CTA card. Content stored as typed TypeScript objects in `client/src/content/blog.ts` (no CMS or new packages required).
- **First article** — "How to Tell What Any Website Is Built With (And Why It Matters)" published at `/blog/how-to-tell-what-any-website-is-built-with`.
- **Blog link** added to footer Support column.
- **FAQ page** added to main navigation.
- **"What it's becoming" and "Who builds it"** sections added to the About page.

### Changed
- **Footer** restructured into a 4-column layout (Tool, Company, Support, Legal) with a slim copyright bar at the bottom.
- **Dashboard** — blank state now shows a Site Overview placeholder with a pre-filled scan URL when a pinned site is selected.

### Fixed
- **Super admin 403 on `/api/pins`** — `requireTier` middleware now bypasses tier checks for users with the `super_admin` role.

### Removed
- **CmsBadge** ("wor" label) removed from the dashboard sidebar.

---

## Notes

- Versions follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) conventions.
- Production domain: [gtstk.dev](https://gtstk.dev)
