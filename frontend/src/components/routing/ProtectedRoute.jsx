import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext.jsx";

// Usage: <ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null; // swap for a spinner once you have one
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
