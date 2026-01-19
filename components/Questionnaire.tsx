
import React, { useState } from 'react';
import { Question, Answers } from '../types';

interface QuestionnaireProps {
  questions: Question[];
  onComplete: (answers: Answers) => void;
  error: string | null;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questions, onComplete, error }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Answers>({});
  const [inputValue, setInputValue] = useState("");

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (!inputValue.trim()) return;

    const updatedAnswers = {
      ...localAnswers,
      [currentQuestion.id]: inputValue
    };
    setLocalAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setInputValue(updatedAnswers[questions[currentIndex + 1].id] || "");
    } else {
      onComplete(updatedAnswers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setInputValue(localAnswers[questions[currentIndex - 1].id] || "");
    }
  };

  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/10 overflow-hidden animate-slide-up">
      <div className="bg-white/5 px-8 py-8 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <i className={`fa-solid ${currentQuestion.icon} text-lg`}></i>
          </div>
          <div>
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">{currentQuestion.category}</div>
            <div className="text-sm text-slate-500 font-bold">Step {currentIndex + 1} / {questions.length}</div>
          </div>
        </div>
        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-8 md:p-12 space-y-10">
        {error && (
          <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl text-sm border border-red-500/20 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black text-white leading-[1.3] break-keep">
            {currentQuestion.question}
          </h2>
          <textarea
            autoFocus
            className="w-full min-h-[200px] p-8 text-lg text-slate-200 bg-white/5 border-2 border-white/5 rounded-[30px] focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none transition-all placeholder:text-slate-600 resize-none font-medium"
            placeholder={currentQuestion.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all ${
              currentIndex === 0 ? 'text-slate-700 cursor-not-allowed opacity-0' : 'text-slate-500 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Prev
          </button>

          <button
            onClick={handleNext}
            disabled={!inputValue.trim()}
            className="px-12 py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3 group"
          >
            {isLast ? "완료하고 비전 확인" : "다음 질문"}
            {!isLast && <i className="fa-solid fa-chevron-right group-hover:translate-x-1 transition-transform opacity-50"></i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
