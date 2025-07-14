// src/components/AuthProvider.tsx

import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { AuthContext, type User } from '../contexts/AuthContext';
import apiClient from '../lib/axios';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  console.log(user);
  // ★★★ 初期値をtrueに変更 ★★★
  const [isLoading, setIsLoading] = useState(true);

  const checkLoginStatus = useCallback(async () => {
    console.log(user ? 'User is logged in' + user : 'User is not logged in');
    // setIsLoading(true); ← 初期値がtrueなので、ここは不要になる（あっても害はない）
    try {
      console.log('Sending request to /user endpoint...');
      const response = await apiClient.get<User>('/user');
      console.log('Response from /user:', response);
      setUser(response.data);
      console.log('バックエンドからの生データ:', response.data);
    } catch (error) {
      console.error('APIエラー:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, checkLoginStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
