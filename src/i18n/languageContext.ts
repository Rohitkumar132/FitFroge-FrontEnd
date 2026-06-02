import { createContext } from "react";
import { defaultLanguage, LanguageCode, translations } from "./translations";

export interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: defaultLanguage,
  setLanguage: () => undefined,
  t: key => translations[defaultLanguage][key] || key,
});
