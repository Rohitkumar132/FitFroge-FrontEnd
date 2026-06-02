import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "", role: "user" as "user" | "trainer" });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  return (
    <Layout>
      <section className="section-padding fit-container grid min-h-[70vh] place-items-center">
        <div className="glass-card w-full max-w-md rounded-lg p-6">
          <p className="kicker text-center">FitForge access</p>
          <h1 className="mt-2 text-center text-3xl font-black">{isLogin ? "Welcome back" : "Create your account"}</h1>
          {error && <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <form onSubmit={submit} className="mt-6 grid gap-3">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="First name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="rounded-md border border-border bg-background px-4 py-3" />
                <input required placeholder="Last name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="rounded-md border border-border bg-background px-4 py-3" />
              </div>
            )}
            <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-md border border-border bg-background px-4 py-3" />
            <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="rounded-md border border-border bg-background px-4 py-3" />
            {!isLogin && (
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as "user" | "trainer" })} className="rounded-md border border-border bg-background px-4 py-3">
                <option value="user">Athlete</option>
                <option value="trainer">Trainer</option>
              </select>
            )}
            <button className="neon-button w-full">{isLogin ? "Sign in" : "Join FitForge"}</button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} className="mt-5 w-full text-sm font-bold text-primary">
            {isLogin ? "Need an account?" : "Already have an account?"}
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default AuthPage;
