
import { MathProblem } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// --- Vertical Calculations ---
export const generateVerticalProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    let a, b, op;
    let typeSub = i % 4; 

    if (typeSub === 0) { // 2-digit + 2-digit
      op = '+';
      a = getRandomInt(10, 50);
      b = getRandomInt(10, 40); // Ensure sum < 100
      if (a + b > 100) b = 100 - a;
    } else if (typeSub === 1) { // 2-digit - 2-digit
      op = '-';
      a = getRandomInt(50, 99);
      b = getRandomInt(10, a - 1); // Ensure positive
    } else if (typeSub === 2) { // 2-digit + 1-digit
      op = '+';
      a = getRandomInt(10, 89);
      b = getRandomInt(1, 9);
    } else { // 2-digit - 1-digit
      op = '-';
      a = getRandomInt(20, 99);
      b = getRandomInt(1, 9);
    }

    problems.push({
      id: generateId(),
      type: 'vertical',
      numbers: [a, b],
      operators: [op],
      answer: op === '+' ? a + b : a - b,
    });
  }
  return problems;
};

// --- Expression Calculations (3 numbers) ---
export const generateExpressionProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const type = getRandomInt(0, 2);
    let n1, n2, n3, op1, op2, ans;

    if (type === 0) { // + +
      n1 = getRandomInt(10, 30);
      n2 = getRandomInt(10, 30);
      n3 = getRandomInt(10, 30);
      while (n1 + n2 + n3 > 100) {
          n1 = getRandomInt(10, 20);
          n2 = getRandomInt(10, 20);
          n3 = getRandomInt(10, 20);
      }
      op1 = '+'; op2 = '+';
      ans = n1 + n2 + n3;
    } else if (type === 1) { // - -
      n1 = getRandomInt(60, 90);
      n2 = getRandomInt(10, 20);
      n3 = getRandomInt(10, 20);
      while (n1 - n2 - n3 < 0) {
          n1 += 10;
      }
      op1 = '-'; op2 = '-';
      ans = n1 - n2 - n3;
    } else { // Mixed
       n1 = getRandomInt(20, 60);
       n2 = getRandomInt(5, 15);
       n3 = getRandomInt(5, 15);
       op1 = Math.random() > 0.5 ? '+' : '-';
       op2 = op1 === '+' ? '-' : '+';
       let step1 = op1 === '+' ? n1 + n2 : n1 - n2;
       if (step1 < 0) { n1 = n2 + 5; step1 = n1 - n2; }
       if (step1 > 100) { n1 = 40; n2 = 10; step1 = n1 + n2; }
       ans = op2 === '+' ? step1 + n3 : step1 - n3;
    }
    
    if (ans < 0 || ans > 100) { i--; continue; }

    problems.push({
      id: generateId(),
      type: 'expression',
      numbers: [n1, n2, n3],
      operators: [op1, op2],
      answer: ans,
    });
  }
  return problems;
};

// --- Find 100 Game ---
export const generateFind100Problems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for(let i=0; i < Math.floor(count/2); i++) {
     const a = getRandomInt(10, 90);
     problems.push({
       id: generateId(),
       type: 'find100',
       numbers: [a, 100-a],
       operators: ['+'],
       answer: 100,
       isCorrect: true 
     });
  }
  while(problems.length < count) {
      const a = getRandomInt(10, 80);
      let b = getRandomInt(10, 80);
      while(a+b === 100 || a+b > 100) b = getRandomInt(10, 50);
      problems.push({ id: generateId(), type: 'find100', numbers: [a, b], operators: ['+'], answer: a+b, isCorrect: false });
  }
  return problems.sort(() => Math.random() - 0.5);
};

// --- Fill in Blank (Cards) ---
export const generateFillBlankProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    for(let i=0; i<count; i++) {
        const op = Math.random() > 0.5 ? '+' : '-';
        let a, b, res;
        if (op === '+') { a = getRandomInt(10, 50); b = getRandomInt(10, 40); res = a + b; }
        else { a = getRandomInt(50, 90); b = getRandomInt(10, 40); res = a - b; }
        const hideIndex = getRandomInt(0, 2);
        problems.push({ id: generateId(), type: 'fill_blank', numbers: [a, b], operators: [op], answer: hideIndex === 0 ? a : (hideIndex === 1 ? b : res), options: [hideIndex] });
    }
    return problems;
};

