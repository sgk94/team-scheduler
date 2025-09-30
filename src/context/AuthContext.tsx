import { createContext, useContext } from "react";

import type { User, UserCredential } from "firebase/auth";

const INSTRUMENTS = [
  "lead",
  "acoustic",
  "keys",
  "drums",
  "electric",
  "bgv",
  "violin",
] as const;
type Instrument = (typeof INSTRUMENTS)[number];

type RegisterWithProfileInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  instruments: Instrument[];
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  registerWithProfile: (input: RegisterWithProfileInput) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
