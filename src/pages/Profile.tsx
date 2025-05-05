
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Account } from '@/types';

interface ProfileProps {
  account?: Account;
}

const Profile: React.FC<ProfileProps> = ({ account }) => {
  return (
    <Layout account={account}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <p>This is the profile page. Content coming soon.</p>
      </div>
    </Layout>
  );
};

export default Profile;
