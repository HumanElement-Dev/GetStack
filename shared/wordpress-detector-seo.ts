export const wordpressDetectorSeo = {
  path: "/wordpress-detector",
  canonicalUrl: "https://gtstk.dev/wordpress-detector",
  title: "WordPress Theme & Plugin Detector — GetStack",
  description:
    "Instantly detect any WordPress site's theme, plugins, and version. See what's running under the hood — free, no account required.",
  ogDescription:
    "Instantly detect any WordPress site's theme, plugins, and version. Free, no account required.",
};

export const wordpressDetectorFaqItems = [
  {
    question: "Can I detect a WordPress site if the version is hidden?",
    answer:
      "Yes. GetStack uses multiple detection signals beyond the version meta tag — asset paths, script handles, REST API endpoints, and structural patterns that persist even when the version is actively suppressed.",
  },
  {
    question: "Does this work on WordPress.com sites?",
    answer:
      "Yes, though WordPress.com hosted sites have a more restricted plugin environment than self-hosted WordPress.org installations. GetStack will detect the platform and available signals regardless.",
  },
  {
    question:
      "Can I see what theme a WordPress site is using even if it's a custom theme?",
    answer:
      "GetStack detects the active theme including custom themes — name, version, and parent theme if a child theme is in use. If the theme is heavily modified or the stylesheet is obscured, some details may be limited.",
  },
  {
    question: "Is this free?",
    answer:
      "The WordPress detector is completely free. No account required. For saved results, site monitoring, and deeper vulnerability analysis, GetStack offers a premium plan.",
  },
  {
    question: "How accurate is the plugin detection?",
    answer:
      "GetStack detects plugins that leave identifiable traces in the page source or asset structure. Some plugins are deliberately obfuscated or load conditionally — those may not appear in results. The detection covers the majority of commonly used plugins reliably.",
  },
];

export const wordpressDetectorFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: wordpressDetectorFaqItems.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};