import { Link, useLocation } from "react-router-dom";
import { Heart, Home, Search, ShoppingBag, Sparkles, User } from "lucide-react";
import { useCart } from "@/context/useCart";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/products", label: "Shop", icon: Search },
  { to: "/recommendations", label: "AI", icon: Sparkles },
  { to: "/wishlist", label: "Saved", icon: Heart },
  { to: "/profile", label: "Profile", icon: User },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-[80] rounded-2xl border border-border bg-background/90 px-2 py-2 shadow-2xl backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5">
        {items.map(item => {
          const active = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-bold transition-colors",
                active ? "bg-brand-pink-light text-primary" : "text-muted-foreground"
              )}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <Link
        to="/cart"
        className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl"
        aria-label="Cart"
      >
        <ShoppingBag size={21} />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
            {totalItems}
          </span>
        )}
      </Link>
    </nav>
  );
};

export default MobileBottomNav;
