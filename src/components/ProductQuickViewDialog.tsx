import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, GitCompare, Heart, ShoppingBag, Star, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/context/useCart";
import { useProductDiscovery } from "@/context/useProductDiscovery";
import { useLanguage } from "@/i18n/useLanguage";
import { cn } from "@/lib/utils";

const ProductQuickViewDialog = () => {
  const { quickViewProduct: product, closeQuickView, toggleCompare, isCompared } = useProductDiscovery();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];
  const isWishlisted = wishlist.includes(product._id);
  const compared = isCompared(product._id);
  const savings = Math.max(0, product.originalPrice - product.price);

  return (
    <Dialog open={!!product} onOpenChange={open => { if (!open) closeQuickView(); }}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Quick product view</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-secondary p-4 sm:p-6">
            <div className="aspect-square overflow-hidden rounded-xl bg-muted">
              <img src={images[selectedImage] || product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "aspect-square overflow-hidden rounded-lg border-2 bg-background",
                      selectedImage === index ? "border-primary" : "border-transparent"
                    )}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-pink-light px-3 py-1 text-xs font-bold uppercase text-primary">
                {product.brand}
              </span>
              {product.isBestseller && <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-bold text-primary-foreground">{t("common.bestseller")}</span>}
              {product.isNew && <span className="rounded-full bg-brand-coral px-3 py-1 text-xs font-bold text-primary-foreground">{t("common.new")}</span>}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              {product.name}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-sm font-bold text-white">
                <Star size={13} className="fill-current" /> {product.rating}
              </span>
              <span className="text-sm text-muted-foreground">{product.reviews.toLocaleString()} reviews</span>
              <span className={cn("text-sm font-semibold", product.stock > 0 ? "text-green-600" : "text-destructive")}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-5 rounded-xl border border-border bg-muted p-4">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-bold text-foreground">Rs. {product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{product.discount}% {t("product.off")}</span>
                  </>
                )}
              </div>
              {savings > 0 && <p className="mt-1 text-xs font-semibold text-green-600">You save Rs. {savings.toLocaleString()}</p>}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
              <div className="rounded-lg border border-border p-3">
                <Truck className="mx-auto mb-1 text-primary" size={18} />
                Free delivery
              </div>
              <div className="rounded-lg border border-border p-3">
                <Star className="mx-auto mb-1 text-primary" size={18} />
                {product.rating}+ rated
              </div>
              <div className="rounded-lg border border-border p-3">
                <GitCompare className="mx-auto mb-1 text-primary" size={18} />
                {t("common.compare")}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.slice(0, 5).map(tag => (
                <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-3">
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={18} /> {t("common.addToCart")}
              </button>
              <button
                onClick={() => toggleWishlist(product._id)}
                className={cn(
                  "inline-flex h-12 w-12 items-center justify-center rounded-xl border transition-colors",
                  isWishlisted ? "border-primary bg-brand-pink-light text-primary" : "border-border text-foreground hover:border-primary"
                )}
                aria-label="Toggle wishlist"
              >
                <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
              </button>
              <button
                onClick={() => toggleCompare(product)}
                className={cn(
                  "inline-flex h-12 w-12 items-center justify-center rounded-xl border transition-colors",
                  compared ? "border-primary bg-brand-pink-light text-primary" : "border-border text-foreground hover:border-primary"
                )}
                aria-label="Toggle compare"
              >
                <GitCompare size={20} />
              </button>
            </div>

            <Link
              to={`/product/${product._id}`}
              onClick={closeQuickView}
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              Open full product page <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickViewDialog;
