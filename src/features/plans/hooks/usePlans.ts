import { use } from "react";
import { PlansContext } from "../context/PlansContext";

export const usePlans = () => {
  const context = use(PlansContext);
  if (!context) {
    throw new Error("usePlans debe usarse dentro de un PlansProvider");
  }
  return context;
};
