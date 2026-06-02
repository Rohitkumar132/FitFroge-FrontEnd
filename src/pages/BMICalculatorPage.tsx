import { useMemo, useState } from "react";
import { Gauge } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCreateBMI } from "@/hooks/useApi";

const BMICalculatorPage = () => {
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(74);
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("male");
  const createBMI = useCreateBMI();
  const bmi = useMemo(() => Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1)), [heightCm, weightKg]);
  const status = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese";
  const gauge = Math.min(100, Math.max(0, (bmi / 40) * 100));

  return (
    <Layout>
      <section className="section-padding fit-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="kicker">Advanced BMI calculator</p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">Know your starting line</h1>
          <p className="mt-4 text-muted-foreground">BMI is a simple screening metric. FitForge pairs it with body weight history, measurements, photos, macros, and training data.</p>
        </div>
        <div className="glass-card rounded-lg p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-bold">Height (cm)<input type="number" value={heightCm} onChange={e => setHeightCm(Number(e.target.value))} className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3" /></label>
            <label className="text-sm font-bold">Weight (kg)<input type="number" value={weightKg} onChange={e => setWeightKg(Number(e.target.value))} className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3" /></label>
            <label className="text-sm font-bold">Age<input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3" /></label>
            <label className="text-sm font-bold">Gender<select value={gender} onChange={e => setGender(e.target.value)} className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3"><option>male</option><option>female</option><option>other</option></select></label>
          </div>
          <div className="mt-8 rounded-lg bg-secondary p-6 text-center">
            <Gauge className="mx-auto text-primary" size={42} />
            <p className="mt-3 text-6xl font-black">{bmi}</p>
            <p className="text-lg font-black text-primary">{status}</p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-background"><div className="h-full bg-primary" style={{ width: `${gauge}%` }} /></div>
            <p className="mt-3 text-xs text-muted-foreground">Healthy range indicator: 18.5 to 24.9</p>
          </div>
          <button onClick={() => createBMI.mutate({ heightCm, weightKg, age, gender })} className="neon-button mt-5 w-full">Save BMI record</button>
        </div>
      </section>
    </Layout>
  );
};

export default BMICalculatorPage;
