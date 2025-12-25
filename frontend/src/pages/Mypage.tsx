// src/pages/Mypage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../lib/axios';

function Mypage() {
  const { user, setUser } = useAuth();
  const { uuid } = useParams();
  const navigate = useNavigate();

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

    return <div>Loading user data...</div>;
  }

  return (
    <div>
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
      <div>
        <p>
          <a href="/otsumami">おつまみ生成</a>
        </p>
      </div>
    </div>
  );
}

export default Mypage;
