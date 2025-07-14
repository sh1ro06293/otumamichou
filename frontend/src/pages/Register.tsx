import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../lib/axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // バックエンドの /register エンドポイントにPOSTリクエストを送信
      await apiClient.post('/register', { name, email, password });

      // 成功したらアラートを表示し、ログインページへリダイレクト
      alert('登録が完了しました。ログインしてください。');
      navigate('/login');
    } catch (err: any) {
      // エラーハンドリング (例: メールアドレスが既に使われている場合など)
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('登録に失敗しました。入力内容を確認してください。');
      }
      console.error(err);
    }
  };

  return (
    <div>
      <h1>新規登録</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">ユーザー名:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">メールアドレス:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">登録する</button>
      </form>
      <p>
        アカウントをお持ちですか？ <Link to="/login">ログイン</Link>
      </p>
    </div>
  );
}

export default Register;
