import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BadgePercent, Check, Copy, Gift, Sparkles, Tags, Timer, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { toast } from "@/components/ui/sonner";
import { useProducts } from "@/hooks/useApi";
import { formatCurrency, getOffers, OFFER_CODE_KEY, OfferType } from "@/utils/offerEngine";

const typeIcons: Record<OfferType, typeof BadgePercent> = {
  percentage: BadgePercent,
  flat: Tags,
  bogo: Gift,
  festival: Sparkles,
};

const typeLabels: Record<OfferType, string> = {
  percentage: "Percentage",
  flat: "Flat",
  bogo: "Buy 2 Get 1",
  festival: "Festival",
};

const OffersPage = () => {
  const { data, isLoading } = useProducts();
  const [copiedCode, setCopiedCode] = useState("");
  const [activeType, setActiveType] = useState<OfferType | "all">("all");

  const products = data?.data || [];
  const offers = useMemo(() => getOffers(), []);
  const visibleOffers = activeType === "all" ? offers : offers.filter(offer => offer.type === activeType);
  const discounted = [...products].sort((a, b) => b.discount - a.discount);
  const festivalProducts = discounted.filter(product => product.discount >= 15 || product.isBestseller).slice(0, 8);

  const handleUseCode = async (code: string) => {
    localStorage.setItem(OFFER_CODE_KEY, code);
    setCopiedCode(code);
    try {
      await navigator.clipboard?.writeText(code);
    } catch {
      // Clipboard access is optional; persisting the code is the important frontend action.
    }
    toast.success("Coupon ready", {
      description: `${code} was saved. It will apply in your cart when eligible.`,
      action: {
        label: "Go to Cart",
        onClick: () => { window.location.href = "/cart"; },
      },
    });
  };

  return (
    <Layout>
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&h=700&fit=crop"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/30" />

        <div className="relative section-padding max-w-7xl mx-auto min-h-[430px] flex items-center">
          <div className="max-w-3xl py-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/10 border border-background/20 px-4 py-2 text-sm font-semibold mb-5">
              <Timer size={16} />
              Festival sale engine is live
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Coupons & Offers
            </h1>
            <p className="text-background/75 text-lg md:text-xl mt-4 max-w-2xl">
              Stack your cart strategy with percentage discounts, flat savings, Buy 2 Get 1 rewards, and a seasonal festival engine.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              {offers.map(offer => (
                <button
                  key={offer.code}
                  onClick={() => setActiveType(offer.type)}
                  className="rounded-lg bg-background/10 border border-background/15 px-4 py-3 text-left hover:bg-background/20 transition-colors"
                >
                  <p className="text-xs text-background/60">{typeLabels[offer.type]}</p>
                  <p className="font-bold">{offer.code}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-8">
          {(["all", "percentage", "flat", "bogo", "festival"] as const).map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeType === type ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-secondary"
              }`}
            >
              {type === "all" ? "All Offers" : typeLabels[type]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {visibleOffers.map((offer, index) => {
            const Icon = typeIcons[offer.type];
            const isCopied = copiedCode === offer.code;

            return (
              <motion.div
                key={offer.code}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="relative overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className={`h-2 bg-gradient-to-r ${offer.accent}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${offer.accent} text-white flex items-center justify-center`}>
                      <Icon size={22} />
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-foreground">
                      Min {formatCurrency(offer.minSubtotal)}
                    </span>
                  </div>

                  <p className="text-sm text-primary font-bold mt-5">{typeLabels[offer.type]}</p>
                  <h2 className="text-xl font-bold text-foreground mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {offer.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2 min-h-16">{offer.description}</p>

                  <div className="mt-5 rounded-lg border border-dashed border-primary/50 bg-brand-pink-light px-4 py-3 flex items-center justify-between gap-3">
                    <span className="font-bold tracking-widest text-primary">{offer.code}</span>
                    <button
                      onClick={() => handleUseCode(offer.code)}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                      {isCopied ? "Applied" : "Use"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="rounded-xl bg-secondary p-6">
            <div className="flex items-center gap-3 mb-5">
              <Zap className="text-primary" size={26} />
              <div>
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  How the frontend sale engine works
                </h2>
                <p className="text-sm text-muted-foreground">No backend required. The selected code is saved locally and applied in cart and checkout.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Percentage offers cap the maximum discount automatically.",
                "Flat discount unlocks when your subtotal crosses the minimum cart value.",
                "Buy 2 Get 1 calculates the lowest priced free item from the cart.",
                "Festival sale changes its campaign theme by season and rewards bigger baskets.",
              ].map(item => (
                <div key={item} className="rounded-lg bg-background border border-border p-4 text-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm font-bold text-primary uppercase tracking-wider">Smart tip</p>
            <h2 className="text-2xl font-bold text-foreground mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Build a 3 item cart for B2G1
            </h2>
            <p className="text-muted-foreground mt-3">
              Add two favourites and one daily essential. The engine picks the lowest priced item as free, then your checkout shows the exact saved amount.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Shop Eligible Products
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Festival Sale Picks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/5] rounded-xl bg-muted animate-pulse" />)
              : festivalProducts.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OffersPage;
