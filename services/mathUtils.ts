
import { MathProblem } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Hàm xáo trộn mảng chuẩn
const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const SYNC_WORD_PROBLEMS = [
  { question: "Nhà Lan có 15 con gà, mẹ mua thêm 12 con gà nữa. Hỏi nhà Lan có tất cả bao nhiêu con gà?", answer: 27 },
  { question: "Bình có 45 viên bi, Bình cho Nam 15 viên bi. Hỏi Bình còn lại bao nhiêu viên bi?", answer: 30 },
  { question: "Lớp 2A có 18 bạn nam và 17 bạn nữ. Hỏi lớp 2A có tất cả bao nhiêu học sinh?", answer: 35 },
  { question: "Trong vườn có 32 cây cam và 28 cây bưởi. Hỏi trong vườn có tất cả bao nhiêu cây?", answer: 60 },
  { question: "Cuộn dây điện dài 95m, thợ điện đã dùng hết 40m. Hỏi cuộn dây điện còn lại bao nhiêu mét?", answer: 55 },
  { question: "Mai có 24 bông hoa, Hồng có nhiều hơn Mai 10 bông hoa. Hỏi Hồng có bao nhiêu bông hoa?", answer: 34 },
  { question: "Đàn vịt có 65 con, 25 con đang bơi dưới ao, số còn lại ở trên bờ. Hỏi có bao nhiêu con vịt trên bờ?", answer: 40 },
  { question: "Lan cao 96cm, Hoa thấp hơn Lan 5cm. Hỏi Hoa cao bao nhiêu xăng-ti-mét?", answer: 91 },
  { question: "Cửa hàng có 80 quyển vở, đã bán được 30 quyển. Hỏi cửa hàng còn lại bao nhiêu quyển vở?", answer: 50 },
  { question: "Hà có 30 viên kẹo, Hà cho em 12 viên. Hỏi Hà còn lại bao nhiêu viên kẹo?", answer: 18 }
];

export const generateLocalWordProblemSync = (): MathProblem => {
  const p = SYNC_WORD_PROBLEMS[getRandomInt(0, SYNC_WORD_PROBLEMS.length - 1)];
  return {
    id: generateId(),
    type: 'word',
    question: p.question,
    answer: p.answer,
    userAnswer: ''
  };
};

