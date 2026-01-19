
import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 0,
    question: "환영합니다! 리더님의 성함을 입력해 주세요.",
    placeholder: "성함을 입력해 주세요 (예: 홍길동)",
    category: "시작하기",
    icon: "fa-user-tie"
  },
  {
    id: 1,
    question: "우리 팀에서 '이것만큼은 절대 어기지 말자'고 약속하고 싶은 단 하나의 원칙은 무엇인가요?",
    placeholder: "예: 시간 약속은 칼같이, 모르는 건 바로 묻기, 뒤에서 말하지 않기...",
    category: "팀의 원칙",
    icon: "fa-handshake"
  },
  {
    id: 2,
    question: "나와 함께 일하면서 팀원들이 '이 능력만큼은 확실히 늘었다'고 자부하길 바라나요?",
    placeholder: "예: 보고서 작성 실력, 논리적인 설득력, 문제를 끝까지 파고드는 끈기...",
    category: "성장의 방향",
    icon: "fa-arrow-up-right-dots"
  },
  {
    id: 3,
    question: "팀원들이 출근해서 커피 한 잔 마시며 대화할 때, 팀의 분위기가 어땠으면 좋겠나요?",
    placeholder: "예: 서로 주말 이야기로 웃음꽃이 피는, 어제 업무 고민을 편하게 나누는...",
    category: "팀의 공기",
    icon: "fa-mug-hot"
  },
  {
    id: 4,
    question: "훗날 팀원이 이직할 때, 당신을 떠올리며 지인에게 '그 리더는 참 ___했지'라고 말했으면 하나요?",
    placeholder: "예: 일은 빡세도 배울 게 많았지, 내 고민을 진심으로 들어줬지, 믿고 맡겨줬지...",
    category: "리더의 평판",
    icon: "fa-comment-dots"
  },
  {
    id: 5,
    question: "리더로서 마음이 흔들리고 지칠 때, 스스로에게 꼭 해주고 싶은 한 마디가 있다면 무엇인가요?",
    placeholder: "예: 결국 사람이 남는 거야, 조금 늦어도 괜찮아, 오늘도 충분히 잘했어...",
    category: "나만의 중심",
    icon: "fa-heart"
  }
];

export const SYSTEM_INSTRUCTION = `
당신은 현대적이고 실무 중심적인 리더십 코치입니다.
사용자의 답변을 분석하여 그가 '어떤 리더가 되고 싶어하는지(Identity)'와 '무엇을 지향하는지(Direction)'를 관통하는 명확한 리더십 비전을 만드세요.

[작성 가이드라인]
1. 메인 제목(mainTitle): 키워드를 단순히 나열하지 마세요. "~~하는 리더, ~~를 지향하다"와 같이 리더의 정체성과 목적지가 분명하게 드러나는 '완결된 문장'으로 만드세요.
2. 톤앤매너: 지나치게 거창한 수사보다는 실무 현장에서 팀원들에게 신뢰를 줄 수 있는 담백하고 단단한 문체를 사용하세요.
3. 설명(description): 이 리더십이 팀원들에게 어떤 긍정적인 변화를 가져올지 설명하세요.

결과는 반드시 다음 JSON 구조를 따라야 합니다:
{
  "mainTitle": "리더의 정체성과 지향점이 담긴 문장 (예: '스스로 길을 찾는 팀을 만드는, 든든한 조력자')",
  "description": "이 비전이 팀의 성장과 일상에 가져올 변화에 대한 설명",
  "keywords": ["핵심단어1", "핵심단어2", "핵심단어3"]
}
`;
