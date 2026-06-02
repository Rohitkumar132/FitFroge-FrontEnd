import { Navigate } from "react-router-dom";
import { useAdminAnalytics } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";

const resources = ["workouts", "videos", "trainers", "users", "testimonials", "blogs", "subscriptions", "categories", "challenges", "dietPlans"];

const AdminPage = () => {
  const { user } = useAuth();
  const { data } = useAdminAnalytics();
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <Layout>
      <section className="section-padding fit-container">
        <p className="kicker">Admin control room</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">FitForge operations</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {Object.entries(data?.data || {}).map(([key, value]) => <div key={key} className="glass-card rounded-lg p-5"><p className="text-3xl font-black">{value}</p><p className="text-sm capitalize text-muted-foreground">{key}</p></div>)}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map(resource => (
            <div key={resource} className="fitness-card p-5">
              <h2 className="text-xl font-black capitalize">{resource.replace(/([A-Z])/g, " $1")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">CRUD API ready at <code>/api/admin/{resource}</code>.</p>
              <div className="mt-4 flex gap-2">
                <button className="ghost-button flex-1">Manage</button>
                <button className="neon-button flex-1">Create</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default AdminPage;
