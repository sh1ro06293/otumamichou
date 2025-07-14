// src/pages/Mypage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../lib/axios';

function Mypage() {
  const { user, setUser } = useAuth();
  const { uuid } = useParams();
  const navigate = useNavigate();

  // URLのuuidとログイン中のユーザーのuuidが一致しない場合は不正アクセスとみなす
  // ★★★ .trim() を使って前後の空白を削除してから比較 ★★★
  if (user && uuid && user.uuid.replace(/-/g, '') !== uuid.replace(/-/g, '')) {
    return <div>不正なアクセスです。</div>;
  }

  const handleLogout = async () => {
    try {
      await apiClient.post('/logout');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (!user) {
    // AuthProviderがロード中の場合や、何らかの理由でuserがnullの場合
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <h1>My Page</h1>
      <p>
        <strong>UUID:</strong> {user.uuid}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Mypage;
