import { ReactNode, useCallback, useMemo, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types";
import { ProductDiscoveryContext } from "./productDiscoveryContext";

const MAX_COMPARE_PRODUCTS = 4;

const ProductDiscoveryProvider = ({ children }: { children: ReactNode }) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const openQuickView = useCallback((product: Product) => setQuickViewProduct(product), []);
  const closeQuickView = useCallback(() => setQuickViewProduct(null), []);
  const isCompared = useCallback(
    (productId: string) => compareProducts.some(product => product._id === productId),
    [compareProducts]
  );

  const toggleCompare = useCallback((product: Product) => {
    setCompareProducts(prev => {
      if (prev.some(item => item._id === product._id)) {
        toast("Removed from compare", {
          description: product.name,
        });
        return prev.filter(item => item._id !== product._id);
      }

      if (prev.length >= MAX_COMPARE_PRODUCTS) {
        toast.error("Compare limit reached", {
          description: "You can compare up to 4 products at once.",
        });
        return prev;
      }

      toast.success("Added to compare", {
        description: product.name,
      });
      setCompareOpen(true);
      return [...prev, product];
    });
  }, []);

  const removeCompare = useCallback((productId: string) => {
    setCompareProducts(prev => prev.filter(product => product._id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareProducts([]);
    setCompareOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      quickViewProduct,
      openQuickView,
      closeQuickView,
      compareProducts,
      isCompared,
      toggleCompare,
      removeCompare,
      clearCompare,
      compareOpen,
      setCompareOpen,
    }),
    [
      clearCompare,
      closeQuickView,
      compareOpen,
      compareProducts,
      isCompared,
      openQuickView,
      quickViewProduct,
      removeCompare,
      toggleCompare,
    ]
  );

  return <ProductDiscoveryContext.Provider value={value}>{children}</ProductDiscoveryContext.Provider>;
};

export default ProductDiscoveryProvider;
