import { CartItem } from "@/context/cartTypes";

export type OfferType = "percentage" | "flat" | "bogo" | "festival";

export interface Offer {
  code: string;
  title: string;
  description: string;
  type: OfferType;
  minSubtotal: number;
  percent?: number;
  flatAmount?: number;
  maxDiscount?: number;
  buyQuantity?: number;
  freeQuantity?: number;
  festivalName?: string;
  accent: string;
}

export interface OfferEvaluation {
  offer: Offer;
  eligible: boolean;
  discount: number;
  message: string;
}

export interface OfferSummary {
  subtotal: number;
  selectedCode: string;
  appliedOffer: OfferEvaluation | null;
  bestOffer: OfferEvaluation | null;
  availableOffers: OfferEvaluation[];
  discount: number;
  payableSubtotal: number;
}

export const OFFER_CODE_KEY = "Cosmiq_offer_code";

const currency = (amount: number) => `Rs. ${Math.round(amount).toLocaleString()}`;

export const getFestivalOffer = (): Offer => {
  const month = new Date().getMonth();
  const festivalName = month >= 9 || month <= 1 ? "Festive Glow Sale" : month >= 2 && month <= 5 ? "Summer Glow Fest" : "Monsoon Beauty Fest";

  return {
    code: "GLOW25",
    title: `${festivalName}: 25% off`,
    description: "Seasonal sale engine unlocks the richest discount on bigger beauty hauls.",
    type: "festival",
    minSubtotal: 1999,
    percent: 25,
    maxDiscount: 700,
    festivalName,
    accent: "from-rose-500 to-amber-400",
  };
};

export const getOffers = (): Offer[] => [
  {
    code: "Cosmiq20",
    title: "Percentage discount",
    description: "20% off on curated beauty orders. Best for mixed carts.",
    type: "percentage",
    minSubtotal: 1499,
    percent: 20,
    maxDiscount: 500,
    accent: "from-fuchsia-500 to-rose-500",
  },
  {
    code: "FLAT200",
    title: "Flat discount",
    description: "Straight Rs. 200 off. Simple, fast, and perfect for essentials.",
    type: "flat",
    minSubtotal: 999,
    flatAmount: 200,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    code: "B2G1",
    title: "Buy 2 Get 1",
    description: "Add any 3 products and the lowest priced item becomes free.",
    type: "bogo",
    minSubtotal: 0,
    buyQuantity: 2,
    freeQuantity: 1,
    accent: "from-violet-500 to-sky-500",
  },
  getFestivalOffer(),
];

export const getCartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

const getBogoDiscount = (items: CartItem[], offer: Offer) => {
  const groupSize = (offer.buyQuantity || 2) + (offer.freeQuantity || 1);
  const unitPrices = items.flatMap(item => Array.from({ length: item.quantity }, () => item.product.price));
  const freeItems = Math.floor(unitPrices.length / groupSize) * (offer.freeQuantity || 1);

  return unitPrices
    .sort((a, b) => a - b)
    .slice(0, freeItems)
    .reduce((sum, price) => sum + price, 0);
};

export const evaluateOffer = (offer: Offer, items: CartItem[]): OfferEvaluation => {
  const subtotal = getCartSubtotal(items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (subtotal < offer.minSubtotal) {
    return {
      offer,
      eligible: false,
      discount: 0,
      message: `Add ${currency(offer.minSubtotal - subtotal)} more to unlock.`,
    };
  }

  let discount = 0;

  if (offer.type === "flat") {
    discount = offer.flatAmount || 0;
  }

  if (offer.type === "percentage" || offer.type === "festival") {
    discount = subtotal * ((offer.percent || 0) / 100);
    if (offer.maxDiscount) discount = Math.min(discount, offer.maxDiscount);
  }

  if (offer.type === "bogo") {
    const groupSize = (offer.buyQuantity || 2) + (offer.freeQuantity || 1);
    if (totalItems < groupSize) {
      return {
        offer,
        eligible: false,
        discount: 0,
        message: `Add ${groupSize - totalItems} more ${groupSize - totalItems === 1 ? "item" : "items"} to unlock.`,
      };
    }
    discount = getBogoDiscount(items, offer);
  }

  return {
    offer,
    eligible: discount > 0,
    discount: Math.round(discount),
    message: discount > 0 ? `You save ${currency(discount)}.` : "This offer is not available for this cart.",
  };
};

export const getOfferSummary = (items: CartItem[], selectedCode = ""): OfferSummary => {
  const subtotal = getCartSubtotal(items);
  const normalizedCode = selectedCode.trim();
  const availableOffers = getOffers().map(offer => evaluateOffer(offer, items));
  const bestOffer = availableOffers
    .filter(item => item.eligible)
    .sort((a, b) => b.discount - a.discount)[0] || null;
  const appliedOffer = normalizedCode
    ? availableOffers.find(item => item.offer.code.toLowerCase() === normalizedCode.toLowerCase()) || null
    : null;
  const discount = appliedOffer?.eligible ? appliedOffer.discount : 0;

  return {
    subtotal,
    selectedCode: normalizedCode,
    appliedOffer,
    bestOffer,
    availableOffers,
    discount,
    payableSubtotal: Math.max(0, subtotal - discount),
  };
};

export const formatCurrency = currency;
