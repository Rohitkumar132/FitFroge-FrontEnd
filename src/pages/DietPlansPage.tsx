import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { DietCard } from "@/components/FitnessCards";
import { useDietPlans, useFoodLog } from "@/hooks/useApi";
import { toast } from "@/components/ui/sonner";

const DietPlansPage = () => {
  const { data } = useDietPlans();
  const foodLog = useFoodLog();
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState(350);

  const submit = async () => {
    await foodLog.mutateAsync({ mealType: "lunch", foodName, calories, protein: 20, carbs: 35, fats: 10 });
    setFoodName("");
    toast.success("Food logged");
  };

  return (
    <Layout>
      <section className="section-padding fit-container">
        <p className="kicker">Diet plans and macros</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">Fuel your training</h1>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-5 md:grid-cols-2">
            {data?.data.map(plan => <DietCard key={plan._id} plan={plan} />)}
          </div>
          <aside className="glass-card h-fit rounded-lg p-5">
            <h2 className="text-xl font-black">Quick food log</h2>
            <input value={foodName} onChange={e => setFoodName(e.target.value)} placeholder="Paneer rice bowl" className="mt-4 w-full rounded-md border border-border bg-background px-4 py-3" />
            <input value={calories} onChange={e => setCalories(Number(e.target.value))} type="number" className="mt-3 w-full rounded-md border border-border bg-background px-4 py-3" />
            <button onClick={submit} disabled={!foodName} className="neon-button mt-4 w-full">Log food</button>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default DietPlansPage;
