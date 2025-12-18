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
      // Retry if sum > 100
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
      // Ensure result positive
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
       
       // Validate step 1
       if (step1 < 0) {
           n1 = n2 + getRandomInt(5, 10);
           step1 = n1 - n2;
       }
       if (step1 > 100) {
           n1 = getRandomInt(20, 40);
           n2 = getRandomInt(5, 10);
           step1 = n1 + n2;
       }

       ans = op2 === '+' ? step1 + n3 : step1 - n3;
    }
    
    // Final Safety Check
    if (ans < 0 || ans > 100) {
      i--; // Retry
      continue;
    }

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
  
  // Generate pairs that sum to 100
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

  // Generate pairs that DO NOT sum to 100
  while(problems.length < count) {
      const a = getRandomInt(10, 80);
      let b = getRandomInt(10, 80);
      while(a+b === 100 || a+b > 100) b = getRandomInt(10, 50);
      
      problems.push({
       id: generateId(),
       type: 'find100',
       numbers: [a, b],
       operators: ['+'],
       answer: a+b,
       isCorrect: false
     });
  }
  
  return problems.sort(() => Math.random() - 0.5);
};

// --- Fill in Blank (Cards) ---
export const generateFillBlankProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    for(let i=0; i<count; i++) {
        const op = Math.random() > 0.5 ? '+' : '-';
        let a, b, res;
        
        if (op === '+') {
            a = getRandomInt(10, 50);
            b = getRandomInt(10, 40);
            while (a + b > 100) b = getRandomInt(1, 20); // Safety
            res = a + b;
        } else {
            a = getRandomInt(50, 90);
            b = getRandomInt(10, 40);
            while (a - b < 0) b = getRandomInt(1, a); // Safety
            res = a - b;
        }

        const hideIndex = getRandomInt(0, 2);
        
        problems.push({
            id: generateId(),
            type: 'fill_blank',
            numbers: [a, b],
            operators: [op],
            answer: hideIndex === 0 ? a : (hideIndex === 1 ? b : res),
            options: [hideIndex]
        });
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
        
        if (type === 0) { 
            n1 = getRandomInt(10, 50);
            n2 = getRandomInt(5, 20);
            n3 = getRandomInt(5, 20);
            op1 = '+'; 
            op2 = '+';
            // Simple logic for matching game to keep it easy
            if (n1+n2+n3 > 100) n1 = 20; 
            ans = n1 + n2 + n3;
        } else { 
            n1 = 90;
            n2 = getRandomInt(10, 30);
            n3 = getRandomInt(5, 10);
            op1 = '-';
            op2 = '-';
            ans = n1 - n2 - n3;
        }

        if (ans > 0 && ans <= 100 && !usedAnswers.has(ans)) {
            usedAnswers.add(ans);
            problems.push({
                id: generateId(),
                type: 'expression',
                numbers: [n1, n2, n3],
                operators: [op1, op2],
                answer: ans
            });
        }
    }
    
    return {
        birds: problems, 
        houses: problems.map(p => ({ id: p.id, value: p.answer })).sort(() => Math.random() - 0.5)
    }
};

