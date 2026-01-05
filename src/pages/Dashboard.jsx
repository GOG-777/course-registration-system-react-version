import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { enrollmentService } from '../services/enrollmentService';
import { courseService } from '../services/courseService';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [courseToDrop, setCourseToDrop] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load enrolled courses
      const enrolledData = await enrollmentService.getMyCourses();
      const enrolled = enrolledData.enrollments?.filter(e => e.status === 'enrolled') || [];
      setEnrolledCourses(enrolled);

      // Load available courses count
      const coursesData = await courseService.getAllCourses();
      setAvailableCount(coursesData.courses?.length || 0);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showDropModal = (courseId) => {
    setCourseToDrop(courseId);
  };

  const closeDropModal = () => {
    setCourseToDrop(null);
  };

  const confirmDrop = async () => {
    if (!courseToDrop) return;

    try {
      await enrollmentService.dropCourse(courseToDrop);
      showToast('Course dropped successfully', 'success');
      closeDropModal();
      // Reload courses
      loadDashboardData();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to drop course', 'error');
      closeDropModal();
    }
  };

  const totalCredits = enrolledCourses.reduce((sum, course) => sum + (course.credits || 0), 0);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="spinner mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading your academic journey...</p>
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-3">Welcome back, {user?.full_name}! 👋</h2>
                <p className="text-blue-100 text-lg mb-4">Ready to continue your academic journey?</p>
                <div className="flex space-x-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <i className="fas fa-id-card text-blue-200"></i>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">Student ID</p>
                      <p className="font-semibold text-white">{user?.student_id || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <i className="fas fa-graduation-cap text-blue-200"></i>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">Academic Level</p>
                      <p className="font-semibold text-white">Level {user?.level || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-8xl opacity-20 transform rotate-12">
                🎓
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Enrolled Courses</p>
                  <div className="text-3xl font-bold text-gray-900">{enrolledCourses.length}</div>
                  <p className="text-green-600 text-sm font-medium mt-1">
                    <i className="fas fa-arrow-up mr-1"></i>
                    Active enrollments
                  </p>
                </div>
                <div className="text-4xl text-blue-500 transform group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-book"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Credits</p>
                  <div className="text-3xl font-bold text-gray-900">{totalCredits}</div>
                  <p className="text-blue-600 text-sm font-medium mt-1">
                    <i className="fas fa-chart-line mr-1"></i>
                    Academic progress
                  </p>
                </div>
                <div className="text-4xl text-green-500 transform group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Available Courses</p>
                  <div className="text-3xl font-bold text-gray-900">{availableCount}</div>
                  <p className="text-purple-600 text-sm font-medium mt-1">
                    <i className="fas fa-plus-circle mr-1"></i>
                    Ready to enroll
                  </p>
                </div>
                <div className="text-4xl text-purple-500 transform group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-gem"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">My Enrolled Courses</h3>
              <p className="text-gray-600 text-lg">Manage your current academic journey</p>
            </div>
            <Link
              to="/courses"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg transform hover:scale-[1.02] flex items-center space-x-2"
            >
              <i className="fas fa-plus-circle"></i>
              <span>Browse Courses</span>
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-book-open text-blue-500 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No courses enrolled yet</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">Start your academic journey by enrolling in available courses.</p>
              <Link
                to="/courses"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg inline-flex items-center space-x-2"
              >
                <i className="fas fa-rocket"></i>
                <span>Explore Courses</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/60 group hover:border-blue-200/60"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {course.course_code?.split(' ')[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-xl text-gray-900">{course.course_code}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium flex items-center gap-1">
                              <i className="fas fa-check-circle text-xs"></i>
                              Enrolled
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                              {course.credits || 0} Credits
                            </span>
                          </div>
                        </div>
                      </div>
                      <h5 className="font-semibold text-gray-800 text-lg mb-3">{course.course_name}</h5>
                      <p className="text-gray-600 mb-4 leading-relaxed">{course.description || 'Comprehensive course covering essential concepts and practical applications.'}</p>
                      <div className="flex gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-layer-group text-blue-500"></i>
                          <span>Level {course.level || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-calendar text-purple-500"></i>
                          <span>Semester {course.semester === 1 ? '1' : '2'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-star text-yellow-500"></i>
                          <span>{course.credits || 0} Credit Units</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => showDropModal(course.id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition duration-300 shadow-lg transform group-hover:scale-105 ml-6 flex items-center space-x-2"
                    >
                      <i className="fas fa-trash-alt"></i>
                      <span>Drop</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drop Course Modal */}
      {courseToDrop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeDropModal}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-200 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-2">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Drop Course?</h3>
              <p className="text-gray-600 mb-4">This action will remove the course from your current enrollments.</p>
            </div>
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-red-700 text-sm"><i className="fas fa-info-circle mr-2"></i>You can re-enroll later if needed</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={closeDropModal}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition duration-200 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-times"></i>
                <span>Cancel</span>
              </button>
              <button
                onClick={confirmDrop}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition duration-200 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-trash-alt"></i>
                <span>Drop Course</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;