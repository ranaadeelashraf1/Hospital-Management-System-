import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, roleHome } from "../../context/AuthContext";

// Wrap a group of routes with this to require login (and optionally specific roles).
// Usage: <Route element={<ProtectedRoute roles={["ADMIN", "RECEPTIONIST"]} />}>...</Route>
export default function ProtectedRoute({ roles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Logged in, but wrong portal — send them to their own dashboard instead of blocking entirely
    return <Navigate to={roleHome[user.role] || "/login"} replace />;
  }

  return <Outlet />;
}
