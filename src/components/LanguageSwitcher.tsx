import { useEffect, useRef, useState } from "react";
import { Check, Languages } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/i18n/useLanguage";
import { languages } from "@/i18n/translations";
import { cn } from "@/lib/utils";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeLanguage = languages.find(item => item.code === language) || languages[0];

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
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
        aria-label="Choose language"
      >
        <Languages size={17} />
        <span>{activeLanguage.shortLabel}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[100] mt-3 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card p-4 shadow-xl">
          <div className="mb-4">
            <p className="text-sm font-bold text-foreground">{t("language.title")}</p>
            <p className="text-xs text-muted-foreground">{t("language.subtitle")}</p>
          </div>

          <div className="grid gap-2">
            {languages.map(item => {
              const selected = item.code === language;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setOpen(false);
                    toast.success(t("language.changed"), {
                      description: t("language.saved"),
                    });
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                    selected ? "border-primary bg-brand-pink-light" : "border-border hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-primary">
                    {item.shortLabel}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-foreground">{item.nativeName}</span>
                    <span className="block text-xs text-muted-foreground">{item.label}</span>
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

export default LanguageSwitcher;
