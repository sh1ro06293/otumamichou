// src/pages/Mypage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../lib/axios';
import { LogoutButton } from '../components/LogoutButton';

function Mypage() {
  const { user, setUser } = useAuth();
  const { uuid } = useParams();
  const navigate = useNavigate();

  if (user && uuid && user.uuid.replace(/-/g, '') !== uuid.replace(/-/g, '')) {
    return <div>不正なアクセスです。</div>;
  }

  if (!user) {

    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <div>
        <h1>My Page</h1>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <LogoutButton />
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
