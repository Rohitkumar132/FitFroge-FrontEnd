import { Link } from "react-router-dom";
import CosmiqLogo from "@/components/ConsmiqLogo";

const Index = () => (
  <main className="min-h-screen bg-background text-foreground flex items-center justify-center section-padding">
    <div className="text-center max-w-md">
      <CosmiqLogo className="justify-center mb-6" textClassName="text-4xl" markClassName="h-14 w-14 rounded-2xl" />
      <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
        Cosmiq Beauty
      </h1>
      <p className="text-muted-foreground mb-6">
        Premium beauty products, curated offers, and personalized recommendations.
      </p>
      <Link to="/products" className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity">
        Explore Products
      </Link>
    </div>
  </main>
);

export default Index;
