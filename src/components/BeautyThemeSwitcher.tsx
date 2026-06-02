import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { beautyThemePalettes } from "@/theme/beautyThemePalettes";
import { useBeautyTheme } from "@/theme/useBeautyTheme";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

const BeautyThemeSwitcher = () => {
  const { theme, setTheme } = useBeautyTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeTheme = beautyThemePalettes.find(item => item.id === theme) || beautyThemePalettes[0];

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="relative p-2 hover:text-primary transition-colors"
        aria-label="Choose beauty color theme"
      >
        <Palette size={22} />
        <span
          className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border border-background"
          style={{ backgroundColor: activeTheme.swatches[0] }}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[100] mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card p-4 shadow-xl">
          <div className="mb-4">
            <p className="text-sm font-bold text-foreground">Personalized color</p>
            <p className="text-xs text-muted-foreground">Choose a beauty palette for the whole website.</p>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {beautyThemePalettes.map(item => {
              const selected = item.id === theme;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTheme(item.id);
                    setOpen(false);
                    toast.success(`${item.name} applied`, {
                      description: "Your beauty color preference has been saved.",
                    });
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                    selected ? "border-primary bg-brand-pink-light" : "border-border hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  <span className="flex -space-x-1.5">
                    {item.swatches.map(color => (
                      <span
                        key={color}
                        className="h-7 w-7 rounded-full border-2 border-background"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-foreground">{item.name}</span>
                    <span className="block text-xs text-muted-foreground">{item.description}</span>
                  </span>
                  {selected && <Check size={18} className="text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BeautyThemeSwitcher;
