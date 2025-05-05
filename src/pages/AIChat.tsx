
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Account } from '@/types';

interface AIChatProps {
  account?: Account;
}

const AIChat: React.FC<AIChatProps> = ({ account }) => {
  return (
    <Layout account={account}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Concierge Chat</h1>
        <p>This is the AI concierge chat page. Content coming soon.</p>
      </div>
    </Layout>
  );
};

export default AIChat;
