
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "당신의 답변에서 핵심 가치를 추출하고 있습니다...",
  "리더로서의 열정을 한 문장으로 빚어내고 있습니다...",
  "팀원들이 믿고 따를 수 있는 비전을 설계 중입니다...",
  "당신만의 고유한 리더십 철학을 다듬고 있습니다...",
  "거의 다 되었습니다. 가슴 뛰는 순간을 준비하세요!"
];

const LoadingScreen: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center animate-fade-in">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-electricindigo/20 border-t-electricindigo rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fa-solid fa-wand-magic-sparkles text-electricindigo text-2xl animate-pulse"></i>
        </div>
      </div>
      
      <div className="space-y-4 h-24 px-4">
        <h3 className="text-2xl font-black text-white tracking-tight break-keep">
          당신의 리더십 비전을 <span className="text-electricindigo">조각하는 중</span>입니다
        </h3>
        <p className="text-slate-400 font-medium animate-pulse transition-all duration-500 break-keep">
          {MESSAGES[msgIndex]}
        </p>
      </div>
      
      <div className="max-w-xs w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <div className="h-full bg-electricindigo animate-[loading_8s_ease-in-out_infinite] shadow-[0_0_15px_rgba(124,58,237,0.5)]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
