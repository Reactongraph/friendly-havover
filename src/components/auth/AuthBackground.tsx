
import React from 'react';

const AuthBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated particles */}
      <div className="absolute top-0 left-0 w-full h-full">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              backgroundColor: `hsl(${260 + Math.random() * 60}, 80%, 70%)`,
              animation: `float ${Math.random() * 10 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main background gradients - no longer following mouse */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Purple main gradient - stationary now */}
        <div 
          className="absolute w-[100%] h-[100%] bg-purple-600/50 rounded-full blur-[120px] animate-pulse"
          style={{
            animationDuration: '20s',
          }}
        />
        
        {/* Supporting gradients */}
        <div className="absolute top-0 right-0 w-[80%] h-[60%] bg-indigo-600/40 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '25s', animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-0 w-[70%] h-[60%] bg-fuchsia-600/40 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '22s', animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-[40%] h-[40%] bg-violet-500/30 rounded-full blur-[80px] animate-pulse" style={{animationDuration: '18s', animationDelay: '1.5s'}}></div>
        
        {/* Accent colors */}
        <div className="absolute top-[30%] right-[20%] w-[15%] h-[15%] bg-cyan-400/30 rounded-full blur-[50px] animate-pulse" style={{animationDuration: '15s', animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-[20%] right-[30%] w-[20%] h-[20%] bg-pink-400/30 rounded-full blur-[70px] animate-pulse" style={{animationDuration: '17s', animationDelay: '3.5s'}}></div>
      </div>

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-indigo-900/20"></div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          mask: 'linear-gradient(to bottom, transparent, black)'
        }}></div>
      </div>
    </div>
  );
};

export default AuthBackground;
