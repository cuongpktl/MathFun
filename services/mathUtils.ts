
import { MathProblem } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Cấu hình các loại hình cơ bản
const SHAPE_CONFIGS = [
  { id: 'triangle', name: 'hình tam giác', type: 'tri', d: "M 50 10 L 90 90 L 10 90 Z" },
  { id: 'quad', name: 'hình tứ giác', type: 'quad', d: "M 15 20 L 85 15 L 95 80 L 5 85 Z" },
  { id: 'circle', name: 'hình tròn', type: 'circle', d: "M 50 50 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0" },
  { id: 'square', name: 'hình vuông', type: 'square', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z" },
  { id: 'rhombus', name: 'hình thoi', type: 'rhombus', d: "M 50 10 L 90 50 L 50 90 L 10 50 Z" }
];

export const generateIdentifyShapesProblem = (): MathProblem => {
  const target = SHAPE_CONFIGS[getRandomInt(0, SHAPE_CONFIGS.length - 1)];
  const shapes: any[] = [];
  const totalShapes = 11;
  const targetCount = getRandomInt(2, 4);
  
  for (let i = 0; i < totalShapes; i++) {
    let source;
    if (i < targetCount) {
      source = target;
    } else {
      source = SHAPE_CONFIGS[getRandomInt(0, SHAPE_CONFIGS.length - 1)];
    }
    shapes.push({
      id: generateId(),
      num: i + 1,
      type: source.type,
      color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
      d: source.d
    });
  }
  const shuffledShapes = shapes.sort(() => Math.random() - 0.5);
  return {
    id: generateId(),
    type: 'geometry',
    visualType: 'identify_shape',
    question: `Bé hãy chỉ ra các mảnh bìa là ${target.name} nhé:`,
    visualData: { targetId: target.type, shapes: shuffledShapes },
    answer: 0
  };
};

export const generateChallengeProblem = (): MathProblem => {
  const challengeTypes = ['dissection', 'counting', 'different', 'pattern', 'mirror'];
  const type = challengeTypes[getRandomInt(0, challengeTypes.length - 1)];

  if (type === 'dissection') {
    // Hoàn thành hình vuông đơn giản
    return {
      id: generateId(),
      type: 'challenge',
      visualType: 'puzzle_logic',
      question: "Hình nào là mảnh bìa còn thiếu để ghép thành hình vuông hoàn chỉnh?",
      answer: "1",
      visualData: {
        sourceShapes: [
          { id: 'base', d: "M 10 10 L 90 10 L 90 40 L 40 40 L 40 90 L 10 90 Z", color: '#a78bfa' }
        ],
        options: [
          { id: '1', label: 'A', name: 'Mảnh ghép A', d: "M 40 40 L 90 40 L 90 90 L 40 90 Z" }, // Hình vuông nhỏ
          { id: '2', label: 'B', name: 'Mảnh ghép B', d: "M 50 10 L 90 50 L 10 50 Z" }, // Tam giác
          { id: '3', label: 'C', name: 'Mảnh ghép C', d: "M 50 50 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0" } // Hình tròn
        ]
      }
    };
  } else if (type === 'counting') {
    // Đếm hình vuông trong cửa sổ 2x2 (Đơn giản cho lớp 2)
    return {
      id: generateId(),
      type: 'challenge',
      visualType: 'puzzle_logic',
      question: "Hình bên có bao nhiêu hình vuông nhỏ?",
      answer: "2",
      visualData: {
        sourceShapes: [
          { id: 'grid', d: "M 10 10 L 90 10 L 90 90 L 10 90 Z M 10 50 L 90 50 M 50 10 L 50 90", color: '#fb7185' }
        ],
        options: [
          { id: '1', label: 'A', name: '3 hình', d: "M 30 40 L 70 40 L 70 60 L 30 60 Z" },
          { id: '2', label: 'B', name: '4 hình', d: "M 30 40 L 70 40 L 70 60 L 30 60 Z" },
          { id: '3', label: 'C', name: '5 hình', d: "M 30 40 L 70 40 L 70 60 L 30 60 Z" }
        ]
      }
    };
  } else if (type === 'different') {
    // Tìm hình khác biệt về màu sắc hoặc loại
    return {
      id: generateId(),
      type: 'challenge',
      visualType: 'puzzle_logic',
      question: "Trong 3 hình dưới đây, hình nào có màu sắc KHÁC biệt?",
      answer: "3",
      visualData: {
        sourceShapes: [],
        options: [
          { id: '1', label: 'A', name: 'Hình xanh', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z", color: '#3b82f6' },
          { id: '2', label: 'B', name: 'Hình xanh', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z", color: '#3b82f6' },
          { id: '3', label: 'C', name: 'Hình vàng', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z", color: '#fbce15' }
        ]
      }
    };
  } else if (type === 'pattern') {
    // Dãy quy luật đơn giản: Tròn - Vuông - Tròn - ?
    return {
      id: generateId(),
      type: 'challenge',
      visualType: 'puzzle_logic',
      question: "Bé hãy tìm hình tiếp theo của dãy: Tròn - Vuông - Tròn - ... ?",
      answer: "2",
      visualData: {
        sourceShapes: [
           { id: 'p1', d: "M 20 30 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0", color: '#34d399' },
           { id: 'p2', d: "M 45 15 L 75 15 L 75 45 L 45 45 Z", color: '#f87171' },
           { id: 'p3', d: "M 90 30 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0", color: '#34d399' }
        ],
        options: [
          { id: '1', label: 'A', name: 'Hình Tròn', d: "M 50 50 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0", color: '#34d399' },
          { id: '2', label: 'B', name: 'Hình Vuông', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z", color: '#f87171' },
          { id: '3', label: 'C', name: 'Hình Tam Giác', d: "M 50 15 L 85 85 L 15 85 Z", color: '#60a5fa' }
        ]
      }
    };
  } else {
    // Đối xứng đơn giản
    return {
      id: generateId(),
      type: 'challenge',
      visualType: 'puzzle_logic',
      question: "Đâu là hình đối xứng qua gương của hình bên trái?",
      answer: "1",
      visualData: {
        sourceShapes: [
          { id: 's1', d: "M 20 20 L 50 50 L 20 80 Z", color: '#8b5cf6' },
          { id: 'line', d: "M 80 10 L 80 90", color: '#e2e8f0' }
        ],
        options: [
          { id: '1', label: 'A', name: 'Hình A', d: "M 80 20 L 50 50 L 80 80 Z", color: '#8b5cf6' },
          { id: '2', label: 'B', name: 'Hình B', d: "M 20 20 L 50 50 L 20 80 Z", color: '#8b5cf6' },
          { id: '3', label: 'C', name: 'Hình C', d: "M 50 20 L 80 50 L 50 80 Z", color: '#ec4899' }
        ]
      }
    };
  }
};

export const generateDmProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < 5; i++) {
    const op = Math.random() > 0.5 ? '+' : '-';
    let n1, n2, n3, ans, question;
    if (i < 3) { 
        n1 = getRandomInt(10, 50);
        n2 = op === '+' ? getRandomInt(5, 40) : getRandomInt(1, n1 - 5);
        ans = op === '+' ? n1 + n2 : n1 - n2;
        question = `${n1} dm ${op} ${n2} dm = ? dm`;
        problems.push({ id: generateId(), type: 'measurement', visualType: 'calc', numbers: [n1, n2], operators: [op], answer: ans, unit: 'dm', question });
    } else {
        n1 = getRandomInt(20, 50); n2 = getRandomInt(5, 15); n3 = getRandomInt(1, 10);
        const op1 = '+'; const op2 = Math.random() > 0.5 ? '+' : '-';
        ans = op2 === '+' ? n1 + n2 + n3 : n1 + n2 - n3;
        question = `${n1} dm + ${n2} dm ${op2} ${n3} dm = ? dm`;
        problems.push({ id: generateId(), type: 'measurement', visualType: 'calc', numbers: [n1, n2, n3], operators: [op1, op2], answer: ans, unit: 'dm', question });
    }
  }
  const conversionTasks = [{ q: "1 dm = ? cm", a: 10 }, { q: "2 dm = ? cm", a: 20 }, { q: "10 cm = ? dm", a: 1 }, { q: "20 cm = ? dm", a: 2 }, { q: "1 dm + 5 cm = ? cm", a: 15 }, { q: "15 cm - 1 dm = ? cm", a: 5 }, { q: "1 dm + 10 cm = ? dm", a: 2 }];
  const selectedTasks = [...conversionTasks].sort(() => Math.random() - 0.5).slice(0, 5);
  selectedTasks.forEach(task => {
    problems.push({ id: generateId(), type: 'measurement', visualType: 'calc', answer: task.a, question: task.q });
  });
  return problems.sort(() => Math.random() - 0.5);
};

export const generateComparisonProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const presets = [{ left: [9, 7], right: [9, 9] }, { left: [7, 6], right: [7, 8] }, { left: [8, 8], right: [8, 5] }, { left: [5, 6], right: [7, 4] }];
  for (let i = 0; i < count; i++) {
    let leftNums, rightNums;
    if (i < presets.length) { leftNums = presets[i].left; rightNums = presets[i].right; }
    else { const base = getRandomInt(5, 9); leftNums = [base, getRandomInt(3, 9)]; rightNums = [base + getRandomInt(-1, 1), getRandomInt(3, 9)]; }
    const leftSum = leftNums[0] + leftNums[1]; const rightSum = rightNums[0] + rightNums[1];
    let answer = '='; if (leftSum > rightSum) answer = '>'; else if (leftSum < rightSum) answer = '<';
    problems.push({ id: generateId(), type: 'comparison', visualType: 'compare_expr', numbers: [...leftNums, ...rightNums], answer: answer, question: "Điền dấu >, < hoặc = vào ô trống:" });
  }
  return problems;
};

export const generatePuzzleProblem = (): MathProblem => {
  return {
    id: 'puzzle-easy-1',
    type: 'puzzle',
    visualType: 'dissection',
    question: "Bé hãy tìm mảnh ghép có màu và hình dạng giống với bóng mờ trong hình vuông nhé!",
    answer: {
      "5": { sourceId: "a1", rotation: 90 },
      "8": { sourceId: "a2", rotation: 0 }
    }, 
    visualData: {
      sourceShapes: [
        { id: 'a1', color: '#fbbf24', d: "M 10 10 L 90 10 L 90 90 L 50 90 L 10 50 Z", name: "Mảnh vàng" },
        { id: 'a2', color: '#f87171', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z", name: "Mảnh đỏ" }
      ],
      gridPieces: [
        { id: '1', d: "M 0 0 L 40 0 L 20 20 Z" },
        { id: '2', d: "M 40 0 L 80 0 L 60 20 Z" },
        { id: '3', d: "M 80 0 L 120 0 L 100 20 Z" },
        { id: '4', d: "M 0 0 L 20 20 L 0 40 Z" },
        { id: '5', d: "M 20 20 L 60 20 L 60 60 L 40 60 L 20 40 Z", hintColor: '#fde68a' },
        { id: '6', d: "M 60 20 L 100 20 L 80 40 Z" },
        { id: '7', d: "M 0 40 L 20 40 L 0 80 Z" },
        { id: '8', d: "M 40 60 L 80 60 L 80 100 L 40 100 Z", hintColor: '#fecaca' },
        { id: '9', d: "M 80 40 L 100 20 L 120 40 L 100 60 Z" },
        { id: '10', d: "M 0 80 L 40 60 L 40 100 L 0 120 Z" },
        { id: '11', d: "M 80 100 L 120 120 L 80 120 Z" },
        { id: '12', d: "M 40 100 L 80 100 L 60 120 Z" }
      ]
    }
  };
};

export const generateVerticalProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    let a, b, op; let typeSub = i % 4; 
    if (typeSub === 0) { op = '+'; a = getRandomInt(10, 50); b = getRandomInt(10, 40); if (a + b > 100) b = 100 - a; }
    else if (typeSub === 1) { op = '-'; a = getRandomInt(50, 99); b = getRandomInt(10, a - 1); }
    else if (typeSub === 2) { op = '+'; a = getRandomInt(10, 89); b = getRandomInt(1, 9); }
    else { op = '-'; a = getRandomInt(20, 99); b = getRandomInt(1, 9); }
    problems.push({ id: generateId(), type: 'vertical', numbers: [a, b], operators: [op], answer: op === '+' ? a + b : a - b });
  }
  return problems;
};

export const generatePatternProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    const shapeTypes = [{ id: 'triangle', name: 'hình tam giác', d: "M 50 15 L 85 85 L 15 85 Z", color: '#4ade80' }, { id: 'circle', name: 'hình tròn', d: "M 50 50 m -35 0 a 35 35 0 1 0 70 0 a 35 35 0 1 0 -70 0", color: '#facc15' }, { id: 'square', name: 'hình vuông', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z", color: '#f87171' }, { id: 'rhombus', name: 'hình thoi', d: "M 50 15 L 85 50 L 50 85 L 15 50 Z", color: '#a78bfa' }];
    for (let p = 0; p < count; p++) {
        const pool = [...shapeTypes].sort(() => Math.random() - 0.5).slice(0, 3); const baseRow = [0, 1, 2].sort(() => Math.random() - 0.5); const grid: any[][] = []; const rowShifts = [0, 1, 2].sort(() => Math.random() - 0.5);
        for (let r = 0; r < 3; r++) { grid[r] = []; const shift = rowShifts[r]; for (let c = 0; c < 3; c++) { const shapeIndex = baseRow[(c + shift) % 3]; grid[r][c] = { ...pool[shapeIndex] }; } }
        const hiddenCells: { r: number, c: number, target: string }[] = []; const numToHide = getRandomInt(1, 2);
        while (hiddenCells.length < numToHide) { const r = getRandomInt(0, 2); const c = getRandomInt(0, 2); if (!hiddenCells.some(h => h.r === r && h.c === c)) { hiddenCells.push({ r, c, target: grid[r][c].id }); } }
        problems.push({ id: generateId(), type: 'pattern', question: "Tìm hình còn thiếu trong mỗi ô trống:", visualData: { grid, hiddenCells, options: pool }, answer: hiddenCells });
    }
    return problems;
};

export const generateExpressionProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const type = getRandomInt(0, 2); let n1, n2, n3, op1, op2, ans;
    if (type === 0) { n1 = getRandomInt(10, 30); n2 = getRandomInt(10, 30); n3 = getRandomInt(10, 30); op1 = '+'; op2 = '+'; ans = n1 + n2 + n3; }
    else if (type === 1) { n1 = getRandomInt(60, 90); n2 = getRandomInt(10, 20); n3 = getRandomInt(10, 20); op1 = '-'; op2 = '-'; ans = n1 - n2 - n3; }
    else { n1 = getRandomInt(20, 60); n2 = getRandomInt(5, 15); n3 = getRandomInt(5, 15); op1 = Math.random() > 0.5 ? '+' : '-'; op2 = op1 === '+' ? '-' : '+'; let step1 = op1 === '+' ? n1 + n2 : n1 - n2; ans = op2 === '+' ? step1 + n3 : step1 - n3; }
    if (ans < 0 || ans > 100) { i--; continue; }
    problems.push({ id: generateId(), type: 'expression', numbers: [n1, n2, n3], operators: [op1, op2], answer: ans });
  }
  return problems;
};

