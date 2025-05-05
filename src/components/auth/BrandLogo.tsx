
import React from 'react';
import { Hotel } from 'lucide-react';

const BrandLogo: React.FC = () => {
  return (
    <div className="fixed top-6 left-6 flex items-center text-white z-10">
      <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 mr-2">
        <Hotel className="w-6 h-6 text-white/90" />
      </div>
      <div>
        <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200">
          Agentic Inn
        </h1>
        <p className="text-xs text-purple-200/70">AI collaboration hub</p>
      </div>
    </div>
  );
};

export default BrandLogo;
