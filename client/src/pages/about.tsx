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
          <h1 className="text-3xl font-bold text-foreground mb-10">About</h1>

          <h2 className="text-xl font-semibold text-foreground mb-4">Why was GetStack Created?</h2>

          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>Finding a great WordPress theme can be challenging. When you come across a website you love, it’s not always clear which theme powers it - especially if there’s no theme credit or developer link in the footer.</p>
            <p>
              While it's possible to dig through the HTML source code to uncover that information, most people either don't know how or simply don't want to spend the time.
            </p>
            <p>
              That's why this free tool exists: to make it easy to identify the WordPress theme and plugins used on any website. With just a quick search, you can discover the tools behind a site you admire and use that inspiration to build something uniquely your own.
            </p>
            <p>
              You can also explore the most popular WordPress theme providers and plugins, based on the websites people search for most often.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
