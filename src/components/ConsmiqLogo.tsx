import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

const FitForgeLogo = ({
  inverted = false,
  className = "",
  textClassName = "",
}: {
  inverted?: boolean;
  className?: string;
  textClassName?: string;
  markClassName?: string;
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    <span className="grid h-10 w-10 place-items-center rounded-lg border border-primary/40 bg-primary/15 text-primary shadow-[0_0_30px_hsl(var(--primary)/0.35)]">
      <Dumbbell size={21} />
    </span>
    <span className={cn("font-black uppercase tracking-wide", inverted ? "text-white" : "text-foreground", textClassName)}>
      Fit<span className="text-primary">Forge</span>
    </span>
  </div>
);

export default FitForgeLogo;
