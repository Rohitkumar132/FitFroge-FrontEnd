import { Link } from "react-router-dom";
import { Fragment } from "react";
import { ChevronDown, ChevronUp, GitCompare, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/useCart";
import { useProductDiscovery } from "@/context/useProductDiscovery";
import { useLanguage } from "@/i18n/useLanguage";

const getValueScore = (price: number, rating: number, discount: number) =>
  Math.round(rating * 12 + discount * 1.2 + Math.max(0, 25 - price / 100));

const ProductCompareTray = () => {
  const {
    compareProducts,
    removeCompare,
    clearCompare,
    compareOpen,
    setCompareOpen,
    openQuickView,
  } = useProductDiscovery();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  if (compareProducts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-border bg-background/95 shadow-2xl backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <button
            onClick={() => setCompareOpen(!compareOpen)}
            className="flex items-center justify-between gap-3 text-left"
          >
            <span className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GitCompare size={19} />
              </span>
              <span>
                <span className="block text-sm font-bold text-foreground">{t("common.compare")}</span>
                <span className="block text-xs text-muted-foreground">{compareProducts.length}/4 selected</span>
              </span>
            </span>
            <span className="lg:hidden">{compareOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}</span>
          </button>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:flex-1">
            {compareProducts.map(product => (
              <div key={product._id} className="relative flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card p-2 lg:max-w-56">
                <img src={product.image} alt={product.name} className="h-11 w-11 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">Rs. {product.price.toLocaleString()}</p>
                </div>
                <button onClick={() => removeCompare(product._id)} className="text-muted-foreground hover:text-destructive">
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCompareOpen(!compareOpen)}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 lg:flex-none"
            >
              {compareOpen ? t("common.compare") : t("common.compare")}
            </button>
            <button
              onClick={clearCompare}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Clear
            </button>
          </div>
        </div>

        {compareOpen && (
          <div className="mt-4 max-h-[68vh] overflow-auto rounded-xl border border-border bg-card">
            <div className="min-w-[760px]">
              <div className="grid" style={{ gridTemplateColumns: `180px repeat(${compareProducts.length}, minmax(180px, 1fr))` }}>
                <div className="border-b border-border bg-muted p-4 text-sm font-bold text-foreground">Product</div>
                {compareProducts.map(product => (
                  <div key={product._id} className="border-b border-l border-border p-4">
                    <img src={product.image} alt={product.name} className="mb-3 aspect-square w-full rounded-lg object-cover" />
                    <p className="text-xs font-semibold uppercase text-primary">{product.brand}</p>
                    <Link to={`/product/${product._id}`} className="mt-1 block text-sm font-bold text-foreground hover:text-primary">
                      {product.name}
                    </Link>
                  </div>
                ))}

                {[
                  {
                    label: "Price",
                    render: (product: typeof compareProducts[number]) => `Rs. ${product.price.toLocaleString()}`,
                  },
                  {
                    label: "Discount",
                    render: (product: typeof compareProducts[number]) => `${product.discount}% off`,
                  },
                  {
                    label: "Rating",
                    render: (product: typeof compareProducts[number]) => `${product.rating} (${product.reviews.toLocaleString()} reviews)`,
                  },
                  {
                    label: "Value score",
                    render: (product: typeof compareProducts[number]) => `${getValueScore(product.price, product.rating, product.discount)}/100`,
                  },
                  {
                    label: "Category",
                    render: (product: typeof compareProducts[number]) => product.category,
                  },
                  {
                    label: "Skin fit",
                    render: (product: typeof compareProducts[number]) => product.skinTypes?.slice(0, 3).join(", ") || "All skin types",
                  },
                  {
                    label: "Concerns",
                    render: (product: typeof compareProducts[number]) => product.concerns?.slice(0, 3).join(", ") || product.tags.slice(0, 3).join(", "),
                  },
                  {
                    label: "Stock",
                    render: (product: typeof compareProducts[number]) => product.stock > 0 ? `${product.stock} available` : "Out of stock",
                  },
                ].map(row => (
                  <Fragment key={row.label}>
                    <div className="border-b border-border bg-muted p-4 text-sm font-semibold text-foreground">
                      {row.label}
                    </div>
                    {compareProducts.map(product => (
                      <div key={`${row.label}-${product._id}`} className="border-b border-l border-border p-4 text-sm text-foreground">
                        {row.render(product)}
                      </div>
                    ))}
                  </Fragment>
                ))}

                <div className="bg-muted p-4 text-sm font-semibold text-foreground">Actions</div>
                {compareProducts.map(product => (
                  <div key={`${product._id}-actions`} className="border-l border-border p-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                      >
                        <ShoppingBag size={14} /> Add
                      </button>
                      <button
                        onClick={() => openQuickView(product)}
                        className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-foreground hover:bg-muted"
                      >
                        {t("common.quickView")}
                      </button>
                      <button
                        onClick={() => removeCompare(product._id)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-bold text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCompareTray;
