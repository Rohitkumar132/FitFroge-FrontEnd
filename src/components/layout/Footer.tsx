import { Link } from "react-router-dom";
import FitForgeLogo from "@/components/ConsmiqLogo";

const Footer = () => (
  <footer className="border-t border-border bg-foreground text-background">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4 md:px-8">
      <div>
        <FitForgeLogo inverted textClassName="text-xl" />
        <p className="mt-4 text-sm text-background/65">Premium training, diet intelligence, progress analytics, and community accountability for India’s next generation of athletes.</p>
      </div>
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest">Train</h3>
        <div className="mt-3 grid gap-2 text-sm text-background/65">
          <Link to="/workouts">Workout Library</Link>
          <Link to="/videos">Video Coaching</Link>
          <Link to="/bmi">BMI Calculator</Link>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest">Fuel</h3>
        <div className="mt-3 grid gap-2 text-sm text-background/65">
          <Link to="/diet">Diet Plans</Link>
          <Link to="/dashboard">Macro Tracking</Link>
          <Link to="/blog">Fitness Blog</Link>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest">Launch</h3>
        <p className="mt-3 text-sm text-background/65">Vercel frontend, Render backend, MongoDB Atlas database, Razorpay-ready billing, Cloudinary-ready video uploads.</p>
      </div>
    </div>
    <div className="border-t border-background/10 py-4 text-center text-xs text-background/50">© 2026 FitForge. Built for relentless progress.</div>
  </footer>
);

export default Footer;
