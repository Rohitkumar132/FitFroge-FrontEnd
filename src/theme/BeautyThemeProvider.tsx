import { ReactNode, useEffect, useMemo, useState } from "react";
import { BeautyThemeContext } from "./beautyThemeContext";
import {
  BEAUTY_THEME_STORAGE_KEY,
  BeautyThemeId,
  defaultBeautyTheme,
  isBeautyThemeId,
} from "./beautyThemePalettes";

const getInitialTheme = (): BeautyThemeId => {
  if (typeof window === "undefined") return defaultBeautyTheme;
  const savedTheme = localStorage.getItem(BEAUTY_THEME_STORAGE_KEY);
  return isBeautyThemeId(savedTheme) ? savedTheme : defaultBeautyTheme;
};

const BeautyThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<BeautyThemeId>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.beautyTheme = theme;
    localStorage.setItem(BEAUTY_THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <BeautyThemeContext.Provider value={value}>{children}</BeautyThemeContext.Provider>;
};

export default BeautyThemeProvider;