// --- Matching Game ---
export const generateMatchingGameData = (count: number) => {
    const problems: MathProblem[] = [];
    const usedAnswers = new Set<number>();
    let attempts = 0;
    while(problems.length < count && attempts < 100) {
        attempts++;
        let n1, n2, n3, op1, op2, ans;
        const type = getRandomInt(0, 2); 
        if (type === 0) { n1 = 20; n2 = 10; n3 = 5; op1 = '+'; op2 = '+'; ans = n1 + n2 + n3; }
        else { n1 = 90; n2 = 20; n3 = 10; op1 = '-'; op2 = '-'; ans = n1 - n2 - n3; }
        if (ans > 0 && ans <= 100 && !usedAnswers.has(ans)) {
            usedAnswers.add(ans);
            problems.push({ id: generateId(), type: 'expression', numbers: [n1, n2, n3], operators: [op1, op2], answer: ans });
        }
    }
    return { birds: problems, houses: problems.map(p => ({ id: p.id, value: p.answer })).sort(() => Math.random() - 0.5) }
};

// --- Measurement ---
export const generateMeasurementProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    for (let i = 0; i < count; i++) {
        const subType = i % 5; 
        if (subType === 0 || subType === 1) {
            let a = 20, b = 10, op = '+', unit = subType === 0 ? 'kg' : 'l';
            problems.push({ id: generateId(), type: 'measurement', visualType: 'calc', unit, numbers: [a, b], operators: [op], answer: a + b });
        } else if (subType === 2) {
            problems.push({ id: generateId(), type: 'measurement', visualType: 'balance', unit: 'kg', visualData: [2, 1], answer: 3 });
        } else if (subType === 3) {
            problems.push({ id: generateId(), type: 'measurement', visualType: 'spring', unit: 'kg', visualData: 2, answer: 2 });
        } else {
            problems.push({ id: generateId(), type: 'measurement', visualType: 'beaker', unit: 'l', visualData: 5, answer: 5 });
        }
    }
    return problems.sort(() => Math.random() - 0.5);
};

// --- Geometry ---
export const generateGeometryProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    const shapeTypes = [
        { id: 'triangle', name: 'hình tam giác', d: "M 50 10 L 90 90 L 10 90 Z" },
        { id: 'quad', name: 'hình tứ giác', d: "M 15 20 L 85 15 L 95 80 L 5 85 Z" },
        { id: 'rectangle', name: 'hình chữ nhật', d: "M 10 30 L 90 30 L 90 70 L 10 70 Z" },
        { id: 'square', name: 'hình vuông', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z" },
        { id: 'circle', name: 'hình tròn', d: "M 50 50 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0" },
        { id: 'rhombus', name: 'hình thoi', d: "M 50 10 L 90 50 L 50 90 L 10 50 Z" }
    ];

    for (let i = 0; i < count; i++) {
        if (i % 3 === 0) {
            // Path length problem
            const points = ['A', 'B', 'C', 'D'];
            const segments = [{ label: 'AB', length: getRandomInt(2, 9) }, { label: 'BC', length: getRandomInt(2, 9) }, { label: 'CD', length: getRandomInt(2, 9) }];
            problems.push({
                id: generateId(),
                type: 'geometry',
                visualType: 'path_length',
                question: `Độ dài đường gấp khúc ABCD là:`,
                visualData: segments,
                answer: segments.reduce((sum, s) => sum + s.length, 0),
                unit: 'cm'
            });
        } else {
            // Identify shape problem
            const targetType = shapeTypes[getRandomInt(0, shapeTypes.length - 1)];
            const shapes = [];
            const colors = ['#FCA5A5', '#93C5FD', '#FCD34D', '#A7F3D0', '#C4B5FD'];
            
            // Generate 3 shapes, ensuring at least one is the target
            const targetPos = getRandomInt(0, 2);
            for(let j=0; j<3; j++) {
                let typeInfo;
                if (j === targetPos) {
                    typeInfo = targetType;
                } else {
                    typeInfo = shapeTypes.find(t => t.id !== targetType.id) || shapeTypes[0];
                    // Mix up distractors
                    const distractorIdx = (shapeTypes.indexOf(targetType) + j + 1) % shapeTypes.length;
                    typeInfo = shapeTypes[distractorIdx];
                }
                
                shapes.push({
                    id: `shape_${i}_${j}`,
                    type: typeInfo.id,
                    d: typeInfo.d,
                    color: colors[getRandomInt(0, colors.length-1)]
                });
            }

            problems.push({
                id: generateId(),
                type: 'geometry',
                visualType: 'identify_shape',
                question: `Hình nào là ${targetType.name}?`,
                visualData: { targetId: targetType.id, shapes },
                answer: 0 // Logic handled by checking shape types in component
            });
        }
    }
    return problems;
};
