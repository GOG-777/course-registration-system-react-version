import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition duration-300">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Course Registration System - GOG
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-4 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200/40">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700">{user?.full_name}</span>
                </div>
                <div className="flex space-x-4">
                  <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition duration-200 group">
                    <i className="fas fa-tachometer-alt group-hover:scale-110 transition-transform"></i>
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/courses" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition duration-200 group">
                    <i className="fas fa-book-open group-hover:scale-110 transition-transform"></i>
                    <span>Courses</span>
                  </Link>
                  <Link to="/cgpa-calculator" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition duration-200 group">
                    <i className="fas fa-calculator group-hover:scale-110 transition-transform"></i>
                    <span>CGPA</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 font-medium transition duration-200 group">
                    <i className="fas fa-sign-out-alt group-hover:scale-110 transition-transform"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-6">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200">
                  Login
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-slide-down">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.full_name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-4 py-3 rounded-xl transition duration-200"
                  >
                    <i className="fas fa-tachometer-alt w-5"></i>
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    to="/courses"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-4 py-3 rounded-xl transition duration-200"
                  >
                    <i className="fas fa-book-open w-5"></i>
                    <span className="font-medium">Courses</span>
                  </Link>
                  <Link
                    to="/cgpa-calculator"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-4 py-3 rounded-xl transition duration-200"
                  >
                    <i className="fas fa-calculator w-5"></i>
                    <span className="font-medium">CGPA Calculator</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl transition duration-200"
                  >
                    <i className="fas fa-sign-out-alt w-5"></i>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block text-center text-gray-700 hover:text-blue-600 font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;