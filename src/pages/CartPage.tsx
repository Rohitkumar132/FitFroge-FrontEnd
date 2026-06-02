import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BadgePercent, CheckCircle2, Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/useCart";
import { useFeaturedProducts } from "@/hooks/useApi";
import ProductCard from "@/components/ProductCard";
import { toast } from "@/components/ui/sonner";
import { formatCurrency, getOfferSummary, OFFER_CODE_KEY } from "@/utils/offerEngine";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { data: featuredData } = useFeaturedProducts();
  const [offerCode, setOfferCode] = useState(() => localStorage.getItem(OFFER_CODE_KEY) || "");
  const [draftCode, setDraftCode] = useState(offerCode);
  const navigate = useNavigate();
  const offerSummary = getOfferSummary(items, offerCode);
  const shipping = offerSummary.payableSubtotal > 999 ? 0 : totalItems === 0 ? 0 : 99;
  const suggested = (featuredData?.data?.bestsellers || []).slice(0, 4);
  const appliedOffer = offerSummary.appliedOffer?.eligible ? offerSummary.appliedOffer : null;
  const attemptedOffer = offerSummary.selectedCode ? offerSummary.appliedOffer : null;

  useEffect(() => {
    if (offerCode) localStorage.setItem(OFFER_CODE_KEY, offerCode);
    else localStorage.removeItem(OFFER_CODE_KEY);
  }, [offerCode]);

  const applyDraftCode = () => {
    const code = draftCode.trim().toUpperCase();
    setOfferCode(code);

    if (!code) {
      toast("Enter a coupon code", {
        description: "Try Cosmiq20, FLAT200, B2G1, or GLOW25.",
      });
      return;
    }

    const nextSummary = getOfferSummary(items, code);
    const nextOffer = nextSummary.appliedOffer;
    if (nextOffer?.eligible) {
      toast.success("Coupon applied", {
        description: `${nextOffer.offer.code} saved ${formatCurrency(nextOffer.discount)}.`,
      });
    } else {
      toast.error("Coupon not eligible", {
        description: nextOffer?.message || "This coupon code is not available.",
      });
    }
  };

  const clearOffer = () => {
    setOfferCode("");
    setDraftCode("");
    toast("Coupon removed", {
      description: "Your order summary has been updated.",
    });
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="section-padding max-w-7xl mx-auto min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
          <ShoppingBag size={60} className="text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Your cart is empty</h1>
          <p className="text-muted-foreground max-w-sm">
            Looks like you haven't added anything yet. Let's fix that!
          </p>
          <Link to="/products" className="mt-2 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
            Browse Products
          </Link>

          {suggested.length > 0 && (
            <div className="w-full mt-12">
              <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                You Might Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {suggested.map(product => <ProductCard key={product._id} product={product} />)}
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          My Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="bg-card border border-border rounded-xl p-4 flex gap-4">
                <Link to={`/product/${product._id}`} className="flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg" />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-primary uppercase">{product.brand}</p>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-medium text-foreground mt-0.5 line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-foreground">{formatCurrency(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => updateQuantity(product._id, quantity - 1)} className="px-3 py-1.5 hover:bg-muted transition-colors text-foreground">
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1.5 font-medium text-sm text-foreground">{quantity}</span>
                      <button onClick={() => updateQuantity(product._id, quantity + 1)} className="px-3 py-1.5 hover:bg-muted transition-colors text-foreground">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">{formatCurrency(product.price * quantity)}</span>
                      <button onClick={() => removeFromCart(product._id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Order Summary
              </h2>

              <div className="mb-5 rounded-xl bg-secondary p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                  <BadgePercent className="text-primary" size={18} />
                  Coupons & Offers
                </div>
                <div className="flex gap-2">
                  <input
                    value={draftCode}
                    onChange={event => setDraftCode(event.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold uppercase outline-none focus:border-primary"
                  />
                  <button onClick={applyDraftCode} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity">
                    Apply
                  </button>
                </div>

                {offerSummary.bestOffer && !offerCode && (
                  <button
                    onClick={() => {
                      const code = offerSummary.bestOffer?.offer.code || "";
                      setOfferCode(code);
                      setDraftCode(code);
                      if (offerSummary.bestOffer) {
                        toast.success("Best offer applied", {
                          description: `${code} saved ${formatCurrency(offerSummary.bestOffer.discount)}.`,
                        });
                      }
                    }}
                    className="mt-3 w-full rounded-lg border border-primary/30 bg-background px-3 py-2 text-left text-xs text-foreground hover:border-primary transition-colors"
                  >
                    <span className="font-bold text-primary">Best offer:</span> {offerSummary.bestOffer.offer.code} saves {formatCurrency(offerSummary.bestOffer.discount)}
                  </button>
                )}

                {appliedOffer && (
                  <div className="mt-3 flex items-start justify-between gap-3 rounded-lg bg-background border border-green-200 p-3 text-sm">
                    <div className="flex gap-2">
                      <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={17} />
                      <div>
                        <p className="font-bold text-foreground">{appliedOffer.offer.code} applied</p>
                        <p className="text-xs text-muted-foreground">{appliedOffer.message}</p>
                      </div>
                    </div>
                    <button onClick={clearOffer} className="text-muted-foreground hover:text-destructive">
                      <X size={16} />
                    </button>
                  </div>
                )}

                {attemptedOffer && offerCode && !attemptedOffer.eligible && (
                  <p className="mt-3 text-xs font-medium text-destructive">{attemptedOffer.message}</p>
                )}
                {!attemptedOffer && offerCode && (
                  <p className="mt-3 text-xs font-medium text-destructive">This coupon code is not available.</p>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                {offerSummary.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span className="inline-flex items-center gap-1"><Sparkles size={14} /> Offer discount</span>
                    <span>-{formatCurrency(offerSummary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-foreground">
                  <span>Offer subtotal</span>
                  <span>{formatCurrency(offerSummary.payableSubtotal)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                    {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                  </span>
                </div>
                {shipping === 0 && totalItems > 0 && (
                  <p className="text-xs text-green-600">You get free shipping!</p>
                )}
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add {formatCurrency(999 - offerSummary.payableSubtotal)} more for free shipping
                  </p>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground">
                  <span>Total</span>
                  <span>{formatCurrency(offerSummary.payableSubtotal + shipping)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-primary text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <Link to="/products" className="w-full mt-3 border border-border text-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-muted transition-colors text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
