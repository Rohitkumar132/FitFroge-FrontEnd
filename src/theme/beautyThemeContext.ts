import { createContext } from "react";
import { BeautyThemeId, defaultBeautyTheme } from "./beautyThemePalettes";

export interface BeautyThemeContextValue {
  theme: BeautyThemeId;
  setTheme: (theme: BeautyThemeId) => void;
}

export const BeautyThemeContext = createContext<BeautyThemeContextValue>({
  theme: defaultBeautyTheme,
  setTheme: () => undefined,
});
