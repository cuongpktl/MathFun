
import { MathProblem } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Định nghĩa các loại hình học cơ bản
const SHAPE_TYPES = {
  TRIANGLE: { id: 'tri', name: 'Tam giác', d: "M 50 10 L 90 90 L 10 90 Z" },
  SQUARE: { id: 'sq', name: 'Vuông', d: "M 15 15 L 85 15 L 85 85 L 15 85 Z" },
  RECT: { id: 'rect', name: 'Chữ nhật', d: "M 10 30 L 90 30 L 90 70 L 10 70 Z" },
  CIRCLE: { id: 'cir', name: 'Tròn', d: "M 50 50 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0" }
};

const PUZZLE_TEMPLATES = [
  {
    name: "Thuyền buồm",
    sources: [
      { ...SHAPE_TYPES.TRIANGLE, color: '#3b82f6', instanceId: 's1' },
      { ...SHAPE_TYPES.RECT, color: '#f59e0b', instanceId: 's2' }
    ],
    targets: [
      { id: 't1', type: 'tri', requiredRot: 0, x: 40, y: 15, scale: 0.45, d: "M 40 15 L 60 15 L 50 55 Z" },
      { id: 't2', type: 'rect', requiredRot: 0, x: 25, y: 55, scale: 0.5, d: "M 25 55 L 75 55 L 65 85 L 35 85 Z" }
    ]
  },
  {
    name: "Ngôi nhà nhỏ",
    sources: [
      { ...SHAPE_TYPES.TRIANGLE, color: '#ef4444', instanceId: 's1' },
      { ...SHAPE_TYPES.SQUARE, color: '#10b981', instanceId: 's2' }
    ],
    targets: [
      { id: 't1', type: 'tri', requiredRot: 0, x: 30, y: 15, scale: 0.4, d: "M 30 15 L 70 15 L 50 50 Z" },
      { id: 't2', type: 'sq', requiredRot: 0, x: 30, y: 50, scale: 0.4, d: "M 30 50 L 70 50 L 70 90 L 30 90 Z" }
    ]
  },
  {
    name: "Tên lửa",
    sources: [
      { ...SHAPE_TYPES.TRIANGLE, color: '#ef4444', instanceId: 's1' },
      { ...SHAPE_TYPES.RECT, color: '#3b82f6', instanceId: 's2' },
      { ...SHAPE_TYPES.TRIANGLE, color: '#f59e0b', instanceId: 's3' }
    ],
    targets: [
      { id: 't1', type: 'tri', requiredRot: 0, x: 45, y: 5, scale: 0.1, d: "M 45 5 L 55 5 L 50 15 Z" },
      { id: 't2', type: 'rect', requiredRot: 90, x: 45, y: 15, scale: 0.4, d: "M 45 15 L 55 15 L 55 55 L 45 55 Z" },
      { id: 't3', type: 'tri', requiredRot: 180, x: 45, y: 55, scale: 0.1, d: "M 50 55 L 55 65 L 45 65 Z" }
    ]
  },
  {
    name: "Cây thông",
    sources: [
      { ...SHAPE_TYPES.TRIANGLE, color: '#16a34a', instanceId: 's1' },
      { ...SHAPE_TYPES.TRIANGLE, color: '#22c55e', instanceId: 's2' },
      { ...SHAPE_TYPES.RECT, color: '#713f12', instanceId: 's3' }
    ],
    targets: [
      { id: 't1', type: 'tri', requiredRot: 0, x: 40, y: 10, scale: 0.2, d: "M 40 10 L 60 10 L 50 35 Z" },
      { id: 't2', type: 'tri', requiredRot: 0, x: 35, y: 30, scale: 0.3, d: "M 35 30 L 65 30 L 50 65 Z" },
      { id: 't3', type: 'rect', requiredRot: 90, x: 46, y: 65, scale: 0.2, d: "M 46 65 L 54 65 L 54 85 L 46 85 Z" }
    ]
  }
];

export const generatePuzzleProblem = (): MathProblem => {
  const template = PUZZLE_TEMPLATES[getRandomInt(0, PUZZLE_TEMPLATES.length - 1)];
  return {
    id: generateId(),
    type: 'puzzle',
    visualType: 'dissection',
    question: `Bé hãy chọn hình bên trái, xoay cho đúng rồi lắp vào hình mẫu bên phải nhé!`,
    answer: template.targets,
    visualData: {
      templateName: template.name,
      sourceShapes: template.sources,
      gridPieces: template.targets
    }
  };
};

export const generateFind100Problems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const isTarget = Math.random() > 0.4;
    let a, b;
    if (isTarget) {
      a = getRandomInt(10, 90);
      b = 100 - a;
    } else {
      a = getRandomInt(10, 90);
      b = getRandomInt(10, 90);
      if (a + b === 100) b += getRandomInt(1, 5);
    }
    problems.push({ 
      id: generateId(), 
      type: 'find100', 
      numbers: [a, b], 
      answer: 100, 
      isCorrect: a + b === 100 
    });
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