const SHAPES = {
  TRI: { id: 'tri', name: 'hình tam giác', d: "M 50 15 L 85 85 L 15 85 Z", color: '#3b82f6' },
  SQ: { id: 'sq', name: 'hình vuông', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z", color: '#10b981' },
  RECT: { id: 'rect', name: 'hình chữ nhật', d: "M 10 30 L 90 30 L 90 70 L 10 70 Z", color: '#f59e0b' },
  CIR: { id: 'cir', name: 'hình tròn', d: "M 50 50 m -35 0 a 35 35 0 1 0 70 0 a 35 35 0 1 0 -70 0", color: '#ef4444' },
  TRAP: { id: 'trap', name: 'hình thang', d: "M 30 25 L 70 25 L 90 75 L 10 75 Z", color: '#8b5cf6' },
  RHOM: { id: 'rhom', name: 'hình thoi', d: "M 50 10 L 85 50 L 50 90 L 15 50 Z", color: '#ec4899' }
};

const PUZZLE_TEMPLATES = [
  { name: "Ngôi nhà", sources: [SHAPES.TRI, SHAPES.SQ, SHAPES.RECT], targets: [{ id: 't1', type: 'tri', x: 50, y: 30, scale: 0.7, targetRot: 0 }, { id: 't2', type: 'sq', x: 50, y: 70, scale: 0.7, targetRot: 0 }, { id: 't3', type: 'rect', x: 50, y: 75, scale: 0.3, targetRot: 90 }] },
  { name: "Xe ô tô", sources: [SHAPES.TRAP, SHAPES.RECT, SHAPES.CIR, SHAPES.CIR], targets: [{ id: 't1', type: 'trap', x: 50, y: 35, scale: 0.5, targetRot: 0 }, { id: 't2', type: 'rect', x: 50, y: 65, scale: 0.8, targetRot: 0 }, { id: 't3', type: 'cir', x: 30, y: 85, scale: 0.2, targetRot: 0 }, { id: 't4', type: 'cir', x: 70, y: 85, scale: 0.2, targetRot: 0 }] },
  { name: "Doraemon", sources: [SHAPES.CIR, SHAPES.CIR, SHAPES.TRAP], targets: [{ id: 't1', type: 'cir', x: 50, y: 35, scale: 0.7, targetRot: 0 }, { id: 't2', type: 'cir', x: 50, y: 55, scale: 0.15, targetRot: 0 }, { id: 't3', type: 'trap', x: 50, y: 75, scale: 0.5, targetRot: 0 }] },
  { name: "Cá vàng", sources: [SHAPES.RHOM, SHAPES.TRI], targets: [{ id: 't1', type: 'rhom', x: 45, y: 50, scale: 0.7, targetRot: 90 }, { id: 't2', type: 'tri', x: 80, y: 50, scale: 0.4, targetRot: 90 }] }
];

export const generateIdentifyShapesProblem = (): MathProblem => {
  const shapeKeys = Object.keys(SHAPES);
  const targetKey = shapeKeys[getRandomInt(0, shapeKeys.length - 1)] as keyof typeof SHAPES;
  const target = SHAPES[targetKey];
  const selectedShapes: any[] = [];
  const targetCount = getRandomInt(2, 3);
  for (let i = 0; i < targetCount; i++) {
    selectedShapes.push({ id: generateId(), type: target.id, d: target.d, color: target.color });
  }
  const otherKeys = shapeKeys.filter(k => k !== targetKey);
  while (selectedShapes.length < 8) {
    const randomKey = otherKeys[getRandomInt(0, otherKeys.length - 1)] as keyof typeof SHAPES;
    const s = SHAPES[randomKey];
    selectedShapes.push({ id: generateId(), type: s.id, d: s.d, color: s.color });
  }
  const shuffledShapes = selectedShapes.sort(() => Math.random() - 0.5).map((s, index) => ({ ...s, num: index + 1 }));
  return { id: generateId(), type: 'geometry', visualType: 'identify_shape', question: `Bé hãy chỉ ra các mảnh bìa là ${target.name} nhé:`, visualData: { targetId: target.id, shapes: shuffledShapes }, answer: 0, userAnswer: '[]' };
};

export const generateGeometryProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const types = shuffleArray(['path_length', 'identify_shape', 'path_length', 'identify_shape', 'path_length', 'identify_shape']);
  
  for (let i = 0; i < count; i++) {
    const currentType = types[i % types.length];
    if (currentType === 'path_length') {
      const numSegments = getRandomInt(3, 4);
      const labels = "ABCDE";
      const pathLabel = labels.substring(0, numSegments + 1);
      const segments = [];
      let total = 0;
      for (let j = 0; j < numSegments; j++) {
        const len = getRandomInt(5, 20);
        segments.push({ label: labels[j] + labels[j+1], length: len });
        total += len;
      }
      problems.push({ id: generateId(), type: 'geometry', visualType: 'path_length', question: `Độ dài đường gấp khúc ${pathLabel} là:`, visualData: segments, answer: total, unit: 'cm' });
    } else {
      problems.push(generateIdentifyShapesProblem());
    }
  }
  return problems;
};

export const generateMeasurementProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const types = shuffleArray(['balance', 'spring', 'beaker', 'calc', 'balance', 'spring', 'beaker', 'calc']);
  for (let i = 0; i < count; i++) {
    const visualType = types[i % types.length] as any;
    if (visualType === 'balance') {
      const w1 = getRandomInt(1, 5);
      const w2 = Math.random() > 0.5 ? getRandomInt(1, 2) : 0;
      problems.push({ id: generateId(), type: 'measurement', visualType: 'balance', unit: 'kg', visualData: w2 > 0 ? [w1, w2] : [w1], answer: w1 + w2 });
    } else if (visualType === 'spring') {
      const weight = getRandomInt(1, 10);
      problems.push({ id: generateId(), type: 'measurement', visualType: 'spring', unit: 'kg', visualData: weight, answer: weight });
    } else if (visualType === 'beaker') {
      const liters = getRandomInt(1, 10);
      problems.push({ id: generateId(), type: 'measurement', visualType: 'beaker', unit: 'l', visualData: liters, answer: liters });
    } else {
      const unit = Math.random() > 0.5 ? 'kg' : 'l';
      const a = getRandomInt(10, 40), b = getRandomInt(5, 20);
      problems.push({ id: generateId(), type: 'measurement', unit, numbers: [a, b], operators: ['+'], answer: a + b });
    }
  }
  return problems;
};

export const generateVerticalProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    let a = getRandomInt(10, 89), b = getRandomInt(1, 9), op = Math.random() > 0.5 ? '+' : '-';
    problems.push({ id: generateId(), type: 'vertical', numbers: [a, b], operators: [op], answer: op === '+' ? a + b : a - b });
  }
  return problems;
};

export const generateComparisonProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const opLeft = Math.random() > 0.5 ? '+' : '-';
    let n1Left, n2Left, resLeft;
    if (opLeft === '+') { n1Left = getRandomInt(10, 40); n2Left = getRandomInt(5, 30); resLeft = n1Left + n2Left; }
    else { n1Left = getRandomInt(40, 80); n2Left = getRandomInt(5, 30); resLeft = n1Left - n2Left; }
    const opRight = Math.random() > 0.5 ? '+' : '-';
    let n1Right, n2Right, resRight;
    if (opRight === '+') { n1Right = getRandomInt(10, 40); n2Right = getRandomInt(5, 30); resRight = n1Right + n2Right; }
    else { n1Right = getRandomInt(40, 80); n2Right = getRandomInt(5, 30); resRight = n1Right - n2Right; }
    if (Math.random() > 0.7) {
      if (opRight === '+') { n1Right = Math.max(5, resLeft - getRandomInt(2, 20)); n2Right = resLeft - n1Right; resRight = n1Right + n2Right; }
      else { n1Right = resLeft + getRandomInt(5, 15); n2Right = n1Right - resLeft; resRight = n1Right - n2Right; }
    }
    const answer = resLeft > resRight ? '>' : (resLeft < resRight ? '<' : '=');
    problems.push({ id: generateId(), type: 'comparison', visualType: 'compare_expr', numbers: [n1Left, n2Left, n1Right, n2Right], operators: [opLeft, opRight], answer: answer, question: "Điền dấu >, < hoặc = vào ô trống:" });
  }
  return problems;
};

export const generateFillBlankProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const op = Math.random() > 0.5 ? '+' : '-';
    let a, b, res;
    if (op === '+') { a = getRandomInt(10, 60); b = getRandomInt(10, 30); res = a + b; }
    else { a = getRandomInt(40, 90); b = getRandomInt(10, 30); res = a - b; }
    const hideIndex = getRandomInt(0, 2);
    const correctAns = hideIndex === 0 ? a : (hideIndex === 1 ? b : res);
    problems.push({ id: generateId(), type: 'fill_blank', numbers: [a, b], operators: [op], answer: correctAns, options: [hideIndex] });
  }
  return problems;
};

export const generateDmProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const op = Math.random() > 0.5 ? '+' : '-';
    let n1 = getRandomInt(10, 40), n2 = op === '+' ? getRandomInt(5, 30) : getRandomInt(1, n1 - 5), ans = op === '+' ? n1 + n2 : n1 - n2;
    problems.push({ id: generateId(), type: 'measurement', visualType: 'calc', numbers: [n1, n2], operators: [op], answer: ans, unit: 'dm', question: `${n1} dm ${op} ${n2} dm = ? dm` });
  }
  return problems;
};

export const generatePatternProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const shapeTypes = [{ id: 'triangle', name: 'hình tam giác', d: "M 50 15 L 85 85 L 15 85 Z", color: '#4ade80' }, { id: 'circle', name: 'hình tròn', d: "M 50 50 m -35 0 a 35 35 0 1 0 70 0 a 35 35 0 1 0 -70 0", color: '#facc15' }, { id: 'square', name: 'hình vuông', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z", color: '#f87171' }];
  for (let p = 0; p < count; p++) {
    const pool = [...shapeTypes].sort(() => Math.random() - 0.5);
    const grid = [[pool[0], pool[1], pool[2]], [pool[1], pool[2], pool[0]], [pool[2], pool[0], pool[1]]];
    const r = getRandomInt(0, 2), c = getRandomInt(0, 2);
    problems.push({ id: generateId(), type: 'pattern', question: "Tìm hình còn thiếu trong ô trống:", visualData: { grid, hiddenCells: [{ r, c, target: grid[r][c].id }], options: pool }, answer: [{ r, c, target: grid[r][c].id }] });
  }
  return problems;
};

export const generateMixedProblems = (count: number): MathProblem[] => {
  const firstProblem = generateLocalWordProblemSync();
  const otherGenerators = [
    () => generateVerticalProblems(1)[0],
    () => generateComparisonProblems(1)[0],
    () => generateMeasurementProblems(1)[0],
    () => generateDmProblems(1)[0],
    () => generatePatternProblems(1)[0],
    () => generateFillBlankProblems(1)[0],
    () => generateExpressionProblems(1)[0],
    () => generateGeometryProblems(1)[0],
    () => generateChallengeProblem()
  ];
  const shuffledOthers = shuffleArray(otherGenerators);
  const result: MathProblem[] = [firstProblem];
  for (let i = 0; i < Math.min(count - 1, shuffledOthers.length); i++) {
    result.push(shuffledOthers[i]());
  }
  return result;
};

export const generateExpressionProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    let n1 = getRandomInt(10, 40), n2 = getRandomInt(10, 30), n3 = getRandomInt(5, 10);
    problems.push({ id: generateId(), type: 'expression', numbers: [n1, n2, n3], operators: ['+', '+'], answer: n1 + n2 + n3 });
  }
  return problems;
};

export const generateMatchingGameData = (count: number) => {
  const birds: MathProblem[] = [];
  for(let i=0; i < count; i++) { 
    let n1 = getRandomInt(10, 30), n2 = getRandomInt(5, 15), n3 = getRandomInt(5, 15), ans = n1 + n2 + n3;
    birds.push({ id: generateId(), type: 'expression', numbers: [n1, n2, n3], operators: ['+', '+'], answer: ans }); 
  }
  return { birds, houses: birds.map(p => ({ id: p.id, value: p.answer })).sort(() => Math.random() - 0.5) };
};

export const generateFind100Problems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const isTarget = Math.random() > 0.4;
    let a = getRandomInt(10, 90), b = isTarget ? 100 - a : getRandomInt(10, 90);
    if (!isTarget && a + b === 100) b += 5;
    problems.push({ id: generateId(), type: 'find100', numbers: [a, b], answer: 100, isCorrect: a + b === 100 });
  }
  return problems;
};

export const generatePuzzleProblem = (): MathProblem => {
  const template = PUZZLE_TEMPLATES[getRandomInt(0, PUZZLE_TEMPLATES.length - 1)];
  return { id: generateId(), type: 'puzzle', visualType: 'puzzle_logic', answer: template.targets, visualData: { templateName: template.name, sourceShapes: template.sources.map((s, idx) => ({ ...s, instanceId: `${s.id}-${idx}-${generateId()}` })), gridPieces: template.targets, allShapes: SHAPES } };
};

export const generateChallengeProblem = (): MathProblem => {
  const CHALLENGE_TEMPLATES = [
    { question: "Mảnh nào còn thiếu để tạo thành hình tròn?", ans: "1", base: "M 50 50 m -40 0 a 40 40 0 1 1 80 0 L 50 50 Z", opts: [{ id: "1", d: "M 50 10 a 40 40 0 0 1 40 40 L 50 50 Z", col: "#ef4444" }, { id: "2", d: "M 10 10 L 90 10 L 50 90 Z", col: "#3b82f6" }, { id: "3", d: "M 10 10 L 90 90 L 10 90 Z", col: "#10b981" }] },
    { question: "Mảnh nào khớp với ngôi sao?", ans: "2", base: "M 50 10 L 58 35 L 85 35 L 63 50 L 72 75 L 50 60 Z", opts: [{ id: "1", d: "M 10 10 L 90 10 L 90 90 L 10 90 Z", col: "#facc15" }, { id: "2", d: "M 50 60 L 28 75 L 37 50 L 15 35 L 42 35 Z", col: "#facc15" }, { id: "3", d: "M 50 10 a 40 40 0 1 1 0 80", col: "#facc15" }] },
    { question: "Mảnh nào là mái của ngôi nhà?", ans: "1", base: "M 20 50 L 80 50 L 80 90 L 20 90 Z", opts: [{ id: "1", d: "M 20 50 L 50 15 L 80 50 Z", col: "#ef4444" }, { id: "2", d: "M 10 10 L 30 10 L 30 30 L 10 30 Z", col: "#3b82f6" }, { id: "3", d: "M 50 50 m -10 0 a 10 10 0 1 0 20 0", col: "#10b981" }] },
    { question: "Mảnh nào là cánh buồm của con thuyền?", ans: "3", base: "M 10 70 L 90 70 L 75 90 L 25 90 Z", opts: [{ id: "1", d: "M 10 10 L 40 10 L 40 40 Z", col: "#facc15" }, { id: "2", d: "M 10 10 L 90 10 L 90 90 Z", col: "#facc15" }, { id: "3", d: "M 50 15 L 50 70 L 85 70 Z", col: "#3b82f6" }] },
    { question: "Mảnh nào là mũi của tên lửa?", ans: "2", base: "M 35 40 L 65 40 L 65 90 L 35 90 Z", opts: [{ id: "1", d: "M 10 10 L 90 10 L 50 90 Z", col: "#ef4444" }, { id: "2", d: "M 35 40 L 50 10 L 65 40 Z", col: "#ef4444" }, { id: "3", d: "M 10 10 L 30 30 L 10 30 Z", col: "#ef4444" }] },
    { question: "Mảnh nào là đuôi của chú cá?", ans: "1", base: "M 15 50 Q 45 15 75 50 Q 45 85 15 50 Z", opts: [{ id: "1", d: "M 15 50 L 5 35 L 5 65 Z", col: "#facc15" }, { id: "2", d: "M 10 10 L 30 10 L 30 30 Z", col: "#facc15" }, { id: "3", d: "M 50 50 m -5 0 a 5 5 0 1 0 10 0", col: "#facc15" }] },
    { question: "Mảnh nào là tán cây xanh?", ans: "3", base: "M 45 70 L 55 70 L 55 95 L 45 95 Z", opts: [{ id: "1", d: "M 10 10 L 90 10 L 50 90 Z", col: "#10b981" }, { id: "2", d: "M 20 20 L 80 20 L 80 80 Z", col: "#10b981" }, { id: "3", d: "M 50 15 Q 80 15 80 45 Q 80 75 50 70 Q 20 75 20 45 Q 20 15 50 15 Z", col: "#10b981" }] },
    { question: "Mảnh nào là nắp của phong bì?", ans: "1", base: "M 10 40 L 90 40 L 90 85 L 10 85 Z", opts: [{ id: "1", d: "M 10 40 L 50 70 L 90 40 Z", col: "#f59e0b" }, { id: "2", d: "M 10 10 L 90 10 L 50 30 Z", col: "#f59e0b" }, { id: "3", d: "M 10 10 L 30 10 L 20 30 Z", col: "#f59e0b" }] },
    { question: "Mảnh nào khớp với viên kim cương?", ans: "2", base: "M 50 90 L 15 50 L 85 50 Z", opts: [{ id: "1", d: "M 10 10 L 90 10 L 50 90 Z", col: "#8b5cf6" }, { id: "2", d: "M 15 50 L 50 10 L 85 50 Z", col: "#8b5cf6" }, { id: "3", d: "M 10 10 L 30 30 L 50 10 Z", col: "#8b5cf6" }] },
    { question: "Mảnh nào là bánh của xe tải?", ans: "3", base: "M 10 30 L 60 30 L 60 70 L 10 70 Z M 60 45 L 90 45 L 90 70 L 60 70 Z", opts: [{ id: "1", d: "M 10 10 L 30 10 L 30 30 Z", col: "#1e293b" }, { id: "2", d: "M 20 20 L 40 20 L 40 40 L 20 40 Z", col: "#1e293b" }, { id: "3", d: "M 30 80 m -10 0 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0", col: "#1e293b" }] },
    { question: "Mảnh nào hoàn thiện hình trái tim?", ans: "1", base: "M 50 90 Q 50 90 10 50 Q 10 20 30 20 Q 50 20 50 40 Z", opts: [{ id: "1", d: "M 50 40 Q 50 20 70 20 Q 90 20 90 50 Q 50 90 50 90 Z", col: "#ef4444" }, { id: "2", d: "M 10 10 Q 50 50 90 10 Z", col: "#ef4444" }, { id: "3", d: "M 50 50 m -20 0 a 20 20 0 1 0 40 0", col: "#ef4444" }] },
    { question: "Mảnh nào là cánh của chú bướm?", ans: "2", base: "M 48 30 L 52 30 L 52 70 L 48 70 Z", opts: [{ id: "1", d: "M 10 10 L 40 40 L 10 70 Z", col: "#ec4899" }, { id: "2", d: "M 52 30 Q 90 10 90 50 Q 90 90 52 70 Z", col: "#ec4899" }, { id: "3", d: "M 10 10 L 30 10 L 30 30 Z", col: "#ec4899" }] },
    { question: "Mảnh nào là chóp của cây kem?", ans: "1", base: "M 35 45 L 65 45 L 50 95 Z", opts: [{ id: "1", d: "M 50 10 a 18 18 0 1 1 0 36 a 18 18 0 1 1 0 -36", col: "#facc15" }, { id: "2", d: "M 10 10 L 90 10 L 50 30 Z", col: "#facc15" }, { id: "3", d: "M 10 10 L 30 30 L 10 30 Z", col: "#facc15" }] },
    { question: "Mảnh nào là đầu của mũi tên?", ans: "3", base: "M 15 45 L 65 45 L 65 55 L 15 55 Z", opts: [{ id: "1", d: "M 10 10 L 40 40 L 10 70 Z", col: "#3b82f6" }, { id: "2", d: "M 10 10 L 30 10 L 20 30 Z", col: "#3b82f6" }, { id: "3", d: "M 65 30 L 95 50 L 65 70 Z", col: "#3b82f6" }] },
    { question: "Mảnh nào là lá của bông hoa?", ans: "2", base: "M 50 40 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 M 48 55 L 52 55 L 52 95 L 48 95 Z", opts: [{ id: "1", d: "M 10 10 L 30 10 L 20 30 Z", col: "#10b981" }, { id: "2", d: "M 52 70 Q 80 60 80 85 Q 80 110 52 75 Z", col: "#10b981" }, { id: "3", d: "M 10 10 L 20 20 L 10 30 Z", col: "#10b981" }] },
    { question: "Mảnh nào hoàn thiện nửa hình thoi?", ans: "1", base: "M 50 10 L 85 50 L 15 50 Z", opts: [{ id: "1", d: "M 15 50 L 50 90 L 85 50 Z", col: "#ec4899" }, { id: "2", d: "M 10 10 L 90 10 L 50 90 Z", col: "#ec4899" }, { id: "3", d: "M 10 10 L 30 10 L 20 30 Z", col: "#ec4899" }] },
    { question: "Mảnh nào là cờ trên đỉnh núi?", ans: "3", base: "M 10 90 L 50 20 L 90 90 Z", opts: [{ id: "1", d: "M 10 10 L 30 10 L 20 20 Z", col: "#ef4444" }, { id: "2", d: "M 50 10 L 70 10 L 60 20 Z", col: "#ef4444" }, { id: "3", d: "M 50 5 L 50 20 L 75 12 Z", col: "#ef4444" }] }
  ];
  const template = CHALLENGE_TEMPLATES[getRandomInt(0, CHALLENGE_TEMPLATES.length - 1)];
  return { id: generateId(), type: 'challenge', visualType: 'puzzle_logic', question: template.question, answer: template.ans, visualData: { sourceShapes: [{ id: 'base', d: template.base, color: '#f3f4f6' }], options: template.opts.map((o, idx) => ({ id: o.id, label: String.fromCharCode(65 + idx), name: `Mảnh ${String.fromCharCode(65 + idx)}`, d: o.d, color: o.col })) } };
};
