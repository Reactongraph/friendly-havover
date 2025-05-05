
import React, { ReactNode } from 'react';
import Sidebar from '../sidebar/Sidebar';
import { Account } from '@/types';
import { mockAccount } from '@/data/mockData';

interface LayoutProps {
  children: ReactNode;
  account?: Account;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-60 h-screen">
        <main className="p-4 md:p-6 lg:p-8 h-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
