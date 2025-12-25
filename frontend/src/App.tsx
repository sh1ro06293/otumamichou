import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Mypage from './pages/Mypage';
import Register from './pages/Register';
import Otsumami from './pages/Otsumami';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        {/* --- 認証が不要な公開ルート --- */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/register" element={<Register />} />

        {/* --- 認証が必要な保護されたルート --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/mypage/:uuid" element={<Mypage />} />
          <Route path="/otsumami" element={<Otsumami />} />
          {/* 他にも保護したいページがあればここに追加 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
