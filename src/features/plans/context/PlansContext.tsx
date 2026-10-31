/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode } from "react";
import { usePlansState } from "../hooks/usePlansState";

interface IProvider {
  children: ReactNode;
}

export const PlansContext = createContext<ReturnType<
  typeof usePlansState
> | null>(null);

export const PlansProvider = ({ children }: IProvider) => {
  const plansState = usePlansState();

  return (
    <PlansContext.Provider value={plansState}>{children}</PlansContext.Provider>
  );
};
