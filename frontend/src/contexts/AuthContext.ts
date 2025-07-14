import { createContext } from 'react';

// --- 型定義 ---
// アプリケーションの様々な場所で使うため、ここで定義します。
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
// 他のファイルからこのContextをインポートして利用します。
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
