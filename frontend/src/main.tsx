import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. defaultSystem も一緒にインポートします
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import App from './App.tsx';
import { AuthProvider } from './components/AuthProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);