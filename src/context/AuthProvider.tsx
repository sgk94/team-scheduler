import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { auth } from "../firebase/config";
import { AuthContext } from "./AuthContext"; // 👈 import context
import type { AuthContextType } from "./AuthContext";

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  const logout = () => signOut(auth);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
