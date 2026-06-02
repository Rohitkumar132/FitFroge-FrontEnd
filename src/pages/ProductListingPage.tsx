import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, SlidersHorizontal, Sparkles, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useProducts, useCategories, useBrands } from "@/hooks/useApi";
import { useFilteredProducts } from "@/hooks/useProductFiltering";
import { Product } from "@/types";
import { useLanguage } from "@/i18n/useLanguage";

const priceRanges = [
  { label: "Under ₹500",     min: 0,    max: 500  },
  { label: "₹500 – ₹1000",  min: 500,  max: 1000 },
  { label: "₹1000 – ₹2000", min: 1000, max: 2000 },
  { label: "Above ₹2000",   min: 2000, max: undefined },
];

const ProductSkeleton = () => (
  <div className="bg-card rounded-xl border border-border overflow-hidden">
    <div className="aspect-[4/5] bg-muted animate-pulse" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
      <div className="h-4 bg-muted animate-pulse rounded w-full" />
      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
    </div>
  </div>
);

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const brandParam = searchParams.get("brand") || "";
  const searchQuery = searchParams.get("q") || "";
  const selectedCategories = useMemo(() => categoryParam ? [categoryParam] : [], [categoryParam]);
  const selectedBrands = useMemo(() => brandParam ? [brandParam] : [], [brandParam]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [sortBy, setSortBy]               = useState("popularity");
  const [showFilters, setShowFilters]     = useState(false);
  const [page, setPage]                   = useState(1);
  const { t } = useLanguage();

  // Build query params for backend
  const filters = useMemo(() => {
    const nextFilters: Record<string, string | number | boolean | undefined> = {
      sortBy,
      page,
      limit: searchQuery ? 1000 : 20,
    };

    if (categoryParam) nextFilters.category = categoryParam;
    if (brandParam)    nextFilters.brand    = brandParam;
    if (selectedPrice !== null) {
      nextFilters.minPrice = priceRanges[selectedPrice].min;
      if (priceRanges[selectedPrice].max !== undefined) nextFilters.maxPrice = priceRanges[selectedPrice].max;
    }

    return nextFilters;
  }, [brandParam, categoryParam, page, searchQuery, selectedPrice, sortBy]);

  const { data, isLoading } = useProducts(filters);
  const { data: catsData }  = useCategories();
  const { data: brandsData } = useBrands();

  const products  = data?.data || [];
  const filteredProducts = useFilteredProducts(products, { searchQuery });
  const meta      = data?.meta;
  const categories = catsData?.data || [];
  const brands    = brandsData?.data || [];

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [brandParam, categoryParam, searchQuery, selectedPrice, sortBy]);

  const updateUrlFilter = (key: "category" | "brand", value?: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    setSearchParams(nextParams);
  };

  const toggleCategory = (slug: string) => {
    const nextCategory = categoryParam === slug ? undefined : slug;
    setPage(1);
    updateUrlFilter("category", nextCategory);
  };

  const toggleBrand = (slug: string) => {
    const nextBrand = brandParam === slug ? undefined : slug;
    setPage(1);
    updateUrlFilter("brand", nextBrand);
  };

  const selectPrice = (index: number) => {
    setSelectedPrice(index);
    setPage(1);
  };

  const clearAll = () => {
    setSelectedPrice(null);
    setPage(1);
    setSearchParams({});
  };

  const hasFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || selectedPrice !== null;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {hasFilters && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">{t("listing.filtersApplied")}</h3>
            <button onClick={clearAll} className="text-primary text-sm font-semibold">{t("common.clearAll")}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(c => (
              <span key={c} className="bg-brand-pink-light text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                {c} <X size={12} className="cursor-pointer" onClick={() => toggleCategory(c)} />
              </span>
            ))}
            {selectedBrands.map(b => (
              <span key={b} className="bg-brand-pink-light text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                {b} <X size={12} className="cursor-pointer" onClick={() => toggleBrand(b)} />
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-foreground mb-3">{t("listing.category")}</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={selectedCategories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="rounded border-border text-primary focus:ring-primary" />
              <span className="text-foreground">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">{t("listing.brand")}</h3>
        <div className="space-y-2">
          {brands.map(b => (
            <label key={b._id} className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={selectedBrands.includes(b.slug)}
                onChange={() => toggleBrand(b.slug)}
                className="rounded border-border text-primary focus:ring-primary" />
              <span className="text-foreground">{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">{t("listing.price")}</h3>
        <div className="space-y-2">
          {priceRanges.map((range, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="radio" name="price" checked={selectedPrice === i}
                onChange={() => selectPrice(i)}
                className="border-border text-primary focus:ring-primary" />
              <span className="text-foreground">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="section-padding max-w-7xl mx-auto">
        <section className="mb-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">{t("listing.kicker")}</p>
              <h1 className="text-4xl font-bold text-foreground md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t("listing.title")}
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                {t("listing.desc")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/recommendations"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {t("home.getRecommendations")} <ArrowRight size={17} />
                </Link>
                <Link
                  to="/offers"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {t("listing.viewOffers")} <Sparkles size={17} />
                </Link>
              </div>
              <div className="mt-7 grid grid-cols-3 gap-3">
                {[t("listing.quickViewChip"), t("listing.compareChip"), t("listing.filtersChip")].map(item => (
                  <div key={item} className="rounded-lg bg-secondary px-3 py-3 text-center text-xs font-bold text-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[280px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&h=760&fit=crop"
                alt="Beauty product discovery"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent lg:bg-gradient-to-t" />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 text-sm font-medium text-foreground border border-border px-4 py-2 rounded-lg">
            <SlidersHorizontal size={16} /> {t("listing.filters")}
          </button>
          <p className="text-sm text-muted-foreground">
            {isLoading ? t("common.loading") : `${searchQuery ? filteredProducts.length : meta?.total ?? filteredProducts.length} ${t("common.products")}`}
          </p>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground">
            <option value="popularity">{t("listing.sortPopularity")}</option>
            <option value="price-low">{t("listing.sortLow")}</option>
            <option value="price-high">{t("listing.sortHigh")}</option>
            <option value="rating">{t("listing.sortRating")}</option>
            <option value="newest">{t("listing.sortNewest")}</option>
          </select>
        </div>

        <div className="flex gap-8">
          <aside className={`${showFilters ? "block" : "hidden"} lg:block w-64 flex-shrink-0`}>
            <div className="rounded-xl border border-border bg-card p-5 lg:sticky lg:top-32">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)
                : filteredProducts.map((p: Product) => <ProductCard key={p._id} product={p} />)
              }
            </div>

            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">{t("listing.noMatch")}</p>
                <button onClick={clearAll} className="mt-4 text-primary font-semibold">{t("common.clearAll")}</button>
              </div>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!meta.hasPrevPage}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-40 hover:border-primary transition-colors"
                >
                  {t("common.previous")}
                </button>
                <span className="text-sm text-muted-foreground">
                  {t("common.page")} {meta.page} {t("common.of")} {meta.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!meta.hasNextPage}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-40 hover:border-primary transition-colors"
                >
                  {t("common.next")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductListingPage;
