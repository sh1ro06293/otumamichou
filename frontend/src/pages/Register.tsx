import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../lib/axios';
import { Button, Field, Input, Text } from "@chakra-ui/react"

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
      // alert('登録が完了しました。ログインしてください。');
      navigate('/');
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
      <Text textStyle="6xl"> 新規登録</Text> 
      <form onSubmit={handleSubmit}>
        <div>
          <Field.Root required marginTop={3}>
          <Field.Label>ユーザー名</Field.Label>
          <Input
            marginTop={1}
            placeholder="Enter your name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          </Field.Root>
        </div>
        <div>
          <Field.Root required marginTop={3}>
          <Field.Label>メールアドレス</Field.Label>
          <Input
            marginTop={1}
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
          <Field.Root required marginTop={3}>
          <Field.Label>パスワード</Field.Label>
          <Input
            marginTop={1}
            placeholder="Enter your password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </Field.Root>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      
        <Button type="submit"backgroundColor={"#666"} marginTop={5}>登録する</Button>
      </form>
      <Text textStyle="md" marginTop={4}>
        アカウントをお持ちですか？ <Link to="/login">ログイン</Link>
      </Text>
    </div>
  );
}

export default Register;
