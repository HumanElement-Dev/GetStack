export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "ul"; items: string[] };

export interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: Block[];
}

export const articles: Article[] = [
  {
    slug: "how-to-tell-if-a-website-is-built-on-wordpress",
    title: "How to Tell If a Website Is Built on WordPress",
    date: "2026-06-15",
    excerpt:
      "Spot the public clues that can identify WordPress, learn where to check page source and URLs, and understand why one signal alone is never proof.",
    content: [
      {
        type: "p",
        text: "A site can look completely custom and still run on WordPress. The platform controls how content is managed; a theme and plugins shape what visitors see. If you are researching a competitor, preparing a redesign, or qualifying a project, there are several public clues you can check before asking for access.",
      },
      { type: "h2", text: "Start with the page and its source" },
      {
        type: "p",
        text: "Open the site in a browser and view its page source. Search for familiar WordPress paths such as /wp-content/ and /wp-includes/. Images, stylesheets, and scripts often use these directories. You may also find a WordPress generator tag or a version query such as ?ver= attached to a resource. These are useful clues, but themes can remove or rename them, and a cached asset can remain after a site changes platforms.",
      },
      {
        type: "h3",
        text: "Check links and public endpoints",
      },
      {
        type: "p",
        text: "Look at a few internal links, media URLs, and the site’s robots.txt file. WordPress installations commonly use recognizable paths, but site owners can customize permalinks, block files, or put a separate frontend in front of WordPress. The /wp-json/ endpoint may expose the public REST API on some sites; a disabled endpoint does not rule WordPress out, and an accessible one does not reveal every plugin or setting.",
      },
      {
        type: "h2",
        text: "Use more than one signal",
      },
      {
        type: "p",
        text: "A reliable identification comes from several independent clues agreeing. For example, WordPress paths in page assets combined with a WordPress-specific script or API response are stronger evidence than a single filename. If signals conflict, the site may use a content delivery network, a headless WordPress setup, or a partial migration. Record the result as a likely platform rather than treating a browser clue as certainty.",
      },
      {
        type: "h2",
        text: "Use a website technology detector",
      },
      {
        type: "p",
        text: "A detector automates the source-code checks and groups the results into a readable report. Enter the domain and review which indicators support the CMS result. A useful report may also identify a detectable theme, plugins, or other technologies, but it can only see signals available to a public page. It cannot confirm private server configuration or every installed component.",
      },
      {
        type: "h2",
        text: "What to do with the result",
      },
      {
        type: "p",
        text: "If you are planning work on your own site, treat a public scan as an initial inventory, not a substitute for administrator access. Confirm the platform with the site owner, request a current plugin and theme list, and take a backup before making changes. For competitor research, use the result to guide a conversation or a technical hypothesis, not to infer private business information.",
      },
      {
        type: "p",
        text: "GetStack can check a public domain for WordPress and other common platforms, then show additional signals when they are detectable. Run a scan to get a quick starting point before doing a deeper review.",
      },
    ],
  },
  {
    slug: "how-to-find-what-shopify-theme-a-store-is-using",
    title: "How to Find Out What Shopify Theme a Store Is Using",
    date: "2026-07-15",
    excerpt:
      "Learn how to inspect a Shopify storefront for theme clues, what a detector can reveal, and why custom themes may not have a reliable public name.",
    content: [
      {
        type: "p",
        text: "Want to know what Shopify theme an online store uses? The storefront design alone rarely gives you a certain answer. A theme can be heavily customized, and two stores using the same starting theme can look unrelated. You can still gather useful public clues by checking the page source, theme assets, and a technology report.",
      },
      {
        type: "h2",
        text: "Confirm that the store uses Shopify",
      },
      {
        type: "p",
        text: "Before looking for a theme, make sure the site is actually a Shopify storefront. Check whether page assets load from Shopify’s content delivery network, look for Shopify-specific markup or scripts, and inspect links that lead to the store’s checkout. No single clue is conclusive: a business can use Shopify for checkout while serving a separate frontend, and third-party tools can load assets from Shopify too.",
      },
      {
        type: "h2",
        text: "Inspect theme clues in the browser",
      },
      {
        type: "h3",
        text: "Search the page source",
      },
      {
        type: "p",
        text: "Use your browser’s view-source command and search for terms such as theme, Shopify.theme, or references to theme assets. Depending on the storefront and its settings, the source may expose a theme name, an identifier, or a directory of files. Shopify’s Liquid templates and asset paths can provide context, but a custom theme may use renamed files or omit identifying details.",
      },
      {
        type: "h3",
        text: "Review loaded stylesheets and scripts",
      },
      {
        type: "p",
        text: "Browser developer tools show which stylesheets and scripts the page loads. Compare filenames and visible code with documentation for a suspected theme, but do not assume that a familiar asset proves the store still uses that theme. Merchants can copy assets, add an app that injects scripts, or replace large parts of a theme while retaining some original files.",
      },
      {
        type: "h2",
        text: "Use a detector for a faster first pass",
      },
      {
        type: "p",
        text: "A website technology detector can check common storefront signals and may identify a theme when the store exposes enough evidence. The report is a starting point: a name or ID can suggest the original theme, while a blank result often means the theme is customized or its identity is not public. Neither outcome provides access to the merchant’s Shopify admin.",
      },
      {
        type: "h2",
        text: "What a theme name does—and does not—tell you",
      },
      {
        type: "p",
        text: "Finding a likely theme can help you understand a design reference, estimate how a storefront might be structured, or prepare questions for a client. It does not tell you which paid options the merchant selected, how much custom development was done, or whether the store has permission to reuse the design. If you are evaluating a client’s store, ask them to confirm the theme in Shopify admin and share the relevant licensing or purchase information.",
      },
      {
        type: "p",
        text: "GetStack checks public storefront signals and reports a Shopify theme when it can detect one. Scan a store to see the platform and other visible technologies before you investigate further.",
      },
    ],
  },
  {
    slug: "how-to-see-what-plugins-a-wordpress-site-is-running",
    title: "How to See What Plugins a WordPress Site Is Running",
    date: "2026-09-15",
    excerpt:
      "Find public clues to WordPress plugins, understand the limits of browser-based detection, and distinguish visible files from a confirmed active plugin list.",
    content: [
      {
        type: "p",
        text: "A WordPress plugin can add a form, store, page builder, security feature, or analytics integration. If you are auditing your own site or preparing for a client conversation, a public scan can reveal some plugin clues. It cannot provide the same complete list as an administrator account, so it helps to know what a browser can actually see.",
      },
      {
        type: "h2",
        text: "Look for plugin files in public pages",
      },
      {
        type: "p",
        text: "Open page source or browser developer tools and search asset URLs for /wp-content/plugins/. Stylesheets, scripts, fonts, or images in a plugin’s directory can identify the software that supplied those files. A recognizable form, shopping cart, or page-builder markup may offer another clue. These indicators are strongest when several pieces of evidence point to the same plugin.",
      },
      {
        type: "h3",
        text: "Check more than the homepage",
      },
      {
        type: "p",
        text: "Plugins often load only on pages that use them. A booking tool may appear on a reservations page but not the homepage; a checkout plugin may only load during a purchase flow. When you have permission to audit the site, review a representative set of public pages and note which page produced each signal. Do not submit forms, create orders, or probe private areas unless the site owner has authorized that testing.",
      },
      {
        type: "h2",
        text: "Why a public scan is not a complete plugin inventory",
      },
      {
        type: "p",
        text: "An asset path may show that plugin files are present, not that the plugin is currently active. Caching, an incomplete removal, or a copied asset can leave a public reference behind. Conversely, a plugin can run entirely on the server and never expose a unique browser signal. Security settings and content delivery networks can also hide or rewrite paths.",
      },
      {
        type: "p",
        text: "The public WordPress REST API is another possible source of clues, but it is not a dependable plugin directory. Some plugins register visible API routes; others do not. Site owners may disable the API, and the absence of a route does not establish that a plugin is missing.",
      },
      {
        type: "h2",
        text: "Use a detector, then verify with the owner",
      },
      {
        type: "p",
        text: "A detection tool can collect recognizable signals across a page and present likely plugins in one report. Treat each result as an observed clue with a confidence limit—not as proof of the active configuration. For a real maintenance or security audit, ask the owner for authorized WordPress access or an exported plugin list, then confirm versions, update status, backups, and the purpose of each plugin before recommending changes.",
      },
      {
        type: "p",
        text: "GetStack checks public pages for detectable WordPress plugins and related platform details. Use a scan to prepare better questions, then verify any proposed changes with the site administrator.",
      },
    ],
  },
  {
    slug: "what-is-builtwith-and-a-simpler-alternative",
    title: "What Is BuiltWith? A Simpler Way to Check a Website’s Technology",
    date: "2026-10-09",
    excerpt:
      "Understand what BuiltWith-style technology lookup tools do, where public detection has limits, and when a focused site scan is the simpler choice.",
    content: [
      {
        type: "p",
        text: "BuiltWith is a website technology lookup service: you enter a domain and review technologies that can be inferred from the site’s public signals. People use technology profilers to research competitors, qualify prospects, evaluate a potential migration, or satisfy curiosity about how a site is put together. They are useful, but their results are observations—not a view into a company’s private systems.",
      },
      {
        type: "h2",
        text: "What technology lookup tools look for",
      },
      {
        type: "p",
        text: "A scanner can inspect public page content, source code, asset URLs, response headers, scripts, and other browser-visible indicators. Those clues may identify a content management system, ecommerce platform, analytics tag, advertising tool, or front-end library. A report can save time compared with manually searching source code, especially when you need a quick first pass across several sites.",
      },
      {
        type: "h2",
        text: "Why detection results can be incomplete",
      },
      {
        type: "p",
        text: "A site owner can remove generator tags, proxy assets through a content delivery network, or build a custom frontend that hides its CMS. Technologies used only on the server may leave no public evidence at all. Old files can produce false positives after a migration, while privacy tools may block scripts that would otherwise reveal a service. No public scanner can guarantee a complete, current inventory from one page request.",
      },
      {
        type: "h2",
        text: "When a simpler alternative is enough",
      },
      {
        type: "p",
        text: "If your question is narrow—such as whether a prospect appears to use WordPress or Shopify—you may not need a broad technology research workflow. A focused scanner can return the detected platform and, when visible, related details such as a theme or plugin clues. That is often enough to prepare an initial call, decide what to verify, or compare a few public storefronts.",
      },
      {
        type: "p",
        text: "GetStack is a straightforward option for checking a public domain for common CMS platforms and other detectable site technologies. It focuses on a readable scan rather than asking you to interpret every raw source-code clue. Use the result as a starting point; confirm important details with the site owner or an authorized technical review.",
      },
      {
        type: "h2",
        text: "Choose a tool based on the decision",
      },
      {
        type: "p",
        text: "Before choosing any profiler, decide what you need to know. For a one-off CMS check, a quick scanner may be sufficient. For repeated prospect research or market analysis, compare how tools organize domains, export results, and explain uncertainty. For a migration or security review, a public lookup is only reconnaissance; request access and inspect the actual configuration before making a technical recommendation.",
      },
      {
        type: "p",
        text: "In short, BuiltWith and similar services help answer what a public website appears to use. A simpler alternative is useful when you only need a quick, focused view of a domain’s detectable stack.",
      },
    ],
  },
  {
    slug: "how-agencies-audit-a-client-website-before-onboarding",
    title: "How Agencies Audit a Client Website Before Onboarding",
    date: "2026-10-09",
    excerpt:
      "A practical pre-onboarding website audit: map the current stack, confirm access and ownership, identify risks, and turn findings into a clear project scope.",
    content: [
      {
        type: "p",
        text: "A new client’s website can look simple from the outside and still depend on years of plugins, custom code, and third-party services. A short, structured audit before onboarding helps an agency scope work realistically, identify access gaps, and avoid promising a fix before understanding the current setup. The goal is not to test everything; it is to learn enough to plan the next step safely.",
      },
      {
        type: "h2",
        text: "1. Agree on the audit’s scope",
      },
      {
        type: "p",
        text: "Start by confirming the client’s goals, the domains and environments in scope, and what the agency is authorized to inspect. A public scan is a useful first look, but logging into an admin panel, submitting transactions, running intrusive tests, or changing settings requires explicit permission. Record who will provide access and how credentials will be shared through an approved secure process.",
      },
      {
        type: "h2",
        text: "2. Build a current technology inventory",
      },
      {
        type: "p",
        text: "Identify the apparent CMS or ecommerce platform, theme, visible plugins or apps, analytics tools, forms, and external services. Note which findings came from public signals and which were confirmed by the client. A detector can speed up reconnaissance and help prepare focused questions, but it cannot verify every server-side dependency or tell you whether a visible plugin is currently active.",
      },
      {
        type: "h2",
        text: "3. Check ownership, access, and operational risk",
      },
      {
        type: "p",
        text: "Ask who controls the domain registrar, hosting, CMS, payment accounts, analytics, and backups. Confirm whether the client can grant the right level of access and whether a staging site exists. With authorization, review software versions, update responsibilities, backup and restore procedures, and known incidents. Separate urgent, evidence-backed risks from routine maintenance so a public clue is not presented as a confirmed vulnerability.",
      },
      {
        type: "h2",
        text: "4. Turn findings into a realistic scope",
      },
      {
        type: "p",
        text: "Translate the inventory into questions and work packages: what must be preserved, what integrations need testing, what can be updated safely, and what needs deeper discovery? Call out unknowns explicitly. A site with a custom theme, undocumented integrations, or no recent backup may need a discovery phase before the agency can give a dependable timeline or fixed estimate.",
      },
      {
        type: "h2",
        text: "5. Share a useful handoff",
      },
      {
        type: "p",
        text: "Give the client a concise record of the scope, confirmed platform details, unverified observations, access needed, immediate risks, and next decisions. This establishes a shared baseline and reduces repeated discovery when project work begins. Keep sensitive credentials out of the audit report and store them only through the agreed secure access process.",
      },
      {
        type: "p",
        text: "For more agency workflows, see GetStack’s use cases:",
      },
      {
        type: "link",
        href: "/use-cases",
        text: "Explore website technology detection for agencies →",
      },
    ],
  },
  {
    slug: "wordpress-vs-shopify-how-to-tell-which-one-a-site-is-running",
    title: "WordPress vs Shopify — How to Tell Which One a Site Is Running (And What Else You Can Learn)",
    date: "2026-08-14",
    excerpt:
      "WordPress and Shopify are both everywhere, they can both look like almost anything, and they're not always obvious from the surface. Here's how to tell them apart — and what you can learn once you do.",
    content: [
      {
        type: "p",
        text: "If you've ever looked at a website and wondered what's powering it under the hood, you're not alone. Developers do it out of habit. Freelancers do it before every client call. Agency owners do it to scope a competitor. And increasingly, marketers do it to understand what tools a brand is investing in.",
      },
      {
        type: "p",
        text: "The two platforms you'll encounter most often are WordPress and Shopify. They're both everywhere, they can both look like almost anything, and they're not always obvious from the surface. Here's how to tell them apart — and what you can learn once you do.",
      },
      {
        type: "h2",
        text: "The quick visual tells",
      },
      {
        type: "p",
        text: "Neither platform advertises itself in the design, but both leave fingerprints.",
      },
      {
        type: "p",
        text: "WordPress sites often show a /wp-content/ path in image URLs, a ?ver= parameter on scripts, or a generator meta tag in the page source. Themes and plugins each add their own signatures — a Divi site looks different from an Elementor site, and both look different from a custom build.",
      },
      {
        type: "p",
        text: "Shopify sites are usually identifiable by cdn.shopify.com in asset URLs, a Shopify.shop reference in the page source, or checkout URLs that route through checkout.shopify.com. The storefront can be themed to look completely custom, but the infrastructure behind it is consistent.",
      },
      {
        type: "h2",
        text: "What the page source tells you",
      },
      {
        type: "p",
        text: "Right-clicking and viewing page source is the manual approach. It works, but it's slow and requires knowing what to look for. A few things worth scanning for:",
      },
      {
        type: "ul",
        items: [
          "wp-content or wp-includes — WordPress",
          "cdn.shopify.com — Shopify",
          "static.wix.com — Wix",
          "squarespace.com in script paths — Squarespace",
          "/_next/ in image or script URLs — Next.js, likely a custom build",
        ],
      },
      {
        type: "p",
        text: "The absence of these signals usually means a custom-built site or a headless architecture where the frontend has been decoupled from the CMS entirely.",
      },
      {
        type: "h2",
        text: "What a stack detector tells you",
      },
      {
        type: "p",
        text: "Manual source inspection gets you the platform. A stack detector gets you everything else.",
      },
      {
        type: "p",
        text: "Tools like GetStack go several layers deeper — detecting not just the CMS but the active theme, installed plugins, platform version, version status (current vs. outdated), and known security signals. On a WordPress site that means knowing whether they're running Elementor or Divi, which plugins are active, and whether their WordPress core is up to date. On a Shopify site it means knowing their theme, their installed apps, and their store configuration signals.",
      },
      {
        type: "p",
        text: "That level of detail changes how you approach a conversation. Walking into a client call knowing they're on WordPress 6.2 with 23 plugins including three abandoned ones is different from walking in blind.",
      },
      {
        type: "h2",
        text: "WordPress vs Shopify — what the difference actually means",
      },
      {
        type: "p",
        text: "Beyond detection, the platform itself tells you something about the business.",
      },
      {
        type: "p",
        text: "WordPress is a general-purpose CMS. A site running WordPress could be a blog, a business site, a membership platform, an ecommerce store, or all of the above. Plugin count is a useful proxy for complexity — a site with 30 plugins has accumulated technical debt that a site with 8 plugins hasn't.",
      },
      {
        type: "p",
        text: "Shopify is purpose-built for ecommerce. A Shopify site is always a store, which means the questions you ask are different — theme, installed apps, payment configuration, store maturity. Shopify's app ecosystem is analogous to WordPress plugins but more tightly controlled, which means fewer security concerns and more predictable architecture.",
      },
      {
        type: "h2",
        text: "Why this matters beyond curiosity",
      },
      {
        type: "p",
        text: "Knowing what a site runs isn't just trivia. It's intelligence.",
      },
      {
        type: "p",
        text: "For freelancers and agencies, it shapes the scoping conversation — you know what you're inheriting before you quote the job. For developers, it informs technical decisions before a migration or rebuild. For marketers and growth teams, it surfaces the tools a competitor is investing in. For sales teams, it personalizes outreach in a way that generic approaches can't.",
      },
      {
        type: "p",
        text: "The platform is the starting point. The stack is the full picture.",
      },
      {
        type: "h2",
        text: "See any site's full stack in seconds",
      },
      {
        type: "p",
        text: "GetStack detects WordPress, Shopify, Wix, Squarespace, Joomla, and more — including themes, plugins, version status, and security signals. Free, no account required.",
      },
    ],
  },
  {
    slug: "how-to-tell-what-any-website-is-built-with",
    title: "How to Tell What Any Website Is Built With (And Why It Matters)",
    date: "2026-06-01",
    excerpt:
      "Have you ever visited a website and wondered what platform it was built on? Identifying a website's technology stack is easier than ever — and the insights can be surprisingly valuable.",
    content: [
      {
        type: "p",
        text: "Have you ever visited a website and wondered, \"What platform is this built on?\"",
      },
      {
        type: "p",
        text: "Maybe you're researching competitors. Maybe you're planning a redesign. Or maybe you just saw a website you love and want to understand the technology behind it.",
      },
      {
        type: "p",
        text: "The good news is that identifying a website's technology stack is easier than ever — and it can reveal valuable insights about how a business operates online.",
      },
      {
        type: "h2",
        text: "What Is a Website Technology Stack?",
      },
      {
        type: "p",
        text: "A website's \"tech stack\" refers to the collection of technologies used to build and run it.",
      },
      {
        type: "p",
        text: "This can include:",
      },
      {
        type: "ul",
        items: [
          "Content management systems (CMS) like WordPress, Shopify, or Webflow",
          "Analytics platforms such as Google Analytics",
          "Marketing tools like HubSpot or Mailchimp",
          "E-commerce software",
          "Live chat tools",
          "Advertising and tracking platforms",
          "Web servers, frameworks, and hosting infrastructure",
        ],
      },
      {
        type: "p",
        text: "Think of it as looking under the hood of a car. You're not just seeing the finished product — you can see the components that make it work.",
      },
      {
        type: "h2",
        text: "Why Does It Matter?",
      },
      {
        type: "p",
        text: "For business owners and marketers, understanding a website's stack can provide valuable context.",
      },
      {
        type: "h3",
        text: "Competitive Research",
      },
      {
        type: "p",
        text: "If a competitor's website performs exceptionally well, you may want to know what technologies they're using. Are they running Shopify or WooCommerce? Do they use a particular marketing automation platform? Are they investing in analytics, chat systems, or customer experience tools? These insights can help inform your own decisions.",
      },
      {
        type: "h3",
        text: "Vendor Evaluation",
      },
      {
        type: "p",
        text: "If you're considering hiring an agency or rebuilding your website, knowing what technologies are already in use can save time and money. Understanding your current stack helps avoid unnecessary migrations and reveals opportunities for improvement.",
      },
      {
        type: "h3",
        text: "Sales and Prospecting",
      },
      {
        type: "p",
        text: "For agencies, consultants, and SaaS companies, technology data can help identify potential clients. If your company specialises in WordPress support, you can identify websites already running WordPress. If you offer Shopify services, knowing which businesses use Shopify can help focus outreach efforts.",
      },
      {
        type: "h3",
        text: "Learning and Inspiration",
      },
      {
        type: "p",
        text: "Sometimes curiosity is enough. Many designers, developers, and entrepreneurs simply enjoy understanding how successful websites are put together. The stack behind a website often tells a story about the company's priorities, budget, and growth stage.",
      },
      {
        type: "h2",
        text: "How to Identify a Website's Technology",
      },
      {
        type: "p",
        text: "There are several ways to investigate a website's stack.",
      },
      {
        type: "h3",
        text: "Check the Source Code",
      },
      {
        type: "p",
        text: "Viewing page source can reveal clues about the CMS platform, analytics tools, marketing scripts, and frameworks in use. However, this approach can be technical and time-consuming.",
      },
      {
        type: "h3",
        text: "Use Browser Developer Tools",
      },
      {
        type: "p",
        text: "Modern browsers provide powerful inspection tools that can expose scripts, tracking technologies, and network requests. This method offers deeper insights but requires some technical knowledge.",
      },
      {
        type: "h3",
        text: "Use a Technology Detection Tool",
      },
      {
        type: "p",
        text: "The easiest approach is to use a website technology lookup tool that automatically identifies the technologies running behind a site. These tools can scan a domain and provide a breakdown of detected platforms, frameworks, analytics systems, advertising technologies, and more. Instead of manually hunting through source code, you get a clear overview in seconds.",
      },
      {
        type: "h2",
        text: "A Faster Way to Analyse Websites",
      },
      {
        type: "p",
        text: "If you regularly research websites, having a dedicated technology lookup tool can save significant time.",
      },
      {
        type: "p",
        text: "That's where GetStack comes in. GetStack helps identify the technologies powering websites, making it easier to understand competitors, qualify prospects, evaluate opportunities, and satisfy your own curiosity.",
      },
      {
        type: "p",
        text: "Whether you're a marketer, agency owner, developer, or business leader, knowing what's behind a website can help you make more informed decisions.",
      },
      {
        type: "p",
        text: "The next time you find a website that catches your attention, don't just look at the design — take a look at the stack behind it.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
