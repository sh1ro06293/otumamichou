import { createContext } from 'react';

export interface User {
  uuid: string;
  name: string;
  email: string;
}

export type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  checkLoginStatus: () => Promise<void>;
};

// --- Contextの作成 ---

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
