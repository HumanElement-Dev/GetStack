import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>Privacy Policy — GetStack</title>
        <meta name="description" content="How GetStack collects, uses, and protects your personal information." />
      </Helmet>
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: June 2026</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p>When you use GetStack, we may collect the following information:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>Account information provided via Replit Auth (name, email address).</li>
                <li>URLs you submit for analysis.</li>
                <li>Usage data such as pages visited, features used, and timestamps.</li>
                <li>Payment information processed securely through Stripe. We do not store card details.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>Provide and improve the GetStack detection service.</li>
                <li>Manage your account and subscription.</li>
                <li>Respond to support requests.</li>
                <li>Monitor for abuse and ensure service security.</li>
                <li>Analyse aggregate usage to improve the product.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Sharing</h2>
              <p>We do not sell your personal data. We may share information with trusted third-party service providers (such as Stripe for payments and Google Analytics for usage analytics) solely to operate the service. These providers are bound by their own privacy policies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Cookies</h2>
              <p>GetStack uses cookies to maintain session state and for analytics purposes. By using the service you consent to the use of cookies in accordance with this policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Retention</h2>
              <p>We retain your data for as long as your account is active or as needed to provide the service. You may request deletion of your account and associated data by contacting us.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
              <p>Depending on your location, you may have rights to access, correct, or delete the personal data we hold about you. To exercise these rights, please contact us at the address below.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact</h2>
              <p>For privacy-related enquiries, please contact us via the <a href="/contact" className="text-primary hover:text-blue-600 transition-colors">Contact page</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
