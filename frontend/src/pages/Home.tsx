import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogoutButton } from '../components/LogoutButton';

function Home() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Home Page</h1>
      {user ? (
        <div>
          <p>ようこそ, {user.name}さん！</p>
          <Link to={`/mypage/${user.uuid}`}>マイページへ</Link>
          <LogoutButton />
        </div>
      ) : (
        <div>
          <p>ログインしていません。</p>
          <Link to="/login">ログインページへ</Link>
        </div>
      )}
    </div>
  );
}

export default Home;
