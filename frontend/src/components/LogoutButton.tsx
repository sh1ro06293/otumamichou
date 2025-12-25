// src/components/LogoutButton.tsx

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../lib/axios';

export const LogoutButton = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/logout');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};