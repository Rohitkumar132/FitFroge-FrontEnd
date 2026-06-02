import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgePercent, Check, CreditCard, MapPin, Package, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/useCart";
import { useCreateOrder } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { formatCurrency, getOfferSummary, OFFER_CODE_KEY } from "@/utils/offerEngine";

const steps = [
  { label: "Address", icon: MapPin },
  { label: "Payment", icon: CreditCard },
  { label: "Confirm", icon: Package },
];

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const [offerCode] = useState(() => localStorage.getItem(OFFER_CODE_KEY) || "");
  const offerSummary = getOfferSummary(items, offerCode);
  const appliedOffer = offerSummary.appliedOffer?.eligible ? offerSummary.appliedOffer : null;

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    phone: user?.phone || "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [payment, setPayment] = useState("card");

  const shipping = items.length === 0 ? 0 : offerSummary.payableSubtotal > 999 ? 0 : 99;
  const codFee = payment === "cod" ? 25 : 0;
  const total = offerSummary.payableSubtotal + shipping + codFee;

  const handlePlaceOrder = async () => {
    setError("");
    if (items.length === 0) {
      toast.error("Your cart is empty", {
        description: "Add products before placing an order.",
      });
      navigate("/cart");
      return;
    }

    try {
      await createOrder.mutateAsync({
        items: items.map(item => ({ productId: item.product._id, quantity: item.quantity })),
        shippingAddress: address,
        paymentMethod: payment,
      });
      toast.success("Order placed", {
        description: `Your payment total was ${formatCurrency(total)}.`,
      });
      clearCart();
      localStorage.removeItem(OFFER_CODE_KEY);
      navigate("/order-success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Order placement failed. Please try again.";
      setError(message);
      toast.error("Order failed", {
        description: message,
      });
    }
  };

  const addressFields: { key: keyof typeof address; label: string }[] = [
    { key: "name", label: "Full Name" },
    { key: "phone", label: "Phone Number" },
    { key: "line1", label: "Address Line" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "pincode", label: "PIN Code" },
  ];

  return (
    <Layout>
      <div className="section-padding max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((item, index) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                index <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {index < step ? <Check size={18} /> : <item.icon size={18} />}
              </div>
              <span className={`text-sm font-medium hidden md:inline ${index <= step ? "text-foreground" : "text-muted-foreground"}`}>
                {item.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 ${index < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div>
            {step === 0 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Delivery Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addressFields.map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
                      <input
                        type="text"
                        value={address[key]}
                        onChange={event => setAddress({ ...address, [key]: event.target.value })}
                        className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep(1)}
                  disabled={!address.name || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode}
                  className="w-full mt-6 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
                    { id: "upi", label: "UPI", desc: "Google Pay, PhonePe, Paytm" },
                    { id: "netbanking", label: "Net Banking", desc: "All major banks supported" },
                    { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive (+Rs. 25 fee)" },
                  ].map(option => (
                    <label key={option.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                      payment === option.id ? "border-primary bg-brand-pink-light" : "border-border hover:border-primary/50"
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={payment === option.id}
                        onChange={() => setPayment(option.id)}
                        className="text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="flex-1 border border-border text-foreground font-semibold py-3 rounded-xl hover:bg-muted transition-colors">
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={createOrder.isPending}
                    className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {createOrder.isPending ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="bg-card border border-border rounded-xl p-6 h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Price Details
            </h2>
            {appliedOffer && (
              <div className="mb-4 rounded-xl bg-secondary p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <BadgePercent className="text-primary" size={18} />
                  {appliedOffer.offer.code}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{appliedOffer.message}</p>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-foreground">
                <span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              {offerSummary.discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span className="inline-flex items-center gap-1"><Sparkles size={14} /> Offer discount</span>
                  <span>-{formatCurrency(offerSummary.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-foreground">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
              </div>
              {payment === "cod" && (
                <div className="flex justify-between text-foreground">
                  <span>COD Fee</span>
                  <span>{formatCurrency(codFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-foreground pt-3 border-t border-border">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
