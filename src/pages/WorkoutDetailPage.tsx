import { useParams } from "react-router-dom";
import { CheckCircle2, Clock, Dumbbell, Flame, Play } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCompleteWorkout, useWorkout } from "@/hooks/useApi";
import { toast } from "@/components/ui/sonner";

const WorkoutDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading } = useWorkout(slug);
  const completeWorkout = useCompleteWorkout();
  const workout = data?.data;

  const complete = async () => {
    if (!workout) return;
    await completeWorkout.mutateAsync({
      workout: workout._id,
      durationMinutes: workout.durationMinutes,
      caloriesBurned: workout.caloriesBurned,
      exercises: workout.exercises.map(item => ({ name: item.name, sets: item.sets, reps: item.reps })),
    });
    toast.success("Workout completed", { description: "Your dashboard stats were updated." });
  };

  if (isLoading || !workout) return <Layout><div className="section-padding fit-container">Loading workout...</div></Layout>;

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <img src={workout.thumbnail} alt={workout.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/30" />
        <div className="section-padding fit-container relative grid gap-8 py-20 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="kicker">{workout.category.replace("-", " ")} · {workout.difficulty}</p>
            <h1 className="mt-3 text-5xl font-black uppercase md:text-7xl">{workout.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{workout.description}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
              <span className="glass-card rounded-full px-4 py-2"><Clock size={15} className="inline" /> {workout.durationMinutes} min</span>
              <span className="glass-card rounded-full px-4 py-2"><Flame size={15} className="inline" /> {workout.caloriesBurned} kcal</span>
              <span className="glass-card rounded-full px-4 py-2"><Dumbbell size={15} className="inline" /> {workout.equipment.join(", ")}</span>
            </div>
            <button onClick={complete} className="neon-button mt-8"><CheckCircle2 size={18} /> Mark complete</button>
          </div>
          {workout.video && (
            <div className="glass-card overflow-hidden rounded-lg">
              <div className="aspect-video bg-black">
                {workout.video.provider === "youtube" ? (
                  <iframe src={workout.video.url} title={workout.video.title} className="h-full w-full" allowFullScreen />
                ) : (
                  <video src={workout.video.url} poster={workout.video.thumbnail} controls className="h-full w-full" />
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="section-padding fit-container grid gap-4 md:grid-cols-2">
        {workout.exercises.map(exercise => (
          <div key={exercise.name} className="glass-card rounded-lg p-5">
            <h2 className="text-xl font-black">{exercise.name}</h2>
            <p className="mt-2 text-sm font-bold text-primary">{exercise.sets} sets · {exercise.reps} · {exercise.restSeconds}s rest</p>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {exercise.steps.map(step => <li key={step} className="flex gap-2"><Play size={14} className="mt-0.5 text-primary" /> {step}</li>)}
            </ul>
          </div>
        ))}
      </section>
    </Layout>
  );
};

export default WorkoutDetailPage;
