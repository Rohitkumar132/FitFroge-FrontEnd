import { useContext } from "react";
import { BeautyThemeContext } from "./beautyThemeContext";

export const useBeautyTheme = () => useContext(BeautyThemeContext);
