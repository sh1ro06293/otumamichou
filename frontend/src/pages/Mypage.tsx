// src/pages/Mypage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogoutButton } from '../components/LogoutButton';
import { Button } from '@chakra-ui/react';

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
          <strong>Name:</strong> {user.name} さん
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      <div>
        <Button colorScheme="teal" size="sm" marginTop={4} marginBottom={4} background={"#666"} onClick={() => navigate('/otsumami')}>
          おつまみ生成
        </Button>
      </div>
        <LogoutButton />
      </div>
    </div>
  );
}

export default Mypage;