export const generateFind100Problems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for(let i=0; i < Math.floor(count/2); i++) { const a = getRandomInt(10, 90); problems.push({ id: generateId(), type: 'find100', numbers: [a, 100-a], operators: ['+'], answer: 100, isCorrect: true }); }
  while(problems.length < count) { const a = getRandomInt(10, 80); let b = getRandomInt(10, 80); while(a+b === 100 || a+b > 100) b = getRandomInt(10, 50); problems.push({ id: generateId(), type: 'find100', numbers: [a, b], operators: ['+'], answer: a+b, isCorrect: false }); }
  return problems.sort(() => Math.random() - 0.5);
};

export const generateFillBlankProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    for(let i=0; i<count; i++) { const op = Math.random() > 0.5 ? '+' : '-'; let a, b, res; if (op === '+') { a = getRandomInt(10, 50); b = getRandomInt(10, 40); res = a + b; } else { a = getRandomInt(50, 90); b = getRandomInt(10, 40); res = a - b; } const hideIndex = getRandomInt(0, 2); problems.push({ id: generateId(), type: 'fill_blank', numbers: [a, b], operators: [op], answer: hideIndex === 0 ? a : (hideIndex === 1 ? b : res), options: [hideIndex] }); }
    return problems;
};

export const generateMatchingGameData = (count: number) => {
    const problems: MathProblem[] = []; const usedAnswers = new Set<number>();
    while(problems.length < count) { let n1 = getRandomInt(10, 40), n2 = getRandomInt(5, 20), n3 = getRandomInt(5, 20), ans = n1 + n2 + n3; if (!usedAnswers.has(ans) && ans <= 100) { usedAnswers.add(ans); problems.push({ id: generateId(), type: 'expression', numbers: [n1, n2, n3], operators: ['+', '+'], answer: ans }); } }
    return { birds: problems, houses: problems.map(p => ({ id: p.id, value: p.answer })).sort(() => Math.random() - 0.5) }
};

