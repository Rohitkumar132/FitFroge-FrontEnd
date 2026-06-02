import { useContext } from "react";
import { ProductDiscoveryContext } from "./productDiscoveryContext";

export const useProductDiscovery = () => useContext(ProductDiscoveryContext);
