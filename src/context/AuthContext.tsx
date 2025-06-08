import React, { useState } from 'react';

export const AuthContext = React.createContext({});

export interface IUser {
  username: string | null;
  shopCode: string | null;
}

export function AuthProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>({ username: localStorage.getItem('username'), shopCode: localStorage.getItem('shopCode') });
  const authContextValue = {
    user,
    signOut: () => {
      localStorage.removeItem('username');
      localStorage.removeItem('access-token');
      setUser({ username: null, shopCode: null });
    },
    signIn: (username: string, shopCode: string) => setUser({ username, shopCode }),
  };

  return <AuthContext.Provider value={authContextValue}>{props.children}</AuthContext.Provider>;
}

interface AuthContextType {
  user: IUser;
  signOut: () => void;
  signIn: (username: string, shopCode: string) => void;
}

export const useAuth = () => React.useContext(AuthContext) as AuthContextType;
