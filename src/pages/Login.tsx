import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect to home if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <LoginForm />;
};

export default Login;