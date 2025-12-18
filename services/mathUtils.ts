
import { MathProblem } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Fix: Added missing generateFind100Problems function for Find100Game component
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
      // Ensure it's not 100 if we want an incorrect one
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

// Cấu hình các mảnh ghép cơ bản (theo chương trình lớp 2)
const SOURCE_SHAPES_POOL = {
  tri_red: { id: 'tri_red', color: '#ef4444', d: "M 50 5 L 95 95 L 5 95 Z", name: "Tam giác đỏ" },
  tri_blue: { id: 'tri_blue', color: '#3b82f6', d: "M 50 5 L 95 95 L 5 95 Z", name: "Tam giác xanh" },
  sq_orange: { id: 'sq_orange', color: '#f59e0b', d: "M 10 10 L 90 10 L 90 90 L 10 90 Z", name: "Vuông cam" },
  rect_purple: { id: 'rect_purple', color: '#a855f7', d: "M 10 30 L 90 30 L 90 70 L 10 70 Z", name: "Chữ nhật tím" },
  circle_green: { id: 'circle_green', color: '#22c55e', d: "M 50 50 m -45 0 a 45 45 0 1 0 90 0 a 45 45 0 1 0 -90 0", name: "Tròn xanh" }
};

const PUZZLE_TEMPLATES = [
  {
    name: "Thuyền buồm",
    targets: [
      { id: 't1', requiredId: 'tri_blue', rot: 0, x: 35, y: 10, scale: 0.4, d: "M 35 10 L 55 10 L 55 50 Z" },
      { id: 't2', requiredId: 'rect_purple', rot: 0, x: 25, y: 50, scale: 0.5, d: "M 25 50 L 75 50 L 65 70 L 35 70 Z" }
    ],
    sources: [SOURCE_SHAPES_POOL.tri_blue, SOURCE_SHAPES_POOL.rect_purple]
  },
  {
    name: "Ngôi nhà",
    targets: [
      { id: 't1', requiredId: 'tri_red', rot: 0, x: 30, y: 10, scale: 0.4, d: "M 30 10 L 70 10 L 50 45 Z" },
      { id: 't2', requiredId: 'sq_orange', rot: 0, x: 30, y: 45, scale: 0.4, d: "M 30 45 L 70 45 L 70 85 L 30 85 Z" }
    ],
    sources: [SOURCE_SHAPES_POOL.tri_red, SOURCE_SHAPES_POOL.sq_orange]
  },
  {
    name: "Cây thông",
    targets: [
      { id: 't1', requiredId: 'tri_red', rot: 180, x: 35, y: 5, scale: 0.3, d: "M 40 5 L 60 5 L 50 25 Z" },
      { id: 't2', requiredId: 'tri_blue', rot: 0, x: 30, y: 20, scale: 0.4, d: "M 35 20 L 65 20 L 50 50 Z" },
      { id: 't3', requiredId: 'rect_purple', rot: 90, x: 45, y: 50, scale: 0.2, d: "M 45 50 L 55 50 L 55 80 L 45 80 Z" }
    ],
    sources: [SOURCE_SHAPES_POOL.tri_red, SOURCE_SHAPES_POOL.tri_blue, SOURCE_SHAPES_POOL.rect_purple]
  },
  {
    name: "Mũi tên",
    targets: [
      { id: 't1', requiredId: 'sq_orange', rot: 0, x: 10, y: 35, scale: 0.3, d: "M 10 35 L 50 35 L 50 65 L 10 65 Z" },
      { id: 't2', requiredId: 'tri_red', rot: 90, x: 50, y: 20, scale: 0.6, d: "M 50 20 L 90 50 L 50 80 Z" }
    ],
    sources: [SOURCE_SHAPES_POOL.sq_orange, SOURCE_SHAPES_POOL.tri_red]
  }
];

export const generatePuzzleProblem = (): MathProblem => {
  const template = PUZZLE_TEMPLATES[getRandomInt(0, PUZZLE_TEMPLATES.length - 1)];
  return {
    id: generateId(),
    type: 'puzzle',
    visualType: 'dissection',
    question: `Bé hãy xếp các mảnh ghép để tạo thành "${template.name}" nhé!`,
    answer: template.targets,
    visualData: {
      sourceShapes: template.sources,
      gridPieces: template.targets
    }
  };
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
  const target = { type: 'triangle', name: 'hình tam giác', d: "M 50 15 L 85 85 L 15 85 Z" };
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
