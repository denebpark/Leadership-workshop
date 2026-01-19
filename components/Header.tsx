
import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
        onClick={onLogoClick}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <i className="fa-solid fa-compass text-white text-lg"></i>
        </div>
        <h1 className="text-xl font-black text-white tracking-tight">
          LEADER'S <span className="text-indigo-400">VISION</span>
        </h1>
      </div>
      <div className="hidden md:block text-slate-400 text-xs font-bold tracking-widest uppercase opacity-60">
        Future Leadership Crafting
      </div>
    </header>
  );
};

export default Header;
