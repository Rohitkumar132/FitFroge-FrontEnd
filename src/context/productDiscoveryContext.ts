import { createContext } from "react";
import { Product } from "@/types";

export interface ProductDiscoveryContextValue {
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  compareProducts: Product[];
  isCompared: (productId: string) => boolean;
  toggleCompare: (product: Product) => void;
  removeCompare: (productId: string) => void;
  clearCompare: () => void;
  compareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
}

export const ProductDiscoveryContext = createContext<ProductDiscoveryContextValue>({
  quickViewProduct: null,
  openQuickView: () => undefined,
  closeQuickView: () => undefined,
  compareProducts: [],
  isCompared: () => false,
  toggleCompare: () => undefined,
  removeCompare: () => undefined,
  clearCompare: () => undefined,
  compareOpen: false,
  setCompareOpen: () => undefined,
});