// --- Measurement (Kg & Liters) ---
export const generateMeasurementProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];

    for (let i = 0; i < count; i++) {
        const subType = i % 5; 
        
        if (subType === 0) { // Calc Kg
            let a = getRandomInt(10, 50);
            let b = getRandomInt(5, 40);
            const op = Math.random() > 0.5 ? '+' : '-';
            
            if (op === '+') {
                while(a + b > 100) { a = getRandomInt(10, 40); b = getRandomInt(5, 20); }
            } else {
                if (a < b) [a, b] = [b, a]; // Swap to ensure positive
            }
            
            const ans = op === '+' ? a + b : a - b;
            problems.push({
                id: generateId(),
                type: 'measurement',
                visualType: 'calc',
                unit: 'kg',
                numbers: [a, b],
                operators: [op],
                answer: ans
            });
        } else if (subType === 1) { // Calc Liter
            let a = getRandomInt(10, 40);
            let b = getRandomInt(5, 20);
            const op = Math.random() > 0.5 ? '+' : '-';
            
            if (op === '+') {
                while(a + b > 100) { a = getRandomInt(10, 40); b = getRandomInt(5, 20); }
            } else {
                if (a < b) [a, b] = [b, a]; // Swap to ensure positive
            }
            
            const ans = op === '+' ? a + b : a - b;
            problems.push({
                id: generateId(),
                type: 'measurement',
                visualType: 'calc',
                unit: 'l',
                numbers: [a, b],
                operators: [op],
                answer: ans
            });
        } else if (subType === 2) { // Balance Scale (add weights)
            const weights = [];
            const possibleWeights = [1, 2, 5];
            const numWeights = getRandomInt(2, 3);
            let total = 0;
            for(let w=0; w<numWeights; w++) {
                const weight = possibleWeights[getRandomInt(0, 2)];
                weights.push(weight);
                total += weight;
            }
            problems.push({
                id: generateId(),
                type: 'measurement',
                visualType: 'balance',
                unit: 'kg',
                visualData: weights,
                answer: total
            });
        } else if (subType === 3) { // Spring Scale
            const weight = getRandomInt(1, 5); // Usually simpler numbers for dial scale reading (1, 2, 3, 4, 5)
            problems.push({
                id: generateId(),
                type: 'measurement',
                visualType: 'spring',
                unit: 'kg',
                visualData: weight,
                answer: weight
            });
        } else { // Beaker
            const level = getRandomInt(1, 10); 
            problems.push({
                id: generateId(),
                type: 'measurement',
                visualType: 'beaker',
                unit: 'l',
                visualData: level,
                answer: level
            });
        }
    }
    
    return problems.sort(() => Math.random() - 0.5);
};

// --- Geometry (Quadrilaterals & Paths) ---
export const generateGeometryProblems = (count: number): MathProblem[] => {
    const problems: MathProblem[] = [];

    for (let i = 0; i < count; i++) {
        const subType = i % 2; 

        if (subType === 0) {
            // Identify Quadrilateral
            const shapes = [];
            const numShapes = 3;
            const quadIndex = getRandomInt(0, numShapes - 1);
            
            for(let j=0; j<numShapes; j++) {
                let type = 'triangle';
                if (j === quadIndex) {
                    type = 'quad';
                } else {
                    type = Math.random() > 0.5 ? 'triangle' : 'penta';
                }
                
                const colors = ['#FCA5A5', '#93C5FD', '#FCD34D', '#A7F3D0', '#C4B5FD'];
                
                let d = "";
                if (type === 'triangle') d = "M 50 10 L 90 90 L 10 90 Z";
                else if (type === 'quad') {
                    if (Math.random() > 0.5) d = "M 20 20 L 80 20 L 90 80 L 10 80 Z"; 
                    else d = "M 10 10 L 90 30 L 80 90 L 20 80 Z"; 
                }
                else if (type === 'penta') d = "M 50 10 L 90 40 L 75 90 L 25 90 L 10 40 Z";

                shapes.push({
                    id: `shape_${i}_${j}`,
                    type,
                    d,
                    color: colors[getRandomInt(0, colors.length-1)]
                });
            }

            problems.push({
                id: generateId(),
                type: 'geometry',
                visualType: 'identify_shape',
                question: 'Hình nào là hình tứ giác?',
                visualData: shapes,
                answer: 0 
            });

        } else {
            // Path Length
            const numPoints = 4;
            const segments = [];
            const pointNames = ['A', 'B', 'C', 'D', 'E', 'M', 'N', 'P', 'Q'];
            const startNameIdx = getRandomInt(0, 3);
            
            let totalLen = 0;
            
            for(let k=0; k<numPoints-1; k++) {
                const len = getRandomInt(2, 9);
                totalLen += len;
                segments.push({
                   label: `${pointNames[startNameIdx + k]}${pointNames[startNameIdx + k + 1]}`,
                   length: len
                });
            }

            // Safety check for path length
            while(totalLen > 100) {
                totalLen = 0;
                segments.length = 0;
                for(let k=0; k<numPoints-1; k++) {
                    const len = getRandomInt(2, 5);
                    totalLen += len;
                    segments.push({
                        label: `${pointNames[startNameIdx + k]}${pointNames[startNameIdx + k + 1]}`,
                        length: len
                    });
                }
            }
            
            problems.push({
                id: generateId(),
                type: 'geometry',
                visualType: 'path_length',
                question: `Độ dài đường gấp khúc ${pointNames.slice(startNameIdx, startNameIdx+numPoints).join('')} là:`,
                visualData: segments,
                answer: totalLen,
                unit: 'cm'
            });
        }
    }

    return problems;
};