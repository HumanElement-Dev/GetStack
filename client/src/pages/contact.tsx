import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>Contact - GetStack</title>
        <meta name="description" content="Get in touch with the GetStack team for feedback, bug reports, or any queries." />
      </Helmet>
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-10">Contact Details</h1>

          <div className="flex items-start gap-4 p-6 rounded-lg border bg-card">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground leading-relaxed">
                If you have any feedback, bug reports or queries about this site, please email{" "}
                <a
                  href="mailto:Gtstk@humanelement.agency"
                  className="text-primary font-medium hover:underline"
                >Gtstk@humanelement.agency</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
