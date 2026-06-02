import { Link } from "react-router-dom";
import { Clock, Dumbbell, Flame, Play, Star, Users } from "lucide-react";
import { Workout, Trainer, DietPlan, Blog, Challenge } from "@/types";

export const StatPill = ({ value, label }: { value: string; label: string }) => (
  <div className="rounded-lg border border-border bg-card/70 p-4">
    <p className="text-2xl font-black text-foreground">{value}</p>
    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
  </div>
);

export const WorkoutCard = ({ workout }: { workout: Workout }) => (
  <Link to={`/workouts/${workout.slug}`} className="fitness-card group block">
    <div className="relative aspect-[4/3] overflow-hidden">
      <img src={workout.thumbnail} alt={workout.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">{workout.difficulty}</span>
      <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white backdrop-blur">{workout.category.replace("-", " ")}</span>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-black">{workout.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{workout.description}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock size={14} /> {workout.durationMinutes} min</span>
        <span className="inline-flex items-center gap-1"><Flame size={14} /> {workout.caloriesBurned} kcal</span>
        <span className="inline-flex items-center gap-1"><Dumbbell size={14} /> {workout.equipment[0] || "bodyweight"}</span>
      </div>
    </div>
  </Link>
);

export const TrainerCard = ({ trainer }: { trainer: Trainer }) => (
  <div className="fitness-card">
    <img src={trainer.avatar} alt={trainer.name} className="h-64 w-full object-cover" loading="lazy" />
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black">{trainer.name}</h3>
          <p className="text-sm text-primary">{trainer.title}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-black"><Star size={15} className="fill-primary text-primary" /> {trainer.rating}</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{trainer.bio}</p>
      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground"><Users size={14} /> {trainer.clientsCount}+ clients coached</div>
    </div>
  </div>
);

export const DietCard = ({ plan }: { plan: DietPlan }) => (
  <div className="fitness-card">
    <img src={plan.image} alt={plan.title} className="h-44 w-full object-cover" loading="lazy" />
    <div className="p-4">
      <p className="kicker">{plan.goal.replace("_", " ")}</p>
      <h3 className="mt-1 text-lg font-black">{plan.title}</h3>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
        <div className="rounded-md bg-secondary p-2"><b>{plan.calories}</b><br />kcal</div>
        <div className="rounded-md bg-secondary p-2"><b>{plan.macros.protein}g</b><br />pro</div>
        <div className="rounded-md bg-secondary p-2"><b>{plan.macros.carbs}g</b><br />carb</div>
        <div className="rounded-md bg-secondary p-2"><b>{plan.macros.fats}g</b><br />fat</div>
      </div>
    </div>
  </div>
);

export const BlogCard = ({ blog }: { blog: Blog }) => (
  <Link to={`/blog/${blog.slug}`} className="fitness-card block">
    <img src={blog.coverImage} alt={blog.title} className="h-48 w-full object-cover" loading="lazy" />
    <div className="p-4">
      <p className="kicker">{blog.category}</p>
      <h3 className="mt-2 text-xl font-black">{blog.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{blog.excerpt}</p>
      <p className="mt-4 text-xs font-bold text-muted-foreground">{blog.readMinutes} min read · {blog.views} views</p>
    </div>
  </Link>
);

export const ChallengeCard = ({ challenge }: { challenge: Challenge }) => (
  <div className="fitness-card">
    <div className="relative h-48">
      <img src={challenge.image} alt={challenge.title} className="h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 grid place-items-center bg-black/35">
        <Play className="text-primary" size={34} />
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-black">{challenge.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{challenge.description}</p>
      <p className="mt-4 text-xs font-bold text-primary">{challenge.participants.length} athletes joined</p>
    </div>
  </div>
);
