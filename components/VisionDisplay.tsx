
import React, { useState, useEffect } from 'react';
import { VisionResult } from '../types';
import { toPng } from 'html-to-image';

interface VisionDisplayProps {
  vision: VisionResult;
  onRestart: () => void;
}

type EditableField = 'mainTitle' | 'description' | 'selfMessage';

const VisionDisplay: React.FC<VisionDisplayProps> = ({ vision, onRestart }) => {
  const [localVision, setLocalVision] = useState<VisionResult>(vision);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vision) {
      setLocalVision(vision);
    }
  }, [vision]);

  useEffect(() => {
    if (editingField) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [editingField]);

  const getShareText = () => {
    return `[나의 2026 리더십 비전]\n\n👤 리더: ${localVision.userName || '신임 리더'}\n✨ 비전: "${localVision.mainTitle}"\n\n💬 ${localVision.description}\n\n📍 나의 다짐: "${localVision.selfMessage}"\n\n#리더십 #비전 #2026Vision #새로운출발`;
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    
    setIsCapturing(true);
    try {
      // Small delay to ensure any hover states or transitions are settled
      await new Promise(resolve => setTimeout(resolve, 300));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#101827',
        pixelRatio: 2, // Higher resolution
      });

      // On mobile, try to use the Share API for the actual image file
      if (navigator.share && navigator.canShare) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `vision-card-${localVision.userName || 'leader'}.png`, { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: '나의 리더십 비전 카드',
          });
          setIsCapturing(false);
          return;
        }
      }

      // Fallback: Standard Download
      const link = document.createElement('a');
      link.download = `vision-card-${localVision.userName || 'leader'}.png`;
      link.href = dataUrl;
      link.click();
      
      alert("이미지 저장이 시작되었습니다. 갤러리나 다운로드 폴더를 확인해 주세요.");
    } catch (err) {
      console.error('Image capture failed:', err);
      alert("이미지 저장 중 오류가 발생했습니다. 스크린샷 기능을 이용해 주세요.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCopy = async () => {
    try {
      const text = getShareText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        alert("비전 문구가 복사되었습니다.");
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = getShareText();
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert("비전 문구가 복사되었습니다.");
      } catch (copyErr) {
        alert("복사에 실패했습니다. 문구를 직접 드래그하여 복사해 주세요.");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShare = async () => {
    const text = getShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "나의 리더십 비전",
          text: text,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const openEdit = (field: EditableField, e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setEditingField(field);
    setTempValue(localVision[field] || "");
  };

  const saveEdit = () => {
    if (editingField) {
      setLocalVision(prev => ({ ...prev, [editingField]: tempValue }));
      setEditingField(null);
    }
  };

  const closeEdit = () => setEditingField(null);

  if (!localVision) return null;

  return (
    <div className="w-full flex flex-col items-center gap-12 py-4 animate-fade-in relative">
      {/* Edit Modal Overlay */}
      {editingField && (
        <div 
          className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 md:p-6 bg-midnight/95 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && closeEdit()}
        >
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 space-y-6 animate-slide-up mt-10 md:mt-0">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">내용 수정하기</h4>
              <p className="text-white text-base md:text-lg font-bold">진심을 담아 문구를 다듬어보세요.</p>
            </div>
            
            <textarea
              autoFocus
              className="w-full min-h-[160px] md:min-h-[200px] p-5 md:p-6 text-slate-200 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl focus:border-indigo-500/50 focus:outline-none transition-all resize-none font-medium leading-relaxed text-sm md:text-base"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />

            <div className="flex gap-3">
              <button 
                onClick={closeEdit}
                className="flex-1 py-4 bg-white/5 text-slate-400 rounded-2xl font-bold hover:bg-white/10 transition-all text-sm"
              >
                취소
              </button>
              <button 
                onClick={saveEdit}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all text-sm"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-indigo-300/60 text-[10px] font-black tracking-widest uppercase mb-[-2rem] flex items-center gap-2">
        <i className="fa-solid fa-hand-pointer animate-bounce"></i>
        문구를 클릭하여 수정 / 아래 버튼으로 이미지 저장
      </p>

      {/* Vision Card to Capture */}
      <div 
        ref={cardRef}
        id="vision-card"
        className="relative w-full max-w-[360px] aspect-[9/16] bg-[#101827] rounded-[50px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col border-[8px] border-[#1F2937]"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-20%] w-[140%] h-[60%] bg-[#2D294E] rounded-full blur-[100px] opacity-70"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[90%] h-[50%] bg-[#7C3AED]/20 blur-[100px] rounded-full"></div>
          <div className="absolute top-[30%] left-[10%] w-[30%] h-[15%] bg-[#60A5FA]/10 blur-[60px] rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full p-10">
          <div className="flex justify-between items-center mb-12 opacity-40">
            <span className="text-[10px] text-white font-black tracking-[0.2em] uppercase">
              {localVision.userName || 'LEADER'} 2026 VSN
            </span>
            <i className="fa-solid fa-compass text-white text-[10px]"></i>
          </div>

          <div className="flex-grow flex flex-col justify-center space-y-8">
            <div className="w-12 h-1 bg-gradient-to-r from-celestial to-electricindigo rounded-full mb-2"></div>
            
            <h2 
              onClick={(e) => openEdit('mainTitle', e)}
              className="text-[28px] md:text-[30px] font-black text-white leading-[1.3] tracking-tight break-keep cursor-pointer hover:text-indigo-300 transition-colors group"
            >
              {localVision.mainTitle}
              {!isCapturing && <i className="fa-solid fa-pen text-[10px] ml-2 opacity-0 group-hover:opacity-50"></i>}
            </h2>
            
            <p 
              onClick={(e) => openEdit('description', e)}
              className="text-slate-300 text-[14px] leading-relaxed break-keep font-medium opacity-80 border-l-2 border-white/10 pl-6 cursor-pointer hover:border-indigo-500/50 hover:text-white transition-all group"
            >
              {localVision.description}
              {!isCapturing && <i className="fa-solid fa-pen text-[8px] ml-2 opacity-0 group-hover:opacity-50"></i>}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {(localVision.keywords || []).map((kw, i) => (
                <span key={i} className="text-[9px] text-celestial font-black uppercase tracking-widest border border-celestial/20 px-3 py-1.5 rounded-full bg-celestial/5">
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/5">
            <div 
              onClick={(e) => openEdit('selfMessage', e)}
              className="relative py-6 flex flex-col items-center cursor-pointer group"
            >
              <p className="text-white text-[16px] font-black italic leading-snug break-keep text-iridescent text-center px-6 relative z-10 drop-shadow-sm">
                "{localVision.selfMessage}"
              </p>
              {!isCapturing && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>}
            </div>
          </div>
          
          <div className="mt-8 flex justify-center opacity-10">
            <span className="text-[8px] text-white font-bold tracking-[0.5em] uppercase">Vision Crafting 2026</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="w-full max-w-[360px] flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 text-white rounded-[32px] font-black text-sm hover:bg-white/10 transition-all active:scale-95"
          >
            <i className="fa-solid fa-copy opacity-50"></i>
            텍스트 복사
          </button>
          <button 
            onClick={handleDownloadImage}
            disabled={isCapturing}
            className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 text-white rounded-[32px] font-black text-sm hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
          >
            {isCapturing ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : (
              <i className="fa-solid fa-image opacity-50"></i>
            )}
            이미지 저장
          </button>
        </div>

        <button 
          onClick={handleShare}
          className="flex items-center justify-center gap-3 py-5 bg-electricindigo text-white rounded-[32px] font-black text-sm shadow-2xl shadow-electricindigo/30 hover:bg-electricindigo/90 transition-all active:scale-95"
        >
          <i className="fa-solid fa-share-nodes"></i>
          비전 공유하기
        </button>

        <button
          onClick={onRestart}
          className="mt-6 py-4 text-slate-500 text-[10px] font-black tracking-widest uppercase hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-arrow-rotate-left"></i>
          새로 만들기
        </button>
      </div>

      <style>{`
        @media print {
          body { background: #101827 !important; color-adjust: exact; -webkit-print-color-adjust: exact; }
          #vision-card {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border: none;
            box-shadow: none;
            max-width: none;
            width: 375px;
            height: 667px;
          }
          header, footer, main > :not(#vision-card), p.text-indigo-300\/60, .w-full.max-w-\[360px\] { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default VisionDisplay;
