export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
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
