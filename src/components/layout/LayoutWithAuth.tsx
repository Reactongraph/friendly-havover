
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';

interface LayoutWithAuthProps {
  children: React.ReactNode;
}

const LayoutWithAuth: React.FC<LayoutWithAuthProps> = ({ children }) => {
  const { user, isLoading, currentAccount } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default LayoutWithAuth;
