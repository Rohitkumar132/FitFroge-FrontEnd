import Layout from "@/components/layout/Layout";
import { TrainerCard } from "@/components/FitnessCards";
import { useTrainers } from "@/hooks/useApi";

const TrainersPage = () => {
  const { data } = useTrainers();
  return (
    <Layout>
      <section className="section-padding fit-container">
        <p className="kicker">FitForge trainers</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">Coaches for every phase</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {data?.data.map(trainer => <TrainerCard key={trainer._id} trainer={trainer} />)}
        </div>
      </section>
    </Layout>
  );
};

export default TrainersPage;
