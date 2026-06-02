import { Link, useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getArticle } from "@/content/blog";
import NotFound from "@/pages/not-found";
import { ArrowLeft } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticle(slug);

  if (!article) return <NotFound />;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>{article.title} — GetStack</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
      </Helmet>
      <Header />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-10">
            <p className="text-sm text-muted-foreground mb-3">{formatDate(article.date)}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              {article.title}
            </h1>
          </header>

          {/* Body */}
          <div className="prose-custom space-y-5 text-[17px] leading-relaxed text-foreground/90">
            {article.content.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2 key={i} className="text-2xl font-bold text-foreground mt-10 mb-3 first:mt-0">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "h3") {
                return (
                  <h3 key={i} className="text-lg font-semibold text-foreground mt-7 mb-2">
                    {block.text}
                  </h3>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul key={i} className="list-disc pl-6 space-y-1.5 text-muted-foreground">
                    {block.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-muted-foreground">
                  {block.text}
                </p>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-14 p-6 rounded-xl border border-border bg-muted/40 text-center">
            <p className="font-semibold text-foreground mb-2">Try GetStack free</p>
            <p className="text-sm text-muted-foreground mb-4">
              Detect the CMS, theme, and plugins behind any website in seconds.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Analyse a website →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
