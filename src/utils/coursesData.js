// Comprehensive course database for all levels
export const coursesDatabase = {
  '100': {
    '1': [
      { code: 'GES 100.1', title: 'Communication skills in English', credits: 3 },
      { code: 'GES 102.1', title: 'Introduction to Philosophy in English', credits: 2 },
      { code: 'MTH 110.1', title: 'Algebra and Trigonometry', credits: 3 },
      { code: 'MTH 120.1', title: 'Calculus', credits: 3 },
      { code: 'PHY 101.1', title: 'Mechanics and Properties of Matter', credits: 3 },
      { code: 'PHY 102.1', title: 'Laboratory Practices I', credits: 1 },
      { code: 'CSC 180.1', title: 'Introduction to computer science and Basic Programming', credits: 2 },
      { code: 'CMH 130.1', title: 'General Chemistry I', credits: 3 },
      { code: 'FSB 101.1', title: 'General Biology I', credits: 3 }
    ],
    '2': [
      { code: 'GES 101.2', title: 'Computer Appreciations and Application', credits: 2 },
      { code: 'CSC 182.2', title: 'Computer Applications', credits: 2 },
      { code: 'CSC 183.2', title: 'Introduction to Problem Solving', credits: 2 },
      { code: 'MTH 114.2', title: 'Introduction to Set, Logic and Numbers', credits: 3 },
      { code: 'MTH 124.2', title: 'Coordinate Geometry', credits: 3 },
      { code: 'GES 103.2', title: 'Nigerian People and Culture', credits: 2 },
      { code: 'PHY 112.2', title: 'Introduction to Electricity and Magnetism', credits: 3 },
      { code: 'PHY 103.2', title: 'Laboratory Practices II', credits: 1 },
      { code: 'STA 160.2', title: 'Descriptive Statistics', credits: 3 }
    ]
  },
  '200': {
    '1': [
      { code: 'MTH 270.1', title: 'Numerical Analysis', credits: 3 },
      { code: 'STA 260.1', title: 'Introduction to Probability and statistics', credits: 3 },
      { code: 'CSC 280.1', title: 'Introduction to Computer Programming (Fortran)', credits: 3 },
      { code: 'CSC 281.1', title: 'Computer System Fundamentals', credits: 2 },
      { code: 'CSC 283.1', title: 'Introduction to Information Systems and File Structures', credits: 2 },
      { code: 'CSC 284.1', title: 'Introduction to Logic Design', credits: 2 },
      { code: 'CSC 288.1', title: 'Structured Programming', credits: 2 },
      { code: 'MTH 210.1', title: 'Linear Algebra', credits: 3 },
      { code: 'MTH 230.1', title: 'Modern Algebra', credits: 3 }
    ],
    '2': [
      { code: 'CSC 282.2', title: 'Database Programming', credits: 2 },
      { code: 'CSC 285.2', title: 'Digital Designs and Microprocessor', credits: 2 },
      { code: 'CSC 286.2', title: 'Data Structures', credits: 2 },
      { code: 'CSC 287.2', title: 'Object Oriented Programming I', credits: 2 },
      { code: 'FSC 2C1.2', title: 'Community Service', credits: 1 },
      { code: 'MTH 224.2', title: 'Mathematical Methods I', credits: 2 },
      { code: 'MTH 250.2', title: 'Elementary Differential Equations', credits: 3 },
      { code: 'STA 262.2', title: 'Mathematical Statistics I', credits: 3 },
      { code: 'PHY 351.2', title: 'Electronics 1', credits: 3 }
    ]
  },
  '300': {
    '1': [
      { code: 'GES 300.1', title: 'Fundamentals of Entrepreneurship', credits: 2 },
      { code: 'CSC 395.1', title: 'Introduction to Software Engineering', credits: 3 },
      { code: 'CSC 382.1', title: 'Computer Architecture I', credits: 2 },
      { code: 'CSC 394.1', title: 'Operating Systems', credits: 3 },
      { code: 'CSC 396.1', title: 'Automata theory, Computability & Formal Languages', credits: 3 },
      { code: 'CSC 397.1', title: 'Computational Methods', credits: 2 },
      { code: 'STA 370.1', title: 'Operations Research', credits: 3 }
    ],
    '2': [
      { code: 'CSC 300.2', title: 'Industrial Training', credits: 9 }
    ]
  },
  '400': {
    '1': [
      { code: 'GES 400.1', title: 'Entrepreneurship', credits: 2 },
      { code: 'CSC 480.1', title: 'Database Management', credits: 3 },
      { code: 'CSC 481.1', title: 'Object Oriented Programming II', credits: 2 },
      { code: 'CSC 482.1', title: 'Compiler Construction', credits: 2 },
      { code: 'CSC 483.1', title: 'Algorithms and Complexity Analysis', credits: 2 },
      { code: 'CSC 486.1', title: 'System Analysis and Design', credits: 3 },
      { code: 'CSC 496.1', title: 'Programming Languages (4th and 5th Generation)', credits: 2 },
      { code: 'CSC 498.1', title: 'Computer Network & Data Communications', credits: 3 }
    ],
    '2': [
      { code: 'CSC 491.2', title: 'Internet and Web Applications', credits: 2 },
      { code: 'CSC 494.2', title: 'Introduction to Artificial Intelligence', credits: 3 },
      { code: 'CSC 492.2', title: 'Computer Architecture II', credits: 2 },
      { code: 'CSC 490.2', title: 'Project', credits: 6 },
      { code: 'CSC 493.2', title: 'Computer Modeling and Simulation', credits: 2 },
      { code: 'CSC 499.2', title: 'Computer Graphics', credits: 2 },
      { code: 'CSC 497.2', title: 'Project Management (Audited Course)', credits: 1 }
    ]
  }
};

// Grading system
export const gradingSystem = [
  { min: 70, max: 100, grade: 'A', point: 5 },
  { min: 60, max: 69, grade: 'B', point: 4 },
  { min: 50, max: 59, grade: 'C', point: 3 },
  { min: 45, max: 49, grade: 'D', point: 2 },
  { min: 40, max: 44, grade: 'E', point: 1 },
  { min: 0, max: 39, grade: 'F', point: 0 }
];

// Function to get grade from score
export const getGradeFromScore = (score) => {
  const numericScore = parseInt(score) || 0;
  const gradeInfo = gradingSystem.find(g => numericScore >= g.min && numericScore <= g.max);
  return gradeInfo || { grade: 'F', point: 0 };
};

// Get grade color for display
export const getGradeColor = (grade) => {
  const colors = {
    'A': 'text-green-600',
    'B': 'text-blue-600',
    'C': 'text-yellow-600',
    'D': 'text-orange-600',
    'E': 'text-red-500',
    'F': 'text-red-600'
  };
  return colors[grade] || 'text-gray-500';
};