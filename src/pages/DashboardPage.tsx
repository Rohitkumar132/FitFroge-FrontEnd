import { Navigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Flame, Salad, Trophy } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useAiRecommendations, useDashboard } from "@/hooks/useApi";
import { WorkoutCard } from "@/components/FitnessCards";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data } = useDashboard();
  const ai = useAiRecommendations();
  if (!user) return <Navigate to="/auth" replace />;
  const dashboard = data?.data;

  return (
    <Layout>
      <section className="section-padding fit-container">
        <p className="kicker">Athlete dashboard</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">Welcome, {user.firstName}</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { icon: Activity, label: "Workouts", value: dashboard?.stats.workoutsCompleted || 0 },
            { icon: Flame, label: "Burned", value: `${dashboard?.stats.caloriesBurned || 0} kcal` },
            { icon: Trophy, label: "Streak", value: `${dashboard?.stats.streak || 0} days` },
            { icon: Salad, label: "Logged", value: `${dashboard?.stats.caloriesLogged || 0} kcal` },
          ].map(item => <div key={item.label} className="glass-card rounded-lg p-5"><item.icon className="text-primary" /><p className="mt-4 text-3xl font-black">{item.value}</p><p className="text-sm text-muted-foreground">{item.label}</p></div>)}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="glass-card rounded-lg p-5">
            <h2 className="text-xl font-black">Calories burned</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dashboard?.progress || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="completedAt" hide /><YAxis /><Tooltip /><Bar dataKey="caloriesBurned" fill="hsl(var(--primary))" /></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card rounded-lg p-5">
            <h2 className="text-xl font-black">BMI history</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dashboard?.bmiRecords || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="createdAt" hide /><YAxis /><Tooltip /><Line type="monotone" dataKey="bmi" stroke="hsl(var(--accent))" strokeWidth={3} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-8 glass-card rounded-lg p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><h2 className="text-xl font-black">Rule-based AI coach</h2><p className="text-sm text-muted-foreground">OpenAI-ready architecture, rule engine active now.</p></div>
            <button onClick={() => ai.mutate({})} className="neon-button">Generate plan</button>
          </div>
          {ai.data && <p className="mt-4 rounded-md bg-secondary p-4 text-sm font-bold">{ai.data.data.summary}</p>}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {(ai.data?.data.workouts || dashboard?.recommendations || []).map(workout => <WorkoutCard key={workout._id} workout={workout} />)}
        </div>
      </section>
    </Layout>
  );
};

export default DashboardPage;
