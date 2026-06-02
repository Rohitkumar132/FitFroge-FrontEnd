import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/useCart";
import { useProducts } from "@/hooks/useApi";

const WishlistPage = () => {
  const { wishlist } = useCart();

  // Fetch all products and filter client-side by wishlist IDs
  // For a large catalog, a dedicated /products?ids=... endpoint would be better
  const { data, isLoading } = useProducts({ limit: 100 });
  const allProducts = data?.data || [];
  const wishlistProducts = allProducts.filter(p => wishlist.includes(p._id));

  return (
    <Layout>
      <div className="section-padding max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          My Wishlist
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="aspect-[4/5] bg-muted animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={60} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</p>
            <p className="text-muted-foreground mb-6">Save products you love by tapping the heart icon.</p>
            <Link to="/products"
              className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wishlistProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default WishlistPage;
