export const LANGUAGE_STORAGE_KEY = "fitforge_language";

export const languages = [
  { code: "en", label: "English", nativeName: "English", shortLabel: "EN" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी", shortLabel: "HI" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];
export const defaultLanguage: LanguageCode = "en";

export const isLanguageCode = (value: string | null): value is LanguageCode =>
  languages.some(language => language.code === value);

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    "language.title": "Language",
    "language.subtitle": "Choose your FitForge interface language.",
    "language.changed": "Language updated",
    "language.saved": "Your preference has been saved.",
  },
  hi: {
    "language.title": "भाषा",
    "language.subtitle": "अपनी FitForge इंटरफेस भाषा चुनें।",
    "language.changed": "भाषा अपडेट हुई",
    "language.saved": "आपकी पसंद सेव कर दी गई है।",
  },
};
