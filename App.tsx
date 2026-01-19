
import React, { useState } from 'react';
import { QUESTIONS } from './constants';
import { Answers, VisionResult } from './types';
import { generateVision } from './services/geminiService';

// Components
import Header from './components/Header';
import Landing from './components/Landing';
import Questionnaire from './components/Questionnaire';
import VisionDisplay from './components/VisionDisplay';
import LoadingScreen from './components/LoadingScreen';

type AppState = 'landing' | 'questionnaire' | 'loading' | 'result';

const App: React.FC = () => {
  const [step, setStep] = useState<AppState>('landing');
  const [answers, setAnswers] = useState<Answers>({});
  const [vision, setVision] = useState<VisionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setStep('questionnaire');
    setError(null);
  };

  const handleSelectKeyFromError = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setError(null);
      } catch (e) {
        console.error("Failed to open key selector", e);
      }
    } else {
      alert("API 키 선택 기능을 사용할 수 없는 환경입니다.");
    }
  };

  const handleFinishQuestions = async (finalAnswers: Answers) => {
    setAnswers(finalAnswers);
    setStep('loading');
    setError(null);

    try {
      const result = await generateVision(finalAnswers);
      if (!result || !result.mainTitle) {
        throw new Error("비전 생성 결과가 유효하지 않습니다.");
      }
      setVision(result);
      setStep('result');
    } catch (err: any) {
      console.error("Application Error:", err);
      const msg = err.message || "서버와 통신 중 오류가 발생했습니다.";
      
      // "permission denied" 또는 "403" 에러 발생 시 키 선택 유도
      const isPermissionError = 
        msg.toLowerCase().includes("permission denied") || 
        msg.includes("403") || 
        msg.includes("Requested entity was not found");

      if (isPermissionError) {
        setError("API 권한이 없습니다. 유료 프로젝트의 API 키를 선택해 주세요.");
        setStep('questionnaire');
        // 자동으로 키 선택 창을 띄워줌으로써 사용자 불편 최소화
        handleSelectKeyFromError();
        return;
      }

      setError(msg);
      setStep('questionnaire');
    }
  };

  const handleRestart = () => {
    setStep('landing');
    setAnswers({});
    setVision(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-future-gradient selection:bg-electricindigo selection:text-white transition-colors duration-1000">
      <Header onLogoClick={handleRestart} />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electricindigo/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-celestial/5 blur-[150px] rounded-full"></div>
        </div>

        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          {step === 'landing' && <Landing onStart={handleStart} />}
          
          {step === 'questionnaire' && (
            <div className="w-full flex flex-col items-center gap-6">
              {error && (error.includes("권한") || error.includes("API") || error.toLowerCase().includes("permission")) && (
                <div className="w-full max-w-2xl p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-center space-y-4 animate-fade-in">
                  <div className="flex items-center justify-center gap-2 text-amber-400 font-bold mb-2">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>API 권한 설정이 필요합니다</span>
                  </div>
                  <p className="text-white/80 text-sm break-keep">
                    모바일 환경에서는 원활한 AI 작동을 위해 별도의 API 키 선택이 필요합니다.<br/> 
                    아래 버튼을 눌러 <strong>유료(Paid) 프로젝트</strong>의 키를 선택해 주세요.
                  </p>
                  <button 
                    onClick={handleSelectKeyFromError}
                    className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-black text-sm hover:bg-amber-500 transition-all flex items-center gap-3 mx-auto shadow-lg shadow-amber-900/20 active:scale-95"
                  >
                    <i className="fa-solid fa-key"></i>
                    API 키 선택하고 계속하기
                  </button>
                </div>
              )}
              <Questionnaire 
                questions={QUESTIONS} 
                onComplete={handleFinishQuestions} 
                error={(!error?.includes("권한") && !error?.toLowerCase().includes("permission")) ? error : null}
              />
            </div>
          )}
          
          {step === 'loading' && <LoadingScreen />}
          
          {step === 'result' && vision && (
            <VisionDisplay 
              vision={vision} 
              onRestart={handleRestart} 
            />
          )}

          {!vision && step === 'result' && (
             <div className="text-center p-10 bg-white/5 rounded-3xl border border-white/10 animate-fade-in">
                <p className="text-white mb-6 font-bold">결과를 불러오는 중 오류가 발생했습니다.</p>
                <p className="text-slate-400 text-sm mb-8">{error}</p>
                <div className="flex flex-col gap-3 items-center">
                  <button onClick={handleSelectKeyFromError} className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold shadow-xl shadow-amber-600/20 w-full max-w-xs">키 설정 후 다시 시도</button>
                  <button onClick={handleRestart} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 w-full max-w-xs">홈으로 돌아가기</button>
                </div>
             </div>
          )}
        </div>
      </main>

      <footer className="p-12 text-center text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase opacity-40">
        © 2026 Visioning For New Leaders. Powered by Digital Core.
      </footer>
    </div>
  );
};

export default App;
