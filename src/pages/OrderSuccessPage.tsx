import { Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";

const OrderSuccessPage = () => (
  <Layout>
    <div className="section-padding max-w-lg mx-auto text-center min-h-[60vh] flex flex-col items-center justify-center">
      <CheckCircle size={80} className="text-green-500 mb-6" />
      <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Order Confirmed!</h1>
      <p className="text-muted-foreground mb-2">Thank you for shopping with Cosmiq Beauty</p>
      <p className="text-sm text-muted-foreground mb-8">Order #ORD-2026-{String(Math.floor(Math.random() * 9000) + 1000)}</p>

      <div className="bg-card border border-border rounded-xl p-6 w-full mb-8">
        <div className="flex items-center gap-3 text-left">
          <Package className="text-primary" size={24} />
          <div>
            <p className="font-semibold text-foreground">Estimated Delivery</p>
            <p className="text-sm text-muted-foreground">3-5 business days</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/profile" className="border border-border text-foreground font-semibold px-6 py-3 rounded-full hover:bg-muted transition-colors text-sm">
          Track Order
        </Link>
        <Link to="/" className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full hover:opacity-90 text-sm flex items-center gap-2">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  </Layout>
);

export default OrderSuccessPage;