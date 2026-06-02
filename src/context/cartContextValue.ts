import { createContext } from "react";
import { CartContextType } from "./cartTypes";

export const CartContext = createContext<CartContextType | undefined>(undefined);
