import { Link } from "react-router-dom";
import { Eye, GitCompare, Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { useCart } from "@/context/useCart";
import { useProductDiscovery } from "@/context/useProductDiscovery";
import { useLanguage } from "@/i18n/useLanguage";
import { cn } from "@/lib/utils";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { openQuickView, toggleCompare, isCompared } = useProductDiscovery();
  const { t } = useLanguage();
  const isWishlisted = wishlist.includes(product._id);
  const compared = isCompared(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group overflow-hidden rounded-xl border border-border bg-card card-hover"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {product.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
            {product.discount}% {t("product.off")}
          </span>
        )}

        {product.isBestseller && (
          <span className="absolute right-12 top-3 rounded-full bg-brand-gold px-2 py-1 text-xs font-bold text-primary-foreground">
            {t("common.bestseller")}
          </span>
        )}
        {!product.isBestseller && product.isNew && (
          <span className="absolute right-12 top-3 rounded-full bg-brand-coral px-2 py-1 text-xs font-bold text-primary-foreground">
            {t("common.new")}
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="rounded-full bg-background/90 px-3 py-1 text-sm font-bold text-foreground">{t("common.outOfStock")}</span>
          </div>
        )}

        <button
          onClick={() => toggleWishlist(product._id)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-transform hover:scale-110"
          aria-label="Toggle wishlist"
        >
          <Heart size={16} className={isWishlisted ? "fill-primary text-primary" : "text-foreground"} />
        </button>

        <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => openQuickView(product)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-transform hover:scale-110 hover:text-primary"
            aria-label="Quick view product"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => toggleCompare(product)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-transform hover:scale-110",
              compared ? "bg-primary text-primary-foreground" : "bg-background/90 text-foreground hover:text-primary"
            )}
            aria-label="Compare product"
          >
            <GitCompare size={18} />
          </button>
        </div>

        {product.stock > 0 && (
          <button
            onClick={() => addToCart(product)}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all hover:scale-110 group-hover:opacity-100"
            aria-label="Add to cart"
          >
            <ShoppingBag size={18} />
          </button>
        )}
      </div>

      <div className="p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{product.brand}</p>
        <Link to={`/product/${product._id}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-1">
          <Star size={12} className="fill-brand-gold text-brand-gold" />
          <span className="text-xs font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-foreground">Rs. {product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-sm text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}</span>
              <span className="text-xs font-semibold text-primary">{product.discount}% {t("product.off")}</span>
            </>
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
          <button
            onClick={() => openQuickView(product)}
            className="rounded-lg border border-border px-2 py-2 text-xs font-bold text-foreground hover:border-primary hover:text-primary"
          >
            {t("common.quickView")}
          </button>
          <button
            onClick={() => toggleCompare(product)}
            className={cn(
              "rounded-lg border px-2 py-2 text-xs font-bold",
              compared ? "border-primary bg-brand-pink-light text-primary" : "border-border text-foreground hover:border-primary"
            )}
          >
            {t("common.compare")}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
