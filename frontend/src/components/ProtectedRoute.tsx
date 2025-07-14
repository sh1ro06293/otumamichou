import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, isLoading, checkLoginStatus } = useAuth();

  useEffect(() => {
    // このコンポーネントが表示されるたびに認証チェックを実行
    console.log('Checking login status...');
    checkLoginStatus();
  }, [checkLoginStatus]);

  // チェック中はローディング画面などを表示
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // チェック後、ユーザー情報があれば子要素（各ページ）を表示
  // なければトップページへリダイレクト
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
