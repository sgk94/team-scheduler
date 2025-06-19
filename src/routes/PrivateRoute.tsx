import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactElement } from "react";

export default function PrivateRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or <Spinner /> if you want

  return user ? children : <Navigate to="/login" replace />;
}
