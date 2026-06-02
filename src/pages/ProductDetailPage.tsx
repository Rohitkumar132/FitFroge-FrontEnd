import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, Heart, ShoppingBag, Truck, RotateCcw, Shield, ThumbsUp, ChevronRight, GitCompare } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useProduct, useRelatedProducts, useProductReviews } from "@/hooks/useApi";
import { useCart } from "@/context/useCart";
import { useProductDiscovery } from "@/context/useProductDiscovery";
import { formatCurrency } from "@/utils/offerEngine";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, wishlist, toggleWishlist, addToRecentlyViewed } = useCart();
  const { toggleCompare, isCompared } = useProductDiscovery();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  const { data: productData, isLoading, isError } = useProduct(id!);
  const { data: relatedData } = useRelatedProducts(id!);
  const { data: reviewsData } = useProductReviews(id!, 1);

  const product = productData?.data;
  const related = relatedData?.data || [];
  const reviews = reviewsData?.data || [];

  useEffect(() => {
    if (product) addToRecentlyViewed(product);
  }, [addToRecentlyViewed, product]);

  if (isLoading) return (
    <Layout>
      <div className="section-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted animate-pulse rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-8 bg-muted animate-pulse rounded w-2/3" />
            <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
            <div className="h-10 bg-muted animate-pulse rounded w-1/2" />
          </div>
        </div>
      </div>
    </Layout>
  );

  if (isError || !product) return (
    <Layout>
      <div className="section-padding text-center py-20">
        <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
        <Link to="/products" className="text-primary mt-4 inline-block">Browse all products</Link>
      </div>
    </Layout>
  );

  const isWishlisted = wishlist.includes(product._id);
  const compared = isCompared(product._id);
  const images = product.images?.length > 0 ? product.images : [product.image, product.image, product.image];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="section-padding !py-3 max-w-7xl mx-auto text-sm text-muted-foreground flex items-center gap-1">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-primary">Products</Link>
        <ChevronRight size={14} />
        <Link to={`/products?category=${product.category}`} className="hover:text-primary capitalize">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="section-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-2 md:gap-10 md:p-6">
          {/* Image Gallery */}
          <div className="md:sticky md:top-32 md:self-start">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group aspect-[4/5] overflow-hidden rounded-xl bg-muted md:aspect-square">
              <img src={images[selectedImage]} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </motion.div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-primary' : 'border-border'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {["Quick compare", "Shade-safe picks", "Saved view history"].map(item => (
                <div key={item} className="rounded-lg bg-secondary px-3 py-3 text-center text-xs font-bold text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="rounded-xl bg-background p-4 md:p-6">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</h1>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1 bg-green-600 text-primary-foreground px-2 py-0.5 rounded text-sm">
                <Star size={12} className="fill-current" /> {product.rating}
              </div>
              <span className="text-sm text-muted-foreground">{product.reviews.toLocaleString()} reviews</span>
              {product.stock <= 10 && product.stock > 0 && (
                <span className="text-xs text-orange-500 font-semibold">Only {product.stock} left!</span>
              )}
              {product.stock === 0 && (
                <span className="text-xs text-destructive font-semibold">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold text-foreground">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</span>
              )}
              <span className="bg-brand-pink-light text-primary font-bold text-sm px-3 py-1 rounded-full">{product.discount}% OFF</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                  className="px-3 py-2 text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock === 0 || quantity >= product.stock}
                  className="px-3 py-2 text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
                className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`w-14 rounded-xl border flex items-center justify-center transition-colors ${isWishlisted ? 'bg-brand-pink-light border-primary' : 'border-border hover:border-primary'}`}
              >
                <Heart size={22} className={isWishlisted ? "fill-primary text-primary" : "text-foreground"} />
              </button>
              <button
                onClick={() => toggleCompare(product)}
                className={`w-14 rounded-xl border flex items-center justify-center transition-colors ${compared ? 'bg-brand-pink-light border-primary text-primary' : 'border-border hover:border-primary text-foreground'}`}
                aria-label="Compare product"
              >
                <GitCompare size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-6 pt-6 border-t border-border sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg bg-secondary p-4 text-center">
                <Truck size={20} className="text-primary mb-1" />
                <span className="text-xs text-muted-foreground">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-secondary p-4 text-center">
                <RotateCcw size={20} className="text-primary mb-1" />
                <span className="text-xs text-muted-foreground">Easy Returns</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-secondary p-4 text-center">
                <Shield size={20} className="text-primary mb-1" />
                <span className="text-xs text-muted-foreground">100% Authentic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-6 border-b border-border">
            <button onClick={() => setActiveTab("description")}
              className={`pb-3 font-semibold text-sm transition-colors ${activeTab === "description" ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>
              Description
            </button>
            <button onClick={() => setActiveTab("reviews")}
              className={`pb-3 font-semibold text-sm transition-colors ${activeTab === "reviews" ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>
              Reviews ({product.reviews.toLocaleString()})
            </button>
          </div>

          {activeTab === "description" && (
            <div className="py-6">
              <p className="text-foreground leading-relaxed">{product.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <span key={tag} className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="py-6 space-y-6">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
              ) : reviews.map(review => (
                <div key={review._id} className="border-b border-border pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? "fill-brand-gold text-brand-gold" : "text-border"} />
                      ))}
                    </div>
                    <span className="font-semibold text-sm text-foreground">{review.title}</span>
                    {review.verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>}
                  </div>
                  <p className="text-sm text-foreground">{review.comment}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{review.userName}</span>
                    <span>{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                    <button className="flex items-center gap-1 hover:text-primary">
                      <ThumbsUp size={12} /> Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
