import { Product, RecommendationBudgetRange, RecommendationFilters } from "@/types";

export interface EnrichedProduct extends Product {
  skinTypes: string[];
  concerns: string[];
  suitableFor: string[];
  priceCategory: string;
}

export interface RecommendationMatch {
  product: EnrichedProduct;
  score: number;
  matchedOn: string[];
}

const MIN_RESULTS = 4;
const MAX_RESULTS = 8;

const normalize = (value?: string) => value?.toLowerCase().trim() || "";
const slugify = (value?: string) => normalize(value).replace(/&/g, "and").replace(/\s+/g, "-");

const unique = (values: string[]) => Array.from(new Set(values.map(slugify).filter(Boolean)));

const containsAny = (text: string, keywords: string[]) => keywords.some(keyword => text.includes(keyword));

const categoryAliases: Record<string, string[]> = {
  makeup: ["makeup", "lipstick", "mascara", "foundation", "concealer", "blush", "kajal", "liner"],
  skincare: ["skincare", "skin-care", "serum", "cream", "cleanser", "toner", "moisturizer", "sunscreen", "face"],
  haircare: ["haircare", "hair-care", "shampoo", "conditioner", "hair", "scalp"],
  fragrance: ["fragrance", "perfume", "deodorant", "mist", "eau", "scent"],
  "bath-and-body": ["bath", "body", "shower", "lotion", "wash", "soap"],
};

const skinTypeKeywords: Record<string, string[]> = {
  oily: ["oily", "oil", "matte", "pore", "niacinamide", "gel", "clarifying"],
  dry: ["dry", "hydrating", "hydration", "moistur", "cream", "hyaluronic", "nourish"],
  combination: ["combination", "balance", "lightweight", "gel", "pore"],
  sensitive: ["sensitive", "gentle", "soothing", "calm", "fragrance-free", "dermat"],
  normal: ["normal", "daily", "glow", "radiance", "nourish", "all-skin"],
};

const concernKeywords: Record<string, string[]> = {
  acne: ["acne", "blemish", "clarifying", "pore", "niacinamide", "salicylic"],
  "anti-aging": ["anti-aging", "anti ageing", "age", "retinol", "firm", "repair", "wrinkle"],
  brightening: ["bright", "brightening", "glow", "radiance", "vitamin-c", "vitamin c", "citrus", "fresh"],
  hydration: ["hydrat", "moistur", "hyaluronic", "cream", "nourish"],
  "pore-care": ["pore", "matte", "refining", "cleanse", "clarifying"],
  dullness: ["dull", "glow", "radiance", "bright", "exfoliat"],
};

const allSkinTypes = ["oily", "dry", "combination", "sensitive", "normal"];

export const getPriceCategory = (price: number) => {
  if (price <= 500) return "under-500";
  if (price <= 1000) return "500-1000";
  if (price <= 2000) return "1000-2000";
  return "above-2000";
};

export const isWithinBudget = (price: number, budget: RecommendationBudgetRange | null) => {
  if (!budget) return true;
  if (price < budget.min) return false;
  return budget.max === undefined || price <= budget.max;
};

const productSearchText = (product: Product) =>
  normalize([
    product.name,
    product.brand,
    product.category,
    product.subcategory,
    product.description,
    ...(product.tags || []),
  ].join(" "));

const inferCategory = (product: Product) => {
  const declaredCategory = slugify(product.category);
  if (declaredCategory === "bath-body") return "bath-and-body";
  if (Object.keys(categoryAliases).includes(declaredCategory)) return declaredCategory;

  const text = productSearchText(product);
  return Object.entries(categoryAliases).find(([, keywords]) => containsAny(text, keywords))?.[0] || declaredCategory;
};

