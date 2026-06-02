import { ReactNode, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./languageContext";
import {
  defaultLanguage,
  isLanguageCode,
  LANGUAGE_STORAGE_KEY,
  LanguageCode,
  translations,
} from "./translations";

const getInitialLanguage = (): LanguageCode => {
  if (typeof window === "undefined") return defaultLanguage;
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isLanguageCode(savedLanguage) ? savedLanguage : defaultLanguage;
};

const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string) => translations[language][key] || translations[defaultLanguage][key] || key,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageProvider;
