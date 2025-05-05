
import React from 'react';

const SettingsHeader: React.FC = () => {
  return (
    <div className="mb-8 relative">
      <div className="absolute -top-14 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s', animationDuration: '7s' }} />
      
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Settings</h1>
      <p className="text-muted-foreground mt-2 text-lg">Manage your account settings and preferences</p>
    </div>
  );
};

export default SettingsHeader;
