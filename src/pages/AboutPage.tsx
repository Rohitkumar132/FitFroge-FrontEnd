import Layout from "@/components/layout/Layout";
import { Heart, Shield, Leaf, Award } from "lucide-react";

const AboutPage = () => (
  <Layout>
    <div className="brand-gradient py-16 text-center">
      <h1 className="text-4xl font-bold text-primary-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>About Cosmiq</h1>
      <p className="text-primary-foreground/80 mt-2 max-w-lg mx-auto">Where beauty meets trust. We curate the finest products so you can discover, learn, and glow.</p>
    </div>

    <div className="section-padding max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Our Story</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Cosmiq was born from a simple belief: everyone deserves access to premium beauty products with honest advice. We bridge the gap between luxury beauty and everyday accessibility.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            From skincare to makeup, haircare to fragrances — we curate only the best, backed by expert reviews, tutorials, and AI-powered personalization.
          </p>
        </div>
        <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=400&fit=crop" alt="Beauty products" className="rounded-2xl shadow-lg w-full" loading="lazy" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[
          { icon: Heart, label: "50K+", desc: "Happy Customers" },
          { icon: Shield, label: "100%", desc: "Authentic Products" },
          { icon: Leaf, label: "500+", desc: "Brands" },
          { icon: Award, label: "4.8★", desc: "Avg Rating" },
        ].map((stat, i) => (
          <div key={i} className="text-center bg-card border border-border rounded-xl p-6">
            <stat.icon className="text-primary mx-auto mb-3" size={28} />
            <p className="text-2xl font-bold text-foreground">{stat.label}</p>
            <p className="text-sm text-muted-foreground">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Why Choose Cosmiq?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { title: "Curated Selection", desc: "Every product is hand-picked by beauty experts and dermatologists." },
            { title: "AI Personalization", desc: "Get recommendations tailored to your skin type and preferences." },
            { title: "Content + Commerce", desc: "Learn through tutorials, blogs, and expert advice before you buy." },
          ].map((item, i) => (
            <div key={i} className="bg-secondary rounded-xl p-6 text-left">
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Layout>
);

export default AboutPage;