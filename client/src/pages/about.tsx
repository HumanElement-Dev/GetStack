import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>About - GetStack</title>
        <meta name="description" content="Learn why GetStack was created and how it helps you discover the themes, plugins, and technology behind any website." />
      </Helmet>
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-10">About GetStack</h1>

          <h2 className="text-xl font-semibold text-foreground mb-4">Why was GetStack Created?</h2>

          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>Every developer, freelancer, and agency owner has been there — you find a site you like, or a client sends you a URL, or you're scoping a competitor, and the first question is always the same:</p>
            <p>
              <i>What is this thing built with?</i>
            </p>
            <p>
              The answer used to require digging through page source, running multiple tools, and piecing together fragments. Slow, fragmented, and frankly tedious for something you need to know in thirty seconds.</p>
            <p>GetStack was built to answer that question cleanly. Paste any URL, get the full picture — platform, theme, plugins, version status, and more. No account required. No bloat.</p>
            <p>It started as a WordPress detector. Then themes. Then plugins. Then Shopify, Wix, Squarespace, Joomla. The detection layer keeps growing because the need keeps growing.
            </p>
            <p>
              You can also explore the most popular WordPress theme providers and plugins, based on the websites people search for most often.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">What it's becoming</h2>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>Stack detection is just the beginning. GetStack is building toward full site intelligence — performance, security, accessibility, DNS health, and actionable recommendations. The kind of complete picture that used to require five separate tools and a lot of patience.</p>
          </div>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">Who builds it</h2>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>GetStack is a product of <a href="https://humanelement.agency" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-blue-600 transition-colors font-medium">HumanElement</a> — a digital studio based in Ontario, Canada.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