export const generateExpressionProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    let n1 = getRandomInt(10, 40), n2 = getRandomInt(10, 30), n3 = getRandomInt(5, 10);
    problems.push({ id: generateId(), type: 'expression', numbers: [n1, n2, n3], operators: ['+', '+'], answer: n1 + n2 + n3 });
  }
  return problems;
};

export const generateFillBlankProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    for(let i=0; i<count; i++) { 
        let a = getRandomInt(10, 50), b = getRandomInt(10, 40), res = a + b;
        problems.push({ id: generateId(), type: 'fill_blank', numbers: [a, b], operators: ['+'], answer: res, options: [2] }); 
    }
    return problems;
};

export const generateMeasurementProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    for (let i = 0; i < count; i++) {
        let a = getRandomInt(10, 40), b = getRandomInt(5, 20);
        problems.push({ id: generateId(), type: 'measurement', unit: 'kg', numbers: [a, b], operators: ['+'], answer: a + b });
    }
    return problems;
};

export const generateGeometryProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    for (let i = 0; i < count; i++) {
        const segments = [{ label: 'AB', length: getRandomInt(2, 6) }, { label: 'BC', length: getRandomInt(2, 6) }];
        problems.push({ id: generateId(), type: 'geometry', visualType: 'path_length', question: `Độ dài đường gấp khúc ABC là:`, visualData: segments, answer: segments.reduce((sum, s) => sum + s.length, 0), unit: 'cm' });
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

export const generateComparisonProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const base = getRandomInt(5, 9);
    let leftNums = [base, getRandomInt(3, 9)], rightNums = [base + getRandomInt(-1, 1), getRandomInt(3, 9)];
    const leftSum = leftNums[0] + leftNums[1], rightSum = rightNums[0] + rightNums[1];
    let answer = leftSum > rightSum ? '>' : (leftSum < rightSum ? '<' : '=');
    problems.push({ id: generateId(), type: 'comparison', visualType: 'compare_expr', numbers: [...leftNums, ...rightNums], answer: answer, question: "Điền dấu >, < hoặc = vào ô trống:" });
  }
  return problems;
};

export const generateDmProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const op = Math.random() > 0.5 ? '+' : '-';
    let n1 = getRandomInt(10, 50), n2 = op === '+' ? getRandomInt(5, 40) : getRandomInt(1, n1 - 5), ans = op === '+' ? n1 + n2 : n1 - n2;
    problems.push({ id: generateId(), type: 'measurement', visualType: 'calc', numbers: [n1, n2], operators: [op], answer: ans, unit: 'dm', question: `${n1} dm ${op} ${n2} dm = ? dm` });
  }
  return problems.sort(() => Math.random() - 0.5);
};

export const generateChallengeProblem = (): MathProblem => {
    return {
      id: generateId(),
      type: 'challenge',
      visualType: 'puzzle_logic',
      question: "Hình nào là mảnh bìa còn thiếu để ghép thành hình vuông hoàn chỉnh?",
      answer: "1",
      visualData: {
        sourceShapes: [{ id: 'base', d: "M 10 10 L 90 10 L 90 40 L 40 40 L 40 90 L 10 90 Z", color: '#a78bfa' }],
        options: [
          { id: '1', label: 'A', name: 'Mảnh ghép A', d: "M 40 40 L 90 40 L 90 90 L 40 90 Z" },
          { id: '2', label: 'B', name: 'Mảnh ghép B', d: "M 50 10 L 90 50 L 10 50 Z" },
          { id: '3', label: 'C', name: 'Mảnh ghép C', d: "M 50 50 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0" }
        ]
      }
    };
};

export const generateIdentifyShapesProblem = (): MathProblem => {
  const target = { type: 'tri', name: 'hình tam giác', d: "M 50 15 L 85 85 L 15 85 Z" };
  return {
    id: generateId(),
    type: 'geometry',
    visualType: 'identify_shape',
    question: `Bé hãy chỉ ra các mảnh bìa là ${target.name} nhé:`,
    visualData: { targetId: target.type, shapes: [] },
    answer: 0
  };
};

export const generateMatchingGameData = (count: number) => {
    const problems: MathProblem[] = [];
    for(let i=0; i < count; i++) { 
        let n1 = getRandomInt(10, 30), n2 = getRandomInt(5, 15), n3 = getRandomInt(5, 15), ans = n1 + n2 + n3;
        problems.push({ id: generateId(), type: 'expression', numbers: [n1, n2, n3], operators: ['+', '+'], answer: ans }); 
    }
    return { birds: problems, houses: problems.map(p => ({ id: p.id, value: p.answer })).sort(() => Math.random() - 0.5) }
};
