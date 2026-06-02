import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Brain, Play, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { BlogCard, ChallengeCard, DietCard, StatPill, TrainerCard, WorkoutCard } from "@/components/FitnessCards";
import { useHomeData } from "@/hooks/useApi";

const heroImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=85";

const HomePage = () => {
  const { data, isLoading } = useHomeData();
  const home = data?.data;

  return (
    <Layout>
      <section className="relative min-h-[82vh] overflow-hidden">
        <img src={heroImage} alt="FitForge strength training" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/82 to-background/20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="section-padding fit-container relative flex min-h-[82vh] items-center pb-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="kicker">Premium fitness command center</p>
            <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] md:text-7xl">
              Forge a body that performs.
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-medium text-muted-foreground md:text-xl">
              FitForge combines cinematic workouts, trainer-led programs, Indian diet intelligence, progress analytics, and community challenges in one responsive platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" className="neon-button">Start free <ArrowRight size={18} /></Link>
              <Link to="/videos" className="ghost-button"><Play size={18} /> Watch workouts</Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              <StatPill value="900+" label="sessions" />
              <StatPill value="4.9" label="coach rating" />
              <StatPill value="21D" label="challenges" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding fit-container -mt-14 relative z-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Brain, title: "Rule-based AI plans", text: "Goal, level, equipment, and habit-aware recommendations." },
            { icon: BarChart3, title: "Progress analytics", text: "Track sets, reps, weight, BMI, macros, streaks, and calories." },
            { icon: ShieldCheck, title: "Mobile-ready APIs", text: "Clean JWT auth and modular endpoints for future app builds." },
          ].map(item => (
            <div key={item.title} className="glass-card rounded-lg p-5">
              <item.icon className="text-primary" />
              <h2 className="mt-4 text-lg font-black">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding fit-container">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="kicker">Workout categories</p>
            <h2 className="text-3xl font-black md:text-5xl">Choose your arena</h2>
          </div>
          <Link to="/workouts" className="ghost-button hidden md:inline-flex">All workouts <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(home?.categories || []).filter(c => c.type === "workout").map(category => (
            <Link key={category._id} to={`/workouts?category=${category.slug}`} className="fitness-card group relative min-h-64 p-5">
              <img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10" />
              <div className="relative mt-32 text-white">
                <h3 className="text-2xl font-black">{category.name}</h3>
                <p className="mt-2 text-sm text-white/70">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-padding fit-container">
        <div className="mb-6 flex items-center gap-3">
          <Zap className="text-primary" />
          <h2 className="text-3xl font-black">Featured workouts</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {isLoading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />) : home?.workouts.map(workout => <WorkoutCard key={workout._id} workout={workout} />)}
        </div>
      </section>

      <section className="section-padding bg-secondary/45">
        <div className="fit-container grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="kicker">Fuel system</p>
            <h2 className="mt-2 text-4xl font-black">Indian meals. Macro discipline.</h2>
            <p className="mt-4 text-muted-foreground">Diet plans include calories, macros, timings, meals, and trainer tips. Food logging is wired into the dashboard for daily accountability.</p>
            <Link to="/diet" className="neon-button mt-6">Explore diet plans</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {home?.dietPlans.map(plan => <DietCard key={plan._id} plan={plan} />)}
          </div>
        </div>
      </section>

      <section className="section-padding fit-container">
        <div className="mb-6">
          <p className="kicker">Coaching team</p>
          <h2 className="text-3xl font-black">Train with specialists</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {home?.trainers.map(trainer => <TrainerCard key={trainer._id} trainer={trainer} />)}
        </div>
      </section>

      <section className="section-padding fit-container">
        <div className="grid gap-5 lg:grid-cols-3">
          {home?.subscriptions.map(plan => (
            <div key={plan._id} className={`glass-card rounded-lg p-6 ${plan.isPopular ? "border-primary" : ""}`}>
              <p className="kicker">{plan.interval}</p>
              <h3 className="mt-2 text-2xl font-black">{plan.name}</h3>
              <p className="mt-4 text-4xl font-black">₹{plan.price}<span className="text-sm text-muted-foreground">/{plan.interval}</span></p>
              <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
                {plan.features.map(feature => <li key={feature}>• {feature}</li>)}
              </ul>
              <Link to="/auth" className="neon-button mt-6 w-full">Choose plan</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding fit-container grid gap-6 lg:grid-cols-2">
        <div>
          <p className="kicker">Challenges</p>
          <h2 className="text-3xl font-black">Compete with the community</h2>
          <div className="mt-5 grid gap-4">
            {home?.challenges.map(challenge => <ChallengeCard key={challenge._id} challenge={challenge} />)}
          </div>
        </div>
        <div>
          <p className="kicker">Fitness blog</p>
          <h2 className="text-3xl font-black">Learn like an athlete</h2>
          <div className="mt-5 grid gap-4">
            {home?.blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
