import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const NotFound = () => (
  <Layout>
    <section className="section-padding fit-container grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="kicker">404</p>
        <h1 className="mt-2 text-5xl font-black">This route missed the rep.</h1>
        <Link to="/" className="neon-button mt-6">Back to FitForge</Link>
      </div>
    </section>
  </Layout>
);

export default NotFound;
