# Changelog

All notable changes to GetStack are documented here.
Production domain: [gtstk.dev](https://gtstk.dev)

---

## v3.8.6

### Added
- **IP Lookup** — Premium users can now look up the resolved IP address of any scanned domain directly from the "IP & Infrastructure" dashboard tab. Uses Node's built-in DNS resolver server-side; no third-party API required.

### Fixed
- **IP & Infrastructure tab** — "Could not resolve IP" error was a stale cached failure from a previous query URL bug. Fixed by setting `staleTime: 0` and `retry: 1` on the IP lookup query so it always re-fetches fresh on mount. Added server-side `console.log` for DNS resolution debugging.
- **Google auth bug** fixed.

---

## v3.8.5

### Added
- **Privacy Policy** page at `/privacy-policy` — covers data collection, usage, sharing, cookies, retention, and user rights.
- **Terms of Service** page at `/terms-of-service` — acceptable use, subscriptions, intellectual property, and liability.
- **Disclaimer** page at `/disclaimer` — accuracy of results, no-warranty notice, and third-party site guidance.
- **Legal link row** added to footer between the main columns and copyright bar (Disclaimer · Privacy Policy · Terms of Service).

---

## v3.8

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

## v3.7

### New Scan Experience
- Replaced the generic loading spinner with a full scan engine animation while a site is being analyzed.
- Shows a macOS-style terminal interface with the target domain, a live progress bar, and sequential log lines that play out step-by-step as the scan runs.

### About Page
- Added a new About page explaining what GetStack is, how it works, and who it's for.
- Linked from the main navigation header.

### Joomla Detection
- GetStack can now identify websites built on Joomla.
- Detection uses multiple signals: generator meta tag, Joomla-specific HTTP headers, JavaScript globals, component and media paths, and routing markers — with a confidence scoring system to avoid false positives.
- When Joomla is detected, results show the version number (if exposed) and any identifiable extensions/modules running on the site.

### Home Page
- Added an "Also detects:" strip below the main Supported Platforms grid, currently listing Joomla.

### Misc
- Updated the "Platform Not Recognized" fallback message to mention Joomla alongside WordPress, Wix, Shopify, and Squarespace.

---

## v3.6.6

- Fixed a bug where the billing portal would fail for users whose premium status was set up without going through the standard checkout flow. The app now looks up or creates a Stripe customer automatically before opening the portal.
- Connected the app to the real Stripe account, replacing the Replit test integration. Payments, webhooks, and subscription management now run through live Stripe credentials.
- Tightened product matching so that only the exact product "GTSTK Premium" can trigger a premium subscription.

---

## v3.6.5

- CMS cards now include health status and version intelligence.
- Added a WordPress Version Intelligence card displaying version status, how far behind the latest release the site is, and a preview of premium vulnerability insights.
- Improved version status reporting with clearer guidance and direct links to upgrade options.

---

## v3.6

- Shopify template scanning — template tags and names.

---

## v3.5.5

- Expanded Wix template detection.

---

## v3.5

- Wix template scanning — template tags and names.

---

## v3.4

- Login via OAuth (Replit Auth).

---

## v3.3.3

- Added theme screenshot image to WordPress theme results.

---

## v3.3.2

- Added supporting theme data: version number, author, description, links, tags.

---

## v3.3.1

- Now detecting child/parent theme configurations for WordPress.

---

## v3.3

- Added Theme Detection for WordPress.

---

## v3.2.1

- Integrated ThemeInfo schema and parsing logic to extract theme details (name, version, author, description) from WordPress sites.
- Updated client-side display and server-side storage for theme information.
- Enhanced plugin schema with `wpOrgUrl`.

---

## v3.2.0

- Responsive layout — collapsed sidebar on mobile, stacked header elements, adjusted detection form for smaller screens.
- Made results display responsive.
- Updated website header to be mobile-responsive.

---

## v3.1.4

- Updated dashboard layout to include a new top bar with logo and search.
- Full-width header across the page.

---

## v3.1.3

- WordPress version detection.

---

## v3.1.2

- Animated domain input field and results display on the dashboard.
- Updated results display to show domain prominently.

---

## v3.1.1

- Shopify detection — header analysis, content patterns, and JavaScript/cookie checks.

---

## v3.1.0

- Improved plugin signature loading to support multiple file locations (prevents runtime errors in deployment).
- Added new WordPress component detection logic.

---

## v3.0.9

- Refined plugin detection regex patterns for CSS, script handles, meta tags, and REST endpoints.
- Added `batch` to excluded paths.
- Added type assertions for plugin signature entries.
- Updated UI styling.

---

## v3.0.8

- Enhanced WordPress plugin detection by loading plugin signatures from a JSON file.
- New detection methods: CSS class patterns, script/style handle patterns, REST API endpoints.
- Captures plugin version numbers from URL query strings.

---

## v3.0.7

- Integrated WPScan API v3 to validate detected plugins and retrieve vulnerability data (uses `WPSCAN_API_TOKEN`; respects free tier limits).

---

## v3.0.6

- Plugin detection — detects and displays installed WordPress plugins.
- Multiple regex patterns to capture plugin slugs from scripts, styles, and data references.
- Excludes core WordPress components (e.g. `wp-site-health`, `wp-block-editor`) to reduce false positives.
- Adds attempt to fetch `/wp-content/plugins/` directory listing.

---

## v3.0.5

- Initial structure for the detection page — basic UI without requiring authentication.

---

## v3.0.4

- Introduced new route for website detection and welcome page.
- Header navigation conditionally shows "Analyze Website" or "Home" based on the current route.

---

## v3.0.3

- Updated hero section text on the welcome page.

---

## v3.0.2

- Added section for managing user roles and permissions (access control).

---

## v3.0.1

- Added Wix detection — results display and backend logic, new UI elements and data structures.

---

## v3.0.0

- New dashboard page with header and sidebar components.
- Updated routing to include the dashboard.

---

## v2.0.5

- Initial detection page structure.

---

## v2.0.4

- Introduced new route for website detection and welcome page.
- Navigation links in the header now conditionally display based on the current route.

---

## v2.0.3

- Updated API endpoint to handle multipart form data uploads.

---

## v2.0.2

- Implemented minimum loading duration for smoother animations.
- Enhanced WordPress detection logic.
- Added private IP address (SSRF) protection.
- Refined detection results display with improved styling and error handling.

---

## v2.0.1

- Better URL handling.
