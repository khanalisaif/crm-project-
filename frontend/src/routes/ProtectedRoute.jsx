import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/*
USAGE:
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

<ProtectedRoute roles={["Admin"]}>
  <Reports />
</ProtectedRoute>
*/

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user } =
    useContext(AuthContext);

  if (loading) return null; // or loader

  // 🔒 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 🔥 Role based protection
  if (
    roles &&
    (!user || !roles.includes(user.role))
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
