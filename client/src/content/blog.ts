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
