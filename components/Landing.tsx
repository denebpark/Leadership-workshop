
import React, { useState, useEffect } from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [hasKey, setHasKey] = useState<boolean>(true);

  useEffect(() => {
    const checkKey = async () => {
      // aistudio is globally defined in the environment
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  return (
    <div className="max-w-xl w-full text-center space-y-12 animate-fade-in py-10">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-[0.3em] backdrop-blur-md">
            신임 리더를 위한 비전닝
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.2] tracking-tight">
          구성원과 함께 성장하는 <br />
          <span className="text-iridescent">단단한 리더십</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-sm mx-auto leading-relaxed break-keep font-medium">
          거창한 구호가 아닌, 당신의 진심이 담긴 실무형 리더십 비전을 디자인해 드립니다.
        </p>
      </div>

      {!hasKey && (
        <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl space-y-4 animate-pulse-slow">
          <p className="text-amber-200 text-sm font-bold break-keep">
            모바일 환경에서는 원활한 생성을 위해 <br/> API 키 선택이 필요할 수 있습니다.
          </p>
          <button
            onClick={handleSelectKey}
            className="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold text-xs hover:bg-amber-500 transition-all flex items-center gap-2 mx-auto"
          >
            <i className="fa-solid fa-key"></i>
            API 키 설정하기
          </button>
          <p className="text-[10px] text-amber-500/60">※ 유료 프로젝트의 API 키를 선택해 주세요.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 px-4">
        {[
          { icon: 'fa-wand-magic-sparkles', text: '일상적인 질문으로 편안하게' },
          { icon: 'fa-id-card', text: '나만의 정체성이 담긴 선언문' },
          { icon: 'fa-mobile-screen', text: '2026 트렌드 모바일 카드' }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center text-sm">
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <span className="text-slate-300 font-bold text-sm">{item.text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full py-6 bg-indigo-600 text-white rounded-[24px] font-black text-xl shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all active:scale-95 group relative overflow-hidden"
      >
        <span className="relative z-10">비전 만들기 시작</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <i className="fa-solid fa-arrow-right ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
      </button>

      <div className="pt-4">
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] text-slate-600 hover:text-slate-400 underline underline-offset-4 font-bold"
        >
          Billing & API Documentation
        </a>
      </div>
    </div>
  );
};

export default Landing;
