import { CheckCircle2, Clock, PackageCheck, RefreshCw, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Layout from "@/components/layout/Layout";

const policyCards = [
  { icon: Clock, title: "Return Window", desc: "Start a return within 7 days of delivery for eligible unopened products." },
  { icon: ShieldCheck, title: "Condition Check", desc: "Items must be unused, sealed, and returned with original packaging and invoice." },
  { icon: RefreshCw, title: "Refund Timing", desc: "Refunds are processed to the original payment method after quality verification." },
];

const steps = [
  "Open your order from the Profile page.",
  "Choose the item and select a return reason.",
  "Pack the product with tags, seal, and invoice.",
  "Hand it over during pickup or ship it to the provided address.",
  "Receive your refund after inspection is complete.",
];

const ReturnsPage = () => (
  <Layout>
    <section className="section-padding max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: "Returns & Refund Policy" }]} />

      <div className="max-w-3xl mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Returns & Refund Policy
        </h1>
        <p className="text-muted-foreground text-lg">
          Beauty shopping should feel simple. Here is how eligible returns and refunds work at Cosmiq.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {policyCards.map(item => (
          <div key={item.title} className="bg-card border border-border rounded-lg p-6">
            <item.icon className="text-primary mb-4" size={28} />
            <h2 className="font-bold text-foreground mb-2">{item.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
        <div className="bg-secondary rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <PackageCheck className="text-primary" size={28} />
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Return Steps
            </h2>
          </div>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-foreground pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Non-returnable items</h2>
          <div className="space-y-3">
            {[
              "Opened or used beauty, skincare, and hygiene products",
              "Items missing seals, tags, invoices, or original packaging",
              "Free gifts, samples, and final-sale promotional items",
              "Products damaged after delivery due to handling or storage",
            ].map(item => (
              <div key={item} className="flex gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default ReturnsPage;

