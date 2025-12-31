import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Button, Field, Input } from "@chakra-ui/react"
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
          <Field.Root required>
          <Field.Label>Email</Field.Label>
          <Input
            placeholder="Enter your email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          </Field.Root>
        </div>
        <div>
          <Field.Root required marginTop={5}>
          <Field.Label>Password</Field.Label>
          <Input
            placeholder="Enter your password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </Field.Root>
        </div>
        <Button type="submit" backgroundColor={"#666"} marginTop={3}>Login</Button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        アカウントをお持ちでないですか？ <Link to="/register">新規登録</Link>
      </p>
    </div>
  );
}

export default Login;
