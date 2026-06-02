import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Layout from "@/components/layout/Layout";

const contactCards = [
  { icon: Mail, title: "Email", value: "support@Cosmiq.com", detail: "Replies within 24 hours" },
  { icon: Phone, title: "Phone", value: "+91 98765 43210", detail: "Mon-Sat, 10 AM-7 PM" },
  { icon: MessageCircle, title: "Chat", value: "Live support", detail: "Fast help for orders" },
  { icon: MapPin, title: "Office", value: "Mumbai, India", detail: "Beauty care support hub" },
];

const ContactPage = () => (
  <Layout>
    <section className="section-padding max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <div className="max-w-3xl mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Contact Us
        </h1>
        <p className="text-muted-foreground text-lg">
          Need help with an order, product recommendation, or return? Send us a note and our support team will get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {contactCards.map(item => (
            <div key={item.title} className="bg-card border border-border rounded-lg p-5">
              <item.icon className="text-primary mb-3" size={24} />
              <h2 className="font-bold text-foreground">{item.title}</h2>
              <p className="text-foreground mt-1">{item.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
            </div>
          ))}
        </div>

        <form className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2 text-sm font-medium text-foreground">
              Name
              <input className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary" placeholder="Your name" />
            </label>
            <label className="space-y-2 text-sm font-medium text-foreground">
              Email
              <input type="email" className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary" placeholder="you@example.com" />
            </label>
          </div>

          <label className="space-y-2 text-sm font-medium text-foreground block">
            Topic
            <select className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary">
              <option>Order support</option>
              <option>Product advice</option>
              <option>Returns & refunds</option>
              <option>Partnerships</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground block">
            Message
            <textarea className="min-h-36 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary resize-y" placeholder="How can we help?" />
          </label>

          <button type="submit" className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
            Send Message
          </button>
        </form>
      </div>
    </section>
  </Layout>
);

export default ContactPage;