const inferSkinTypes = (product: Product, inferredCategory: string) => {
  if (product.skinTypes?.length) return unique(product.skinTypes);

  const text = productSearchText(product);
  const matches = Object.entries(skinTypeKeywords)
    .filter(([, keywords]) => containsAny(text, keywords))
    .map(([skinType]) => skinType);

  if (matches.length) return unique(matches);
  if (["fragrance", "haircare", "bath-and-body"].includes(inferredCategory)) return allSkinTypes;
  return ["normal"];
};

const inferConcerns = (product: Product) => {
  if (product.concerns?.length) return unique(product.concerns);

  const text = productSearchText(product);
  return Object.entries(concernKeywords)
    .filter(([, keywords]) => containsAny(text, keywords))
    .map(([concern]) => concern);
};

export const enrichProductForRecommendations = (product: Product): EnrichedProduct => {
  const category = inferCategory(product);

  return {
    ...product,
    category,
    skinTypes: inferSkinTypes(product, category),
    concerns: inferConcerns(product),
    suitableFor: unique(product.suitableFor || [category]),
    priceCategory: product.priceCategory || getPriceCategory(product.price),
  };
};

const budgetDistancePenalty = (price: number, budget: RecommendationBudgetRange | null) => {
  if (!budget || isWithinBudget(price, budget)) return 0;
  const boundary = price < budget.min ? budget.min : budget.max || budget.min;
  return Math.min(35, Math.ceil(Math.abs(price - boundary) / 100));
};

const scoreProduct = (product: EnrichedProduct, filters: RecommendationFilters): RecommendationMatch => {
  const selectedCategory = slugify(filters.category);
  const selectedSkinType = slugify(filters.skinType);
  const selectedConcerns = unique(filters.concerns);
  const matchedOn: string[] = [];
  let score = 0;

  if (selectedCategory && product.category === selectedCategory) {
    score += 120;
    matchedOn.push("category");
  }

  if (isWithinBudget(product.price, filters.budget)) {
    score += 45;
    matchedOn.push("budget");
  } else {
    score -= budgetDistancePenalty(product.price, filters.budget);
  }

  if (selectedSkinType && product.skinTypes.includes(selectedSkinType)) {
    score += 25;
    matchedOn.push("skin type");
  }

  selectedConcerns.forEach(concern => {
    if (product.concerns.includes(concern)) {
      score += 30;
      matchedOn.push(concern.replace(/-/g, " "));
    }
  });

  if (product.rating) score += Math.min(product.rating, 5);
  if (product.isBestseller) score += 3;
  if (product.isNew) score += 2;

  return { product, score, matchedOn };
};

const byScore = (a: RecommendationMatch, b: RecommendationMatch) =>
  b.score - a.score || b.product.rating - a.product.rating || a.product.price - b.product.price;

export const getRecommendedProducts = (
  products: Product[],
  filters: RecommendationFilters,
  maxResults = MAX_RESULTS
) => {
  const enrichedProducts = products.map(enrichProductForRecommendations);
  const selectedCategory = slugify(filters.category);

  const categoryMatches = selectedCategory
    ? enrichedProducts.filter(product => product.category === selectedCategory)
    : enrichedProducts;

  const strictMatches = categoryMatches.filter(product => isWithinBudget(product.price, filters.budget));
  const primaryMatches = strictMatches.map(product => scoreProduct(product, filters)).sort(byScore);

  if (primaryMatches.length >= MIN_RESULTS) {
    return primaryMatches.slice(0, maxResults).map(match => match.product);
  }

  const fallbackMatches = categoryMatches
    .filter(product => !primaryMatches.some(match => match.product._id === product._id))
    .map(product => scoreProduct(product, filters))
    .sort(byScore);

  const combinedMatches = [...primaryMatches, ...fallbackMatches];

  if (combinedMatches.length > 0) {
    return combinedMatches.slice(0, maxResults).map(match => match.product);
  }

  return enrichedProducts
    .map(product => scoreProduct(product, filters))
    .sort(byScore)
    .slice(0, maxResults)
    .map(match => match.product);
};

