import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireHost?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false, requireHost = false }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isAdmin, isHost } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const currentPath = window.location.pathname;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (requireAdmin && !isAdmin) {
      // User is authenticated but not admin
      navigate('/');
      return;
    }

    if (requireHost && !isHost) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, isAdmin, isHost, navigate, requireAdmin, requireHost]);

  // Don't render children if not authenticated or not admin when required
  if (!isAuthenticated || (requireAdmin && !isAdmin) || (requireHost && !isHost)) {
    return null;
  }

  return <>{children}</>;
};
