import { describe, expect, it } from "vitest";
import { getOfferSummary } from "@/utils/offerEngine";
import { CartItem } from "@/context/cartTypes";
import { Product } from "@/types";

const product: Product = {
  _id: "serum-1",
  name: "Glow Serum",
  description: "Hydrating glow serum",
  price: 1000,
  originalPrice: 1200,
  discount: 16,
  image: "/serum.jpg",
  images: ["/serum.jpg"],
  brand: "Cosmiq",
  category: "skincare",
  subcategory: "serum",
  rating: 4.8,
  reviews: 42,
  stock: 20,
  tags: ["glow"],
  isBestseller: true,
  isNew: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const cart: CartItem[] = [{ product, quantity: 2 }];

describe("offer engine", () => {
  it("does not apply a discount when no coupon code is selected", () => {
    const summary = getOfferSummary(cart, "");

    expect(summary.bestOffer?.eligible).toBe(true);
    expect(summary.appliedOffer).toBeNull();
    expect(summary.discount).toBe(0);
    expect(summary.payableSubtotal).toBe(summary.subtotal);
  });

  it("applies a discount only for an eligible selected coupon", () => {
    const summary = getOfferSummary(cart, "FLAT200");

    expect(summary.appliedOffer?.offer.code).toBe("FLAT200");
    expect(summary.discount).toBe(200);
    expect(summary.payableSubtotal).toBe(1800);
  });
});
