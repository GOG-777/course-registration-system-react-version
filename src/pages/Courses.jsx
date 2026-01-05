import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const MAX_CREDITS = 24;

const Courses = () => {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    loadCourses();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, semesterFilter, allCourses]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      
      // Load courses for user's level
      const coursesData = await courseService.getAllCourses(user.level);
      setAllCourses(coursesData.courses || []);

      // Load enrolled courses
      const enrolledData = await enrollmentService.getMyCourses();
      const enrolled = enrolledData.enrollments?.filter(e => e.status === 'enrolled') || [];
      setEnrolledCourses(enrolled);
      setEnrolledCourseIds(enrolled.map(e => e.id));
    } catch (error) {
      console.error('Failed to load courses:', error);
      showToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allCourses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Semester filter
    if (semesterFilter) {
      filtered = filtered.filter(course => course.semester === parseInt(semesterFilter));
    }

    setFilteredCourses(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSemesterFilter('');
    showToast('Filters cleared', 'info');
  };

  const getTotalEnrolledCredits = () => {
    return enrolledCourses.reduce((total, course) => total + (course.credits || 0), 0);
  };

  const showEnrollModal = (course) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  const confirmEnrollment = async () => {
    if (!selectedCourse) return;

    try {
      await enrollmentService.enrollCourse(selectedCourse.id);
      showToast(`Successfully enrolled in ${selectedCourse.course_code}! 🎉`, 'success');
      closeModal();
      // Reload courses silently
      await loadCourses();
    } catch (error) {
      showToast(error.response?.data?.error || 'Enrollment failed', 'error');
      closeModal();
    }
  };

  const totalCredits = getTotalEnrolledCredits();
  const remainingCredits = MAX_CREDITS - totalCredits;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="spinner mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading course catalog...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Course Catalog</h2>
              <p className="text-gray-600 text-lg">Browse and enroll in courses for your academic level</p>
            </div>
            <div className="text-6xl opacity-20">
              📚
            </div>
          </div>

          {/* Credit Display */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-blue-900 flex items-center">
                  <i className="fas fa-chart-pie mr-2"></i>
                  Credit Progress
                </h3>
                <p className="text-blue-700 text-sm">Track your academic load</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${totalCredits >= MAX_CREDITS ? 'text-red-600' : 'text-blue-600'}`}>
                  {totalCredits}<span className="text-gray-500 text-lg">/{MAX_CREDITS}</span>
                </div>
                <div className={`text-sm ${totalCredits >= MAX_CREDITS ? 'text-red-600' : 'text-blue-600'} font-medium`}>
                  {totalCredits >= MAX_CREDITS ? 'Maximum Reached' : `${remainingCredits} credits available`}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  totalCredits >= MAX_CREDITS
                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}
                style={{ width: `${Math.min((totalCredits / MAX_CREDITS) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              {totalCredits >= MAX_CREDITS
                ? 'You have reached the maximum credit limit. Drop some courses to enroll in new ones.'
                : `You can enroll in courses worth ${remainingCredits} more credits.`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                <i className="fas fa-search text-blue-500 mr-2"></i>
                Search Courses
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Course name or code..."
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                <i className="fas fa-calendar text-blue-500 mr-2"></i>
                Semester
              </label>
              <div className="relative">
                <select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none"
                >
                  <option value="">All Semesters</option>
                  <option value="1">First Semester</option>
                  <option value="2">Second Semester</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-calendar text-gray-400"></i>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-redo"></i>
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-search text-gray-400 text-4xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No courses found</h3>
            <p className="text-gray-600 text-lg mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg inline-flex items-center space-x-2"
            >
              <i className="fas fa-redo"></i>
              <span>Clear Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              const courseCredits = course.credits || 0;
              const wouldExceedLimit = totalCredits + courseCredits > MAX_CREDITS;
              const canEnroll = !isEnrolled && !wouldExceedLimit && totalCredits < MAX_CREDITS;

              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border overflow-hidden ${
                    isEnrolled ? 'border-green-200/60 bg-green-50/30' :
                    wouldExceedLimit ? 'border-red-200/60 bg-red-50/30' :
                    'border-gray-200/60 hover:border-blue-200/60'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {course.course_code?.split(' ')[0]}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {isEnrolled ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium flex items-center gap-1">
                            <i className="fas fa-check-circle text-xs"></i>
                            Enrolled
                          </span>
                        ) : wouldExceedLimit ? (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium flex items-center gap-1">
                            <i className="fas fa-times-circle text-xs"></i>
                            Credit Limit
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium flex items-center gap-1">
                            <i className="fas fa-plus-circle text-xs"></i>
                            Available
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {course.semester === 1 ? '1st' : '2nd'} Sem
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.course_code}
                    </h3>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">{course.course_name}</h4>

                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-coins text-blue-500"></i>
                          <span className="font-medium">{course.credits} Credits</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-layer-group text-purple-500"></i>
                          <span>Level {course.level}</span>
                        </div>
                      </div>
                    </div>

                    {isEnrolled ? (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-600 px-4 py-3 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <i className="fas fa-check"></i>
                        <span>Already Enrolled</span>
                      </button>
                    ) : wouldExceedLimit ? (
                      <button
                        disabled
                        title={`Enrolling in this course would exceed the ${MAX_CREDITS} credit limit`}
                        className="w-full bg-gray-300 text-gray-600 px-4 py-3 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <i className="fas fa-ban"></i>
                        <span>Credit Limit</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => showEnrollModal(course)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                      >
                        <i className="fas fa-plus-circle"></i>
                        <span>Enroll Now</span>
                      </button>
                    )}

                    {wouldExceedLimit && !isEnrolled && (
                      <p className="text-red-600 text-xs mt-3 text-center">
                        <i className="fas fa-exclamation-triangle mr-1"></i>
                        Requires {courseCredits} credits ({remainingCredits} available)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-200 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-2">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bookmark text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enroll in Course</h3>
              <p className="text-gray-600">Confirm your course enrollment</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-200">
              <h4 className="font-bold text-lg text-blue-900">{selectedCourse.course_code}</h4>
              <p className="text-blue-700 font-semibold">{selectedCourse.course_name}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <i className="fas fa-coins text-blue-500"></i>
                  <span>{selectedCourse.credits} Credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-layer-group text-purple-500"></i>
                  <span>Level {selectedCourse.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-calendar text-green-500"></i>
                  <span>{selectedCourse.semester === 1 ? 'First' : 'Second'} Semester</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 mb-4 border border-yellow-200">
              <div className="flex items-start gap-3">
                <i className="fas fa-chart-line text-yellow-600 text-lg mt-1"></i>
                <div>
                  <p className="font-semibold text-yellow-800 mb-2">Credit Impact</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Credits:</span>
                      <span className="font-semibold">{totalCredits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>After Enrollment:</span>
                      <span className="font-semibold">{totalCredits + (selectedCourse.credits || 0)}</span>
                    </div>
                    <div className="flex justify-between border-t border-yellow-200 pt-2">
                      <span>Remaining:</span>
                      <span className={`font-bold ${remainingCredits - (selectedCourse.credits || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {remainingCredits - (selectedCourse.credits || 0)} credits
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-center mb-6">Ready to enroll in this course?</p>

            <div className="flex gap-4">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition duration-200 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-times"></i>
                <span>Cancel</span>
              </button>
              <button
                onClick={confirmEnrollment}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-check"></i>
                <span>Enroll Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;