import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem } from "../types";

const generateId = () => Math.random().toString(36).substr(2, 9);

const FALLBACK_PROBLEMS: MathProblem[] = [
  {
    id: 'fb1',
    type: 'word',
    question: "Lan có 50 cái kẹo. Lan ăn hết 20 cái. Hỏi Lan còn lại bao nhiêu cái kẹo?",
    answer: 30,
    numbers: [50, 20],
    operators: ['-']
  },
  {
    id: 'fb2',
    type: 'word',
    question: "Nam có 15 viên bi, Hùng cho Nam thêm 10 viên bi nữa. Hỏi Nam có tất cả bao nhiêu viên bi?",
    answer: 25,
    numbers: [15, 10],
    operators: ['+']
  },
  {
    id: 'fb3',
    type: 'word',
    question: "Trên cây có 68 con chim. Có 23 con bay đi mất. Hỏi trên cây còn lại bao nhiêu con chim?",
    answer: 45,
    numbers: [68, 23],
    operators: ['-']
  }
];

export const generateWordProblem = async (): Promise<MathProblem> => {
  // Use a safer way to access the API key to prevent crashes in browser
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';

  if (!apiKey) {
    console.warn("API_KEY not found or empty. Using fallback problems.");
    const randomProblem = FALLBACK_PROBLEMS[Math.floor(Math.random() * FALLBACK_PROBLEMS.length)];
    return { ...randomProblem, id: generateId() };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a math word problem for a 2nd grade student in Vietnamese. Constraints: 1. Addition (+) or Subtraction (-). 2. Numbers must be integers. 3. Subtraction: first number > second number. 4. All numbers and result <= 100. Contexts: candies, birds, toys, school items.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "The word problem text in Vietnamese" },
            answer: { type: Type.INTEGER, description: "The numeric answer" },
            operation: { type: Type.STRING, description: "The operation used (+ or -)"},
            numbers: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "The numbers extracted from text" }
          },
          required: ["question", "answer"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const data = JSON.parse(text);
    
    if (data.answer < 0 || data.answer > 100) {
        throw new Error("Generated problem out of grade 2 range");
    }

    return {
      id: generateId(),
      type: 'word',
      question: data.question,
      answer: data.answer,
      numbers: data.numbers || [],
      operators: [data.operation || '+']
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    const randomProblem = FALLBACK_PROBLEMS[Math.floor(Math.random() * FALLBACK_PROBLEMS.length)];
    return { ...randomProblem, id: generateId() };
  }
};