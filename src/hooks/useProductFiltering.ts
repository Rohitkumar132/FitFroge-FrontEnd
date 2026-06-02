import { useMemo } from "react";
import { Product } from "@/types";

interface ProductFilteringOptions {
  searchQuery?: string;
}

const normalize = (value?: string) => value?.trim().toLowerCase() || "";

const productMatchesSearch = (product: Product, searchQuery: string) => {
  if (!searchQuery) return true;

  return [product.name, product.brand, product.category]
    .map(normalize)
    .some(value => value.includes(searchQuery));
};

export const useFilteredProducts = (
  products: Product[],
  { searchQuery = "" }: ProductFilteringOptions = {}
) => {
  const normalizedSearch = normalize(searchQuery);

  return useMemo(
    () => products.filter(product => productMatchesSearch(product, normalizedSearch)),
    [normalizedSearch, products]
  );
};

