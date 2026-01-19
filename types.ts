
export interface Question {
  id: number;
  question: string;
  placeholder: string;
  category: string;
  icon: string;
}

export interface Answers {
  [key: number]: string;
}

export interface VisionResult {
  mainTitle: string;
  description: string;
  keywords: string[];
  selfMessage?: string; // 사용자가 직접 입력한 다짐 문구
  userName?: string;   // 사용자 이름
}
