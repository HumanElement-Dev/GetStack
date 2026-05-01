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
            <p>
              People are always on the lookout for a good WordPress theme. Often when they find a WordPress site they really like, it isn't always obvious which theme is being used (particularly if there is no WordPress theme link or name in the footer).
            </p>
            <p>
              If you know what to do, you can look at the HTML source and hunt out the information, but most people either don't know how or don't want to do that.
            </p>
            <p>
              This free service was created in order to make it really easy for you to get all the details of what WordPress theme and what WordPress plugins are being used on a site, so that you can create your own perfect WordPress site.
            </p>
            <p>
              You can also view who are the most popular WordPress theme providers and most popular WordPress plugins based on the WordPress sites that people have searched on.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
