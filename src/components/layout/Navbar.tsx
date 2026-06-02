import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Activity, LayoutDashboard, LogOut, Menu, Moon, Search, Sun, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import FitForgeLogo from "@/components/ConsmiqLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/workouts", label: "Workouts" },
  { to: "/videos", label: "Videos" },
  { to: "/diet", label: "Diet" },
  { to: "/bmi", label: "BMI" },
  { to: "/community", label: "Community" },
  { to: "/blog", label: "Blog" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("fitforge-theme") !== "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("fitforge-theme", dark ? "dark" : "light");
  }, [dark]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn("rounded-full px-3 py-2 text-sm font-bold transition-colors hover:bg-primary/10 hover:text-primary", isActive ? "bg-primary/15 text-primary" : "text-muted-foreground");

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/78 backdrop-blur-xl">
      <div className="border-b border-primary/20 bg-primary/10 py-2 text-center text-xs font-bold uppercase tracking-[0.22em] text-primary">
        Forge your next 1 percent today
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">
          {open ? <X /> : <Menu />}
        </button>
        <Link to="/">
          <FitForgeLogo textClassName="text-2xl" />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map(item => <NavLink key={item.to} to={item.to} className={navClass}>{item.label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/workouts" className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-muted-foreground md:flex">
            <Search size={16} /> Find a workout
          </Link>
          <button onClick={() => setDark(value => !value)} className="rounded-full border border-border p-2 text-foreground hover:text-primary" aria-label="Toggle theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <LanguageSwitcher />
          {user ? (
            <>
              <Link to="/dashboard" className="rounded-full border border-border p-2 hover:text-primary" aria-label="Dashboard">
                <LayoutDashboard size={19} />
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-black text-primary-foreground md:inline-flex">Admin</Link>
              )}
              <button onClick={logout} className="rounded-full border border-border p-2 hover:text-destructive" aria-label="Sign out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-black text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
              <User size={17} /> Join
            </Link>
          )}
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background p-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map(item => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={navClass}>{item.label}</NavLink>)}
            <NavLink to="/dashboard" onClick={() => setOpen(false)} className={navClass}><Activity size={16} /> Dashboard</NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
