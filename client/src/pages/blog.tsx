import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { articles } from "@/content/blog";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>Blog — GetStack</title>
        <meta
          name="description"
          content="Articles on website technology detection, CMS platforms, and tools for developers, agencies, and marketers."
        />
      </Helmet>
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Blog</h1>
          <p className="text-muted-foreground mb-12">
            Guides and insights on website technology, CMS detection, and the tools behind the web.
          </p>

          <div className="divide-y divide-border">
            {articles.map((article) => (
              <article key={article.slug} className="py-8 first:pt-0">
                <Link href={`/blog/${article.slug}`}>
                  <h2 className="text-xl font-semibold text-foreground hover:text-primary transition-colors cursor-pointer mb-2">
                    {article.title}
                  </h2>
                </Link>
                <p className="text-sm text-muted-foreground mb-3">{formatDate(article.date)}</p>
                <p className="text-muted-foreground leading-relaxed mb-4">{article.excerpt}</p>
                <Link
                  href={`/blog/${article.slug}`}
                  className="text-sm font-medium text-primary hover:text-blue-600 transition-colors"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
