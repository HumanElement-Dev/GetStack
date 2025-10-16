# Overview

GetStack is a WordPress detection tool that allows users to analyze websites to determine if they're running WordPress. The application provides detailed insights about WordPress installations, including version detection, theme identification, and technology stack analysis. Built as a full-stack web application, it features a modern React frontend with a clean, professional interface and an Express.js backend that handles website analysis requests.

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

## WordPress Detection Logic
The core functionality analyzes websites through multiple detection methods:
- **HTTP Analysis**: Examines HTTP headers for WordPress indicators
- **Content Inspection**: Looks for WordPress-specific patterns and signatures
- **Technology Detection**: Identifies additional technologies in use
- **Timeout Handling**: 10-second request timeout for reliable performance
- **Error Handling**: Comprehensive error reporting for failed analyses

### Plugin Detection Approach & Limitations
The application detects WordPress plugins using strict pattern matching to ensure accuracy:
- **Primary Method**: Scans HTML source for `/wp-content/plugins/FOLDER-NAME/` paths
- **Directory Listing**: Attempts to access `/wp-content/plugins/` (rarely available due to security)
- **REST API Check**: Queries WordPress REST API for plugin namespaces
- **WPScan Validation**: If `WPSCAN_API_TOKEN` is configured, validates detected plugins against WPScan vulnerability database
- **Core Filtering**: Excludes WordPress core components (wp-block-editor, wp-site-health, etc.)

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