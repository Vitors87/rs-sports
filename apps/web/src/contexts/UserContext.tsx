'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export interface CurrentUser {
  name: string;
  username: string;
  avatarUrl?: string | null;
}

interface UserContextType {
  user: CurrentUser | null;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType>({ user: null, refreshUser: () => {} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const fetchUser = useCallback(() => {
    apiFetch<{ user: CurrentUser }>('/api/profile/demo_runner')
      .then((d) => setUser({ name: d.user.name, username: d.user.username, avatarUrl: d.user.avatarUrl }))
      .catch(() => {});
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
