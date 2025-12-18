
import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem } from "../types";

const generateId = () => Math.random().toString(36).substr(2, 9);

const LOCAL_WORD_PROBLEMS: MathProblem[] = [
  { id: 'l1', type: 'word', question: "Nhà An có 15 con gà, mẹ mua thêm 10 con gà nữa. Hỏi nhà An có tất cả bao nhiêu con gà?", answer: 25, numbers: [15, 10], operators: ['+'] },
  { id: 'l2', type: 'word', question: "Bình có 45 viên bi, Bình cho Nam 12 viên bi. Hỏi Bình còn lại bao nhiêu viên bi?", answer: 33, numbers: [45, 12], operators: ['-'] },
  { id: 'l3', type: 'word', question: "Trong vườn có 32 cây cam và 25 cây bưởi. Hỏi trong vườn có tất cả bao nhiêu cây?", answer: 57, numbers: [32, 25], operators: ['+'] },
  { id: 'l4', type: 'word', question: "Một xe bus chở 48 hành khách, đến điểm dừng có 15 người xuống xe. Hỏi trên xe còn bao nhiêu người?", answer: 33, numbers: [48, 15], operators: ['-'] },
  { id: 'l5', type: 'word', question: "Lan gấp được 24 con hạc, Hồng gấp được nhiều hơn Lan 10 con. Hỏi Hồng gấp được bao nhiêu con hạc?", answer: 34, numbers: [24, 10], operators: ['+'] },
  { id: 'l6', type: 'word', question: "Cửa hàng có 90 quyển vở, đã bán được 40 quyển. Hỏi cửa hàng còn lại bao nhiêu quyển vở?", answer: 50, numbers: [90, 40], operators: ['-'] },
  { id: 'l7', type: 'word', question: "Lớp 2A có 18 bạn nam và 17 bạn nữ. Hỏi lớp 2A có tất cả bao nhiêu học sinh?", answer: 35, numbers: [18, 17], operators: ['+'] },
  { id: 'l8', type: 'word', question: "Bố cao 175cm, con thấp hơn bố 50cm. Hỏi con cao bao nhiêu xăng-ti-mét?", answer: 125, numbers: [175, 50], operators: ['-'] },
  { id: 'l9', type: 'word', question: "Đàn vịt có 65 con, 20 con đang bơi dưới ao, số còn lại ở trên bờ. Hỏi có bao nhiêu con vịt trên bờ?", answer: 45, numbers: [65, 20], operators: ['-'] },
  { id: 'l10', type: 'word', question: "Mai có 30 bông hoa, Cúc có ít hơn Mai 5 bông hoa. Hỏi Cúc có bao nhiêu bông hoa?", answer: 25, numbers: [30, 5], operators: ['-'] }
];

export const generateWordProblem = async (forcedOperator?: '+' | '-'): Promise<MathProblem> => {
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';

  if (!apiKey) {
    return useLocalFallback(forcedOperator);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const opInstruction = forcedOperator 
      ? `MUST use the ${forcedOperator === '+' ? 'Addition (+)' : 'Subtraction (-)'} operation.`
      : "Use either Addition (+) or Subtraction (-).";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a math word problem for a 2nd grade student in Vietnamese. 
      Constraints: 1. ${opInstruction} 2. Numbers integer <= 100. 3. Engaging context.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.INTEGER },
            operation: { type: Type.STRING },
            numbers: { type: Type.ARRAY, items: { type: Type.INTEGER } }
          },
          required: ["question", "answer", "operation"],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: generateId(),
      type: 'word',
      question: data.question,
      answer: data.answer,
      numbers: data.numbers || [],
      operators: [data.operation || forcedOperator || '+']
    };
  } catch (error: any) {
    console.warn("API Error (likely 429), using local fallback.");
    return useLocalFallback(forcedOperator);
  }
};

function useLocalFallback(op?: string): MathProblem {
  let pool = LOCAL_WORD_PROBLEMS;
  if (op) pool = LOCAL_WORD_PROBLEMS.filter(p => p.operators?.[0] === op);
  if (pool.length === 0) pool = LOCAL_WORD_PROBLEMS;
  const p = pool[Math.floor(Math.random() * pool.length)];
  return { ...p, id: generateId() };
}
