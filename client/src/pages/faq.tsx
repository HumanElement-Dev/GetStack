import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

const faqs = [
  {
    q: "Will GetStack detect any WordPress theme?",
    a: "GetStack can identify the majority of WordPress themes, including the theme name, version, and author. However, a small number of sites may have their theme details obscured — either for security reasons or because they're running a heavily customised build with no public theme signature. In those cases, GetStack will still confirm that WordPress is running and report as much detail as it can find. Note that GetStack also detects other platforms such as Wix, Shopify, Squarespace, and Joomla, so if a site isn't powered by WordPress, you'll still get useful results.",
  },
  {
    q: "Will this work with all WordPress versions?",
    a: "Yes. GetStack is designed to work across all WordPress versions from 2.x through to the latest release. Detection relies on multiple signals in the page source and HTTP headers, so it remains effective regardless of which version a site is running.",
  },
  {
    q: "Do I need to enter the full URL, or just the domain?",
    a: "If you want to scan a site's homepage, the bare domain is fine (e.g. example.com). If you want to analyse a specific page — for example, a blog running in a subdirectory — enter the full URL including the path (e.g. https://example.com/blog). This matters because some sites run WordPress only on part of their domain, and some plugins are only active on particular pages. Providing the exact URL gives you the most accurate and complete results.",
  },
  {
    q: "What does 'Theme Provider' mean?",
    a: "In GetStack's theme statistics, themes are grouped by their provider rather than listed individually. Many theme studios release dozens of individual themes that all share the same underlying framework. Grouping them by provider gives a more meaningful picture of which theme ecosystems are most widely used across the web.",
  },
  {
    q: "Why aren't all installed WordPress plugins listed?",
    a: "GetStack detects plugins by looking for the assets they load on the frontend — JavaScript files, stylesheets, and known URL patterns. Plugins that work entirely behind the scenes (security scanners, admin tools, email handlers, backup utilities) leave no visible trace in the page source and cannot be detected this way. As a result, you should expect to see roughly 40–50% of the plugins actually installed on a typical site. For a complete picture, you'd need direct access to the WordPress admin panel.",
  },
  {
    q: "When was GetStack created?",
    a: "GetStack was built to give developers, designers, and curious site owners a fast, no-fuss way to look under the hood of any website. What used to require manual inspection of page source code can now be done in seconds — no technical knowledge required.",
  },
  {
    q: "Who built GetStack?",
    a: "GetStack was designed and developed by HumanElement, a digital agency focused on building practical tools for the web.",
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>FAQ - GetStack</title>
        <meta
          name="description"
          content="Answers to common questions about how GetStack detects WordPress themes, plugins, and technology stacks."
        />
      </Helmet>
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-10">
            Frequently Asked Questions
          </h1>

          <div className="space-y-10">
            {faqs.map(({ q, a }, i) => (
              <div key={i}>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {q}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
