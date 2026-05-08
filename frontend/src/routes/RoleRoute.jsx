import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
