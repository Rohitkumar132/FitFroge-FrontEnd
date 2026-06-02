export type BeautyThemeId =
  | "rose"
  | "pearl"
  | "orchid"
  | "coral"
  | "plum"
  | "mint"
  | "ruby";

export interface BeautyThemePalette {
  id: BeautyThemeId;
  name: string;
  description: string;
  swatches: string[];
}

export const BEAUTY_THEME_STORAGE_KEY = "Cosmiq_beauty_theme";

export const beautyThemePalettes: BeautyThemePalette[] = [
  {
    id: "rose",
    name: "Rose Glow",
    description: "Signature pink beauty tone",
    swatches: ["#E83074", "#ED765E", "#FDE8F1"],
  },
  {
    id: "pearl",
    name: "Pearl Blush",
    description: "Soft bridal nude pink",
    swatches: ["#C45A78", "#E8B7C3", "#FFF3F6"],
  },
  {
    id: "orchid",
    name: "Orchid Luxe",
    description: "Premium mauve and violet",
    swatches: ["#8D4BC2", "#D86BAE", "#F6ECFF"],
  },
  {
    id: "coral",
    name: "Coral Pop",
    description: "Fresh lipstick coral",
    swatches: ["#E85D4F", "#F49B73", "#FFF0EA"],
  },
  {
    id: "plum",
    name: "Plum Night",
    description: "Deep glam berry",
    swatches: ["#7A1F56", "#C64E8A", "#F8EAF2"],
  },
  {
    id: "mint",
    name: "Aloe Mist",
    description: "Clean skincare green",
    swatches: ["#258F79", "#7ECBB4", "#ECFBF7"],
  },
  {
    id: "ruby",
    name: "Ruby Velvet",
    description: "Bold classic beauty red",
    swatches: ["#B61F45", "#E36B73", "#FFF0F2"],
  },
];

export const defaultBeautyTheme: BeautyThemeId = "rose";

export const isBeautyThemeId = (value: string | null): value is BeautyThemeId =>
  beautyThemePalettes.some(theme => theme.id === value);
