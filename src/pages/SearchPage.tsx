import { useSearchParams, Link } from "react-router-dom";
import { Search } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useApi";
import { useFilteredProducts } from "@/hooks/useProductFiltering";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const { data, isLoading } = useProducts({ limit: 1000 });
  const results = useFilteredProducts(data?.data || [], { searchQuery: q });

  return (
    <Layout>
      <div className="section-padding max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Search Results
        </h1>
        {q && (
          <p className="text-muted-foreground mb-6">
            {isLoading ? "Searching..." : `${results.length} result${results.length !== 1 ? "s" : ""} for "${q}"`}
          </p>
        )}

        {!q && (
          <div className="text-center py-20">
            <Search size={50} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Enter a search term in the navbar to find products.</p>
          </div>
        )}

        {q && isLoading && (
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
        )}

        {q && !isLoading && results.length === 0 && (
          <div className="text-center py-20">
            <Search size={50} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground mb-2">No products found</p>
            <p className="text-muted-foreground mb-6">Try different keywords or browse our categories.</p>
            <Link to="/products" className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full hover:opacity-90">
              Browse All Products
            </Link>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
