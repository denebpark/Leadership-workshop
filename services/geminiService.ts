import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Answers, VisionResult } from "../types";

export const generateVision = async (answers: Answers): Promise<VisionResult> => {
  // 1. Vercel 환경 변수에서 API 키 가져오기
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("API Key is missing! Check Vercel Environment Variables.");
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
    // [수정 핵심] 별명 대신 '주민등록상 본명(001)'을 사용합니다.
    // 결제 계정이 연결되어 있으므로 이 정식 버전을 안정적으로 쓸 수 있습니다.
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash-001", 
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
    if (!rawText) {
      throw new Error("AI로부터 응답을 받지 못했습니다.");
    }

    const result = JSON.parse(rawText.trim());
    
    return {
      mainTitle: result.mainTitle || "성장하는 팀을 만드는 조력자",
      description: result.description || "신뢰와 존중을 바탕으로 팀의 성장을 이끄는 리더십 비전입니다.",
      keywords: Array.isArray(result.keywords) ? result.keywords.slice(0, 3) : ["리더십", "성장", "신뢰"],
      selfMessage: userAnswers.selfMessage,
      userName: userAnswers.name
    } as VisionResult;

  } catch (error: any) {
    console.error("Vision generation failed details:", error);
    
    // 에러 메시지 처리
    if (error.message?.includes("429") || error.message?.includes("Quota")) {
        throw new Error("사용량이 많아 잠시 지연되고 있습니다. 잠시 후 다시 시도해 주세요.");
    }

    if (error.message?.includes("Safety")) {
      throw new Error("입력 내용 중 부적절한 표현이 포함되어 있을 수 있습니다. 내용을 수정해 주세요.");
    }
    
    throw error;
  }
};
