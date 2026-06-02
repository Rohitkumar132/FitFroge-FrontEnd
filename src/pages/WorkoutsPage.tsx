import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { WorkoutCard } from "@/components/FitnessCards";
import { useCategories, useWorkouts } from "@/hooks/useApi";

const WorkoutsPage = () => {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const difficulty = params.get("difficulty") || "";
  const { data, isLoading } = useWorkouts({ category, difficulty });
  const { data: categories } = useCategories("workout");

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  return (
    <Layout>
      <section className="section-padding fit-container">
        <p className="kicker">Workout library</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">Programs for every goal</h1>
        <div className="mt-8 flex flex-wrap gap-2">
          <button onClick={() => setFilter("category", "")} className={`rounded-full px-4 py-2 text-sm font-bold ${!category ? "bg-primary text-primary-foreground" : "border border-border"}`}>All</button>
          {categories?.data.map(cat => (
            <button key={cat._id} onClick={() => setFilter("category", cat.slug)} className={`rounded-full px-4 py-2 text-sm font-bold ${category === cat.slug ? "bg-primary text-primary-foreground" : "border border-border"}`}>{cat.name}</button>
          ))}
          {["beginner", "intermediate", "advanced"].map(level => (
            <button key={level} onClick={() => setFilter("difficulty", difficulty === level ? "" : level)} className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${difficulty === level ? "bg-accent text-accent-foreground" : "border border-border"}`}>{level}</button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />) : data?.data.map(workout => <WorkoutCard key={workout._id} workout={workout} />)}
        </div>
      </section>
    </Layout>
  );
};

export default WorkoutsPage;
