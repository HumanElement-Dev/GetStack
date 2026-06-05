import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>Disclaimer — GetStack</title>
        <meta name="description" content="Important disclaimers regarding the use of GetStack and the accuracy of detection results." />
      </Helmet>
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Disclaimer</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: June 2026</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Accuracy of Results</h2>
              <p>GetStack analyses publicly accessible information to detect the technologies used by websites. While we strive for accuracy, detection results are not guaranteed to be complete or correct. Websites may use techniques that obscure or mask their underlying technology, and results should be treated as indicative rather than definitive.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Informational Purpose Only</h2>
              <p>The information provided by GetStack is for general informational purposes only. It should not be relied upon as professional technical, legal, or business advice. Always verify technology decisions through appropriate professional channels.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Websites</h2>
              <p>GetStack analyses third-party websites on request. We have no affiliation with, and make no representations about, any website analysed through the Service. We are not responsible for the content, accuracy, or practices of any third-party website.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">No Warranty</h2>
              <p>The Service is provided on an "as is" and "as available" basis without any warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
              <p>To the fullest extent permitted by law, GetStack and its operators shall not be liable for any loss or damage — direct, indirect, incidental, or consequential — arising from your use of, or reliance on, the Service or its results.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
              <p>If you have questions about this disclaimer, please contact us via the <a href="/contact" className="text-primary hover:text-blue-600 transition-colors">Contact page</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
