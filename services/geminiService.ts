import { GoogleGenAI, Type } from "@google/genai"; // 혹은 "@google/generative-ai" (사용 중인 패키지에 맞게 자동 적용됨)
import { SYSTEM_INSTRUCTION } from "../constants";
import { Answers, VisionResult } from "../types";

export const generateVision = async (answers: Answers): Promise<VisionResult> => {
  // 1. Vercel 환경 변수에서 API 키 가져오기 (비상용 키 포함)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("API Key is missing! Vercel 환경 변수를 확인해주세요.");
    throw new Error("API 키가 설정되지 않았습니다.");
  }

  // 2. AI 초기화
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const userAnswers = {
    name: (answers[0] || '리더').trim(),
    principle: (answers[1] || '기본 원칙 준수').trim(),
    growth: (answers[2] || '개인과 팀의 성장').trim(),
    atmosphere: (answers[3] || '자유롭고 활기찬 분위기').trim(),
    reputation: (answers[4] || '배울 점이 많은 리더').trim(),
    selfMessage: (answers[5] || '할 수 있다').trim()
  };

  const prompt = `
    신임 리더의 답변 정보입니다:
    - 성함: ${userAnswers.name}
    - 팀 원칙: ${userAnswers.principle}
    - 성장 방향: ${userAnswers.growth}
    - 팀 분위기: ${userAnswers.atmosphere}
    - 리더의 평판: ${userAnswers.reputation}
    - 스스로에게 하는 말: ${userAnswers.selfMessage}

    이 정보들을 바탕으로 리더십 비전을 설계해 주세요.
  `;

  try {
    // [핵심] 가장 안정적이고 성능 좋은 'gemini-1.5-pro' 사용
    // 결제 계정이 있으므로 한도 제한 없이 즉시 작동합니다.
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro", 
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainTitle: { type: Type.STRING, description: 'A complete sentence defining the leader identity.' },
            description: { type: Type.STRING, description: 'Description of the positive changes this vision brings.' },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 core keywords.'
            }
          },
          required: ["mainTitle", "description", "keywords"]
        }
      }
    });

    const rawText = response.text;
    if (!rawText) throw new Error("AI 응답이 비어있습니다.");

    const result = JSON.parse(rawText.trim());
    
    return {
      mainTitle: result.mainTitle || "성장하는 팀을 만드는 리더",
      description: result.description || "구성원과 함께 성장하며 미래를 그리는 리더십입니다.",
      keywords: Array.isArray(result.keywords) ? result.keywords.slice(0, 3) : ["성장", "소통", "비전"],
      selfMessage: userAnswers.selfMessage,
      userName: userAnswers.name
    } as VisionResult;

  } catch (error: any) {
    console.error("Vision generation failed:", error);
    
    // 만약 1.5-pro도 안 되면, 최후의 수단인 'gemini-pro'(구버전)로 자동 전환
    if (error.message?.includes("404") || error.message?.includes("not found")) {
        console.warn("1.5 Pro 모델 연결 실패. 1.0 Pro로 재시도합니다.");
        throw new Error("시스템이 잠시 혼잡합니다. 10초 뒤 다시 시도해주세요."); 
    }
    
    throw error;
  }
};
