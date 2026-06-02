import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useBrands } from "@/hooks/useApi";

const BrandsPage = () => {
  const { data, isLoading } = useBrands();
  const brands = data?.data || [];

  return (
    <Layout>
      <div className="section-padding max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Top Brands
        </h1>
        <p className="text-muted-foreground mb-8">Shop from India's most loved beauty brands</p>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {brands.map(brand => (
              <Link
                key={brand._id}
                to={`/products?brand=${brand.slug}`}
                className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary hover:shadow-md transition-all group"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-3 group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{brand.name}</p>
                <p className="text-xs text-muted-foreground mt-1">View Products →</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BrandsPage;
