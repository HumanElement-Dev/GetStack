import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function UseCases() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>Use Cases - GetStack</title>
        <meta name="description" content="See how agencies, freelancers, and developers use GetStack to research websites before calls, onboard clients, and study competitor tech stacks." />
      </Helmet>
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Use Cases</h1>
          <p className="text-muted-foreground mb-12">Who uses GetStack and why</p>

          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Before the pitch</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>You've got a discovery call in an hour. The prospect sent over their URL and you want to walk in knowing exactly what you're dealing with — what CMS they're on, how outdated it is, what plugins are running, whether there are obvious issues to flag. GetStack gives you that picture in seconds. No digging through source code. No guessing. Just the full stack, ready before you pick up the phone.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Client onboarding</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>A new client just signed. Before you touch anything, you need to understand the site's foundation — platform, theme, plugin count, WordPress version, security status. GetStack runs the audit instantly and gives you a shareable link to attach to your onboarding notes or send to the client directly. Start every engagement knowing exactly what you inherited.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Competitive research</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>You're scoping a competitor or studying a site you admire. What are they running? Which tools are in their stack? Are they on a page builder or custom-built? GetStack surfaces the full technology layer — CMS, theme, plugins, frameworks — so you can benchmark, borrow ideas, or simply satisfy your curiosity.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Freelancer: researching a prospect</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>You found a prospect worth pitching. Before you write a single word of your proposal, scan their site. You'll know what platform they're on, whether the WordPress install is years out of date, which plugins are active, and whether the theme is off-the-shelf or custom. That context shapes your pitch — and signals to the client that you actually looked before reaching out.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Agency: auditing a client</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>Your team is taking over a site from another agency. You need a fast, accurate read on what's there before anyone touches the codebase. GetStack gives you the platform, theme, active plugins, and version status in one pass — the kind of baseline your project manager can drop straight into a kickoff doc. No surprises two weeks in when someone discovers a plugin conflict or a long-unsupported theme.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Developer: checking a competitor</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>You want to know how a competing product or well-executed site is actually built. Are they on a hosted CMS or self-hosted? Custom stack or a popular framework? GetStack cuts through the surface and shows you the real technology layer — so you can make informed decisions about your own build, or just confirm your assumptions about how they shipped so fast.</p>
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-xl border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-4">Ready to see any site's full stack?</h2>
            <Link href="/">
              <button className="inline-flex items-center px-6 py-3 bg-primary hover:bg-blue-600 text-primary-foreground font-medium rounded-lg transition-colors duration-200">
                Try GetStack Free
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
