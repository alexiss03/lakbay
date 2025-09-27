import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role?: 'user' | 'host' | 'admin';
  authProvider?: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const currentUser = user as User | undefined;

  return {
    user: currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isHost: currentUser?.role === 'host' || currentUser?.role === 'admin',
    hasRole: (role: 'user' | 'host' | 'admin') => currentUser?.role === role,
  };
}