import { HelpCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Layout from "@/components/layout/Layout";

const faqs = [
  {
    question: "How do I track my order?",
    answer: "Open your profile and visit Orders to see the latest shipment status. We also send tracking updates by email and SMS after dispatch.",
  },
  {
    question: "Are all products authentic?",
    answer: "Yes. Cosmiq works with verified suppliers and brand partners, and every product goes through authenticity checks before it reaches you.",
  },
  {
    question: "Can I combine search with category filters?",
    answer: "Yes. You can select a category and type in the navbar search field to narrow results by product title, brand, or category.",
  },
  {
    question: "How long does delivery take?",
    answer: "Most orders are delivered within 3-7 business days depending on your location. Remote pin codes may take a little longer.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We support cards, UPI, net banking, wallets, and cash on delivery where available.",
  },
  {
    question: "How do returns work?",
    answer: "Eligible unused products can be returned within the return window. Visit the Returns page for steps, exceptions, and refund timing.",
  },
];

const FaqPage = () => (
  <Layout>
    <section className="section-padding max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: "FAQ" }]} />

      <div className="text-center max-w-2xl mx-auto mb-10">
        <HelpCircle className="text-primary mx-auto mb-4" size={36} />
        <h1 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground text-lg">
          Quick answers about orders, products, payments, shipping, and returns.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map(item => (
          <details key={item.question} className="group bg-card border border-border rounded-lg p-5">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-foreground">
              {item.question}
              <span className="text-primary text-xl leading-none group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-muted-foreground mt-4 leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  </Layout>
);

export default FaqPage;

