# Overview

GetStack is a website platform detection tool that allows users to analyze websites to determine their underlying technology stack. The application detects WordPress, Wix, and Shopify platforms, and provides detailed insights including version detection, theme identification, plugin analysis (for WordPress), and general technology stack detection. Built as a full-stack web application, it features a modern React frontend with a clean, professional interface and an Express.js backend that handles website analysis requests.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React and TypeScript, utilizing modern development practices:
- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for robust form handling
- **Build Tool**: Vite for fast development and optimized builds

## Backend Architecture
The server uses Node.js with Express in a RESTful API pattern:
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints with centralized route registration
- **Validation**: Zod schemas for request/response validation
- **Storage**: Abstracted storage interface supporting both in-memory and database persistence

## Data Storage Solutions
The application uses a flexible storage approach:
- **ORM**: Drizzle ORM with PostgreSQL dialect for database operations
- **Database**: Configured for PostgreSQL with Neon Database serverless connection
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Fallback Storage**: In-memory storage implementation for development/testing

## Platform Detection Logic
The core functionality analyzes websites to detect WordPress, Wix, and Shopify through multiple detection methods:

### WordPress Detection
- **HTTP Headers**: Examines `X-Generator`, `X-Powered-By` headers for WordPress signatures
- **Meta Tags**: Looks for WordPress generator meta tags with version information
- **Content Patterns**: Identifies `/wp-content/`, `/wp-includes/`, and WordPress REST API endpoints
- **Score-based System**: Requires minimum score of 4 and at least 1 strong indicator for positive detection

### Wix Detection
- **HTTP Headers**: Checks for `X-Wix-Request-Id`, `X-Wix-Instance` headers
- **CDN Patterns**: Detects `static.wixstatic.com` and `parastorage.com` resources
- **JavaScript**: Identifies Wix-specific scripts like `wix-thunderbolt` and `clientSideRender.min.js`
- **Cookies**: Looks for `_wix_browser_sess` and other Wix session identifiers

### Shopify Detection
- **HTTP Headers**: Checks for `X-ShopId`, `X-Shopify-Stage`, `X-Shopify-Shop-Api-Call-Limit`
- **CDN Patterns**: Detects `cdn.shopify.com` resources
- **Domain References**: Identifies `myshopify.com` references in content
- **JavaScript API**: Looks for `Shopify.theme`, `Shopify.routes`, and `Shopify.Checkout` objects
- **Analytics**: Detects Shopify-specific cookies (`_shopify_s`, `_shopify_y`, etc.)

**General Features:**
- **Technology Detection**: Identifies additional technologies in use (React, Vue, Next.js, etc.)
- **Timeout Handling**: 10-second request timeout for reliable performance
- **Error Handling**: Comprehensive error reporting for failed analyses
- **SSRF Protection**: Blocks private IP ranges to prevent server-side request forgery

### Plugin Detection Approach & Limitations
The application uses a comprehensive multi-method detection system to identify WordPress plugins:

**Detection Methods:**
1. **Path Detection**: Scans HTML for `/wp-content/plugins/FOLDER-NAME/` paths with version extraction from `?ver=` query strings
2. **Directory Listing**: Attempts to access `/wp-content/plugins/` (rarely available due to security)
3. **CSS Class/ID Patterns**: Detects plugins via known CSS classes (elementor-*, woocommerce, etc.) using signature database
4. **Script/Style Handles**: Identifies plugins from script/link asset URLs (elementor-frontend.min.js, woocommerce.min.js)
5. **Meta/JSON-LD Parsing**: Extracts plugin references from structured data and meta tags (Yoast, RankMath)
6. **REST Endpoint Detection**: Checks for known plugin REST namespaces (wc/, yoast/, jetpack/, contact-form-7/)
7. **WPScan Validation**: If `WPSCAN_API_TOKEN` is configured, validates detected plugins against WPScan vulnerability database
8. **Core Filtering**: Excludes WordPress core components (wp-block-editor, wp-site-health, etc.)

**Signature Database:** `server/plugin-signatures.json` contains fingerprints for 15+ popular plugins with CSS classes, script patterns, REST endpoints, and meta patterns for enhanced detection accuracy.

**WPScan API Integration:**
- Optional enhancement requiring free API token from https://wpscan.com/register
- Free tier: 25 API requests per day
- Used for validation only - confirms detected plugins exist in WPScan database
- All plugins are preserved regardless of WPScan response (handles 404, auth errors, rate limits gracefully)
- Does not change WordPress/Wix detection logic - only enhances plugin confidence

**Known Limitations:**
- Only detects plugins that load frontend assets (JS, CSS, images)
- Backend-only plugins are invisible (security, admin tools, email, backup plugins)
- Asset optimization plugins (like Autoptimize) can hide plugin paths by bundling files
- Average detection rate: ~40-50% of installed plugins on typical WordPress sites
- WPScan API provides vulnerability lookups, not plugin enumeration
- Complete plugin detection requires WordPress admin access or scanner tools

## Development and Deployment
The application supports both development and production environments:
- **Development**: Vite dev server with hot module replacement
- **Production**: Static asset serving with Express
- **Build Process**: Separate client and server build pipelines
- **Environment**: Environment-based configuration with proper error handling

# External Dependencies

## Core Runtime Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm & drizzle-kit**: Modern TypeScript ORM and migration toolkit
- **express**: Web application framework for Node.js
- **@tanstack/react-query**: Powerful data synchronization for React

## UI and Styling Dependencies
- **@radix-ui/***: Comprehensive collection of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **lucide-react**: Icon library for React components

## Form and Validation
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Validation resolver for various schema libraries
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation

## Development Tools
- **vite**: Next generation frontend tooling
- **tsx**: TypeScript execution environment for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/***: Replit-specific development enhancements and error reporting

## Additional Utilities
- **date-fns**: Modern JavaScript date utility library
- **wouter**: Minimalist routing for React
- **connect-pg-simple**: PostgreSQL session store for Express sessions