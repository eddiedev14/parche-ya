/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode } from "react";
import useAuthState from "@/features/auth/hooks/useAuthState";

interface IProvider {
  children: ReactNode;
}

export const AuthContext = createContext<ReturnType<
  typeof useAuthState
> | null>(null);

export const AuthProvider = ({ children }: IProvider) => {
  const authState = useAuthState();

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};
