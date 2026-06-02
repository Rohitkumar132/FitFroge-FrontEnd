import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { ExternalLink } from "lucide-react";

const influencers = [
  { name: "Priya Sharma", handle: "@priyabeauty", followers: "2.3M", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop", specialty: "Skincare Expert" },
  { name: "Ananya Verma", handle: "@ananyamakeup", followers: "1.8M", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop", specialty: "Makeup Artist" },
  { name: "Meera Kapoor", handle: "@meeraglow", followers: "1.2M", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop", specialty: "Hair Stylist" },
  { name: "Sneha Reddy", handle: "@snehanatural", followers: "890K", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop", specialty: "Clean Beauty" },
  { name: "Divya Menon", handle: "@divyaluxe", followers: "1.5M", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop", specialty: "Luxury Beauty" },
  { name: "Kavya Nair", handle: "@kavyabeauty", followers: "750K", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop", specialty: "Budget Beauty" },
];

const InfluencersPage = () => (
  <Layout>
    <div className="brand-gradient py-12 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Our Influencers</h1>
      <p className="text-primary-foreground/80 mt-2">Beauty creators we love and trust</p>
    </div>

    <div className="section-padding max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {influencers.map((inf, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-6 text-center card-hover">
            <img src={inf.image} alt={inf.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-brand-pink-light" loading="lazy" />
            <h3 className="font-bold text-foreground text-lg">{inf.name}</h3>
            <p className="text-sm text-primary font-medium">{inf.handle}</p>
            <p className="text-xs text-muted-foreground mt-1">{inf.specialty} · {inf.followers} followers</p>
            <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View Profile <ExternalLink size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </Layout>
);

export default InfluencersPage;