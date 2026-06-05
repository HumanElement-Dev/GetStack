import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>Terms of Service — GetStack</title>
        <meta name="description" content="The terms and conditions governing your use of GetStack." />
      </Helmet>
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: June 2026</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using GetStack ("the Service") at gtstk.dev, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
              <p>GetStack is a website technology detection tool that analyses publicly accessible websites to identify the platforms, CMS, and technologies used. The Service is provided for informational purposes only.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Acceptable Use</h2>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>Scan websites without authorisation in a manner that constitutes unlawful access.</li>
                <li>Attempt to circumvent rate limits or abuse the service infrastructure.</li>
                <li>Resell or redistribute the Service without written permission.</li>
                <li>Use the Service for any unlawful purpose.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Accounts and Subscriptions</h2>
              <p>Some features of GetStack require a paid Premium subscription billed monthly via Stripe. You are responsible for maintaining the confidentiality of your account credentials. Subscriptions may be cancelled at any time through the billing portal.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
              <p>All content, branding, and software comprising the Service are the property of GetStack and its operators. You may not copy, reproduce, or create derivative works without express written permission.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
              <p>The Service is provided "as is" without warranty of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Detection results are provided for informational purposes and may not be accurate in all cases.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes are posted constitutes acceptance of the revised terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact</h2>
              <p>For questions about these terms, please contact us via the <a href="/contact" className="text-primary hover:text-blue-600 transition-colors">Contact page</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
