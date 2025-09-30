import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import type { User, UserCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { auth, db } from "../firebase/config";
import { AuthContext } from "./AuthContext"; // 👈 import context
import type { AuthContextType } from "./AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

type Props = {
  children: ReactNode;
};

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
  instruments?: Instrument[];
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

  // const register = (email: string, password: string) =>
  //   createUserWithEmailAndPassword(auth, email, password);

  const registerWithProfile = async ({
    email,
    password,
    firstName,
    lastName,
    instruments = [],
  }: RegisterWithProfileInput): Promise<void> => {
    const cred: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const displayName = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    await setDoc(
      doc(db, "users", cred.user.uid),
      {
        firstName,
        lastName,
        active: true,
        instruments: instruments.map((instrument) =>
          instrument.toLowerCase()
        ) as Instrument[],
        displayName: displayName || (cred.user.email ?? "User"),
        displayNameLower: (displayName || cred.user.email || "user")
          .toString()
          .toLowerCase(),
        email,
        photoURL: cred.user.photoURL ?? null,
        role: "member", // default; elevate later via Admin SDK/claims
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  const logout = () => signOut(auth);

  const value: AuthContextType = {
    user,
    loading,
    login,
    resetPassword,
    registerWithProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
