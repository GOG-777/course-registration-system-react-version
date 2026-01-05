import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import { coursesDatabase, getGradeFromScore, getGradeColor } from '../utils/coursesData';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const CGPACalculator = () => {
  const { user } = useAuth();
  const [currentLevel, setCurrentLevel] = useState(user?.level || 100);
  const [calculationType, setCalculationType] = useState('semester1');
  const [userScores, setUserScores] = useState({});
  const [results, setResults] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    // Load scores from localStorage
    const savedScores = localStorage.getItem('cgpaScores');
    if (savedScores) {
      setUserScores(JSON.parse(savedScores));
    }
  }, []);

  useEffect(() => {
    // Save scores to localStorage whenever they change
    localStorage.setItem('cgpaScores', JSON.stringify(userScores));
  }, [userScores]);

  const getCoursesToShow = () => {
    switch (calculationType) {
      case 'semester1':
        return coursesDatabase[currentLevel]?.['1'] || [];
      case 'semester2':
        return coursesDatabase[currentLevel]?.['2'] || [];
      case 'cgpa':
        const sem1 = coursesDatabase[currentLevel]?.['1'] || [];
        const sem2 = coursesDatabase[currentLevel]?.['2'] || [];
        return [...sem1, ...sem2];
      default:
        return [];
    }
  };

  const updateScore = (courseKey, score, credits) => {
    // Validate score
    if (score === '' || score === null) {
      // Remove score if cleared
      const newScores = { ...userScores };
      delete newScores[courseKey];
      setUserScores(newScores);
      return true;
    }

    const numericScore = parseInt(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      return false;
    }

    setUserScores({
      ...userScores,
      [courseKey]: numericScore
    });
    return true;
  };

  const calculateResults = () => {
    const coursesToCalculate = getCoursesToShow();
    let totalCredits = 0;
    let totalQualityPoints = 0;
    let hasInvalidScores = false;
    let invalidCourses = [];

    // Validate and calculate
    coursesToCalculate.forEach(course => {
      const courseKey = `${currentLevel}-${course.code}`;
      const score = userScores[courseKey];

      if (score !== undefined && score !== null && score !== '') {
        const numericScore = parseInt(score);
        if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
          hasInvalidScores = true;
          invalidCourses.push(course.code);
        } else {
          const gradeInfo = getGradeFromScore(score);
          totalCredits += course.credits;
          totalQualityPoints += course.credits * gradeInfo.point;
        }
      }
    });

    if (hasInvalidScores) {
      const errorMessage = invalidCourses.length > 0
        ? `Invalid scores in: ${invalidCourses.join(', ')}. Scores must be between 0 and 100.`
        : 'Some scores are invalid. Scores must be between 0 and 100.';
      showToast(errorMessage, 'error');
      return;
    }

    const finalResult = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

    let resultType = '';
    let title = '';
    switch (calculationType) {
      case 'semester1':
        resultType = 'GPA';
        title = `First Semester GPA Results - Level ${currentLevel}`;
        break;
      case 'semester2':
        resultType = 'GPA';
        title = `Second Semester GPA Results - Level ${currentLevel}`;
        break;
      case 'cgpa':
        resultType = 'CGPA';
        title = `Cumulative GPA (CGPA) Results - Level ${currentLevel}`;
        break;
    }

    setResults({
      totalCredits,
      totalQualityPoints,
      finalResult,
      resultType,
      title
    });
  };

  const clearAllScores = () => {
    setUserScores({});
    setResults(null);
    setShowClearModal(false);
    showToast('All scores cleared successfully', 'success');
  };

  const coursesToShow = getCoursesToShow();
  const tableTitle = {
    semester1: `Level ${currentLevel} - First Semester Courses`,
    semester2: `Level ${currentLevel} - Second Semester Courses`,
    cgpa: `Level ${currentLevel} - All Courses (CGPA Calculation)`
  }[calculationType];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">CGPA Calculator</h2>
              <p className="text-gray-600 text-lg">Track your academic performance with precision</p>
            </div>
            <div className="text-6xl opacity-20">
              🧮
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                <i className="fas fa-calculator text-blue-500 mr-2"></i>
                Calculation Type
              </label>
              <div className="relative">
                <select
                  value={calculationType}
                  onChange={(e) => {
                    setCalculationType(e.target.value);
                    setResults(null);
                  }}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none"
                >
                  <option value="semester1">First Semester GPA</option>
                  <option value="semester2">Second Semester GPA</option>
                  <option value="cgpa">Cumulative GPA (CGPA)</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-calculator text-gray-400"></i>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <button
                onClick={calculateResults}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <i className="fas fa-calculator"></i>
                <span>Calculate</span>
              </button>
              <button
                onClick={() => setShowClearModal(true)}
                className="flex-1 bg-red-100 text-red-700 px-6 py-3 rounded-xl font-semibold hover:bg-red-200 transition duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-trash"></i>
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        {results && (
          <div className="bg-green-50 border-green-200 rounded-2xl shadow-xl p-8 mb-8 border">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i className="fas fa-trophy text-yellow-500 mr-3"></i>
              {results.title}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-green-200">
                <p className="text-gray-600 text-sm mb-2">Total Credits</p>
                <p className="text-3xl font-bold text-gray-900">{results.totalCredits}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-green-200">
                <p className="text-gray-600 text-sm mb-2">Quality Points</p>
                <p className="text-3xl font-bold text-gray-900">{results.totalQualityPoints.toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <p className="text-green-100 text-sm mb-2">{results.resultType}</p>
                <p className="text-4xl font-bold">{results.finalResult.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Courses Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">{tableTitle}</h3>
          </div>

          {coursesToShow.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-lg font-medium text-gray-600">No courses found for Level {currentLevel}</p>
              <p className="text-sm text-gray-500">Please check if this level exists in the course database.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score (0-100)</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Point</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QP</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coursesToShow.map((course) => {
                    const courseKey = `${currentLevel}-${course.code}`;
                    const savedScore = userScores[courseKey] || '';
                    const gradeInfo = savedScore ? getGradeFromScore(savedScore) : null;

                    return (
                      <tr key={course.code} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{course.code}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{course.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{course.credits}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={savedScore}
                            onChange={(e) => {
                              const isValid = updateScore(courseKey, e.target.value, course.credits);
                              if (!isValid && e.target.value) {
                                e.target.classList.add('border-red-500', 'bg-red-50');
                              } else {
                                e.target.classList.remove('border-red-500', 'bg-red-50');
                              }
                            }}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0-100"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${gradeInfo ? getGradeColor(gradeInfo.grade) : 'text-gray-500'}`}>
                            {gradeInfo ? gradeInfo.grade : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {gradeInfo ? gradeInfo.point : '0'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {gradeInfo ? (course.credits * gradeInfo.point) : '0'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Grading Scale Reference */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Grading Scale Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { grade: 'A', range: '70-100', point: 5, color: 'bg-green-100 text-green-800 border-green-200' },
              { grade: 'B', range: '60-69', point: 4, color: 'bg-blue-100 text-blue-800 border-blue-200' },
              { grade: 'C', range: '50-59', point: 3, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
              { grade: 'D', range: '45-49', point: 2, color: 'bg-orange-100 text-orange-800 border-orange-200' },
              { grade: 'E', range: '40-44', point: 1, color: 'bg-red-100 text-red-800 border-red-200' },
              { grade: 'F', range: '0-39', point: 0, color: 'bg-red-200 text-red-900 border-red-300' }
            ].map((item) => (
              <div key={item.grade} className={`rounded-xl p-4 border ${item.color}`}>
                <div className="text-2xl font-bold mb-1">{item.grade}</div>
                <div className="text-xs mb-1">{item.range}</div>
                <div className="text-sm font-semibold">{item.point} Point{item.point !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowClearModal(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Clear All Scores</h3>
            <div className="mb-6">
              <p className="text-gray-700">Are you sure you want to clear all scores?</p>
              <p className="text-gray-600 text-sm mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={clearAllScores}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CGPACalculator;