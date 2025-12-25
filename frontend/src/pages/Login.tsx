import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../lib/axios';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // すでにログイン済みの場合はホームページへリダイレクト
  const [loginTrigger, setLoginTrigger] = useState(false);

  useEffect(() => {
    const login = async () => {
      if (!loginTrigger) return;
      setError('');
      try {
        const response = await apiClient.post('/login', {
          email,
          password,
        });
        setUser({
          uuid: response.data.uuid,
          name: response.data.name,
          email: response.data.email,
        });
        console.log('User updated:', response.data);
        navigate('/mypage/' + response.data.uuid);
      } catch {
        setError(
          'ログインに失敗しました。メールアドレスとパスワードを確認してください。'
        );
      } finally {
        setLoginTrigger(false);
      }
    };
    login();
  }, [loginTrigger, email, password, user, navigate, setUser]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoginTrigger(true);
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        アカウントをお持ちでないですか？ <Link to="/register">新規登録</Link>
      </p>
    </div>
  );
}

export default Login;