export const generateMeasurementProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    for (let i = 0; i < count; i++) {
        const subType = i % 4; 
        if (subType === 0) { let a = getRandomInt(10, 40), b = getRandomInt(5, 20); problems.push({ id: generateId(), type: 'measurement', unit: 'kg', numbers: [a, b], operators: ['+'], answer: a + b }); }
        else if (subType === 1) { problems.push({ id: generateId(), type: 'measurement', visualType: 'balance', unit: 'kg', visualData: [getRandomInt(1, 3), getRandomInt(1, 2)], answer: 0 }); }
        else if (subType === 2) { problems.push({ id: generateId(), type: 'measurement', visualType: 'spring', unit: 'kg', visualData: getRandomInt(1, 10), answer: 0 }); }
        else { problems.push({ id: generateId(), type: 'measurement', visualType: 'beaker', unit: 'l', visualData: getRandomInt(1, 10), answer: 0 }); }
    }
    problems.forEach(p => { if(p.visualType === 'balance') p.answer = (p.visualData as number[]).reduce((s,v)=>s+v, 0); if(p.visualType === 'spring') p.answer = p.visualData; if(p.visualType === 'beaker') p.answer = p.visualData; });
    return problems;
};

export const generateGeometryProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    const shapeTypes = [{ id: 'triangle', type: 'triangle', name: 'hình tam giác', d: "M 50 10 L 90 90 L 10 90 Z" }, { id: 'quad', type: 'quad', name: 'hình tứ giác', d: "M 15 20 L 85 15 L 95 80 L 5 85 Z" }, { id: 'rectangle', type: 'quad', name: 'hình chữ nhật', d: "M 10 30 L 90 30 L 90 70 L 10 70 Z" }, { id: 'square', type: 'quad', name: 'hình vuông', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z" }, { id: 'circle', type: 'circle', name: 'hình tròn', d: "M 50 50 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0" }, { id: 'rhombus', type: 'quad', name: 'hình thoi', d: "M 50 10 L 90 50 L 50 90 L 10 50 Z" }];
    for (let i = 0; i < count; i++) {
        if (i % 2 === 0) { const segments = [{ label: 'AB', length: getRandomInt(2, 6) }, { label: 'BC', length: getRandomInt(2, 6) }, { label: 'CD', length: getRandomInt(2, 6) }]; problems.push({ id: generateId(), type: 'geometry', visualType: 'path_length', question: `Độ dài đường gấp khúc ABCD là:`, visualData: segments, answer: segments.reduce((sum, s) => sum + s.length, 0), unit: 'cm' }); }
        else { const targetEntry = shapeTypes[getRandomInt(0, shapeTypes.length-1)]; const shapes = [...shapeTypes].sort(() => Math.random() - 0.5).slice(0, 4).map(s => ({...s, color: '#'+(Math.random()*0xFFFFFF<<0).toString(16)})); if(!shapes.find(s=>s.id===targetEntry.id)) shapes[0] = {...targetEntry, color: '#'+(Math.random()*0xFFFFFF<<0).toString(16)}; problems.push({ id: generateId(), type: 'geometry', visualType: 'identify_shape', question: `Hình nào là ${targetEntry.name}?`, visualData: { targetId: targetEntry.type, shapes }, answer: 0 }); }
    }
    return problems;
};
