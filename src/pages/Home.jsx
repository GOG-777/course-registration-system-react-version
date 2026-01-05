import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { courseService } from '../services/courseService';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        // Initialize AOS
        if (window.AOS) {
            window.AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
        }

        // Load courses preview
        loadCoursePreview();
    }, []);

    const loadCoursePreview = async () => {
        try {
            const data = await courseService.getAllCourses();
            setCourses(data.courses?.slice(0, 6) || []);
        } catch (error) {
            console.error('Failed to load courses:', error);
        }
    };

    return (
        <div className="bg-white overflow-x-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full blur-3xl opacity-10 animate-pulse delay-500"></div>
            </div>

            <Navigation />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
                    <div className="absolute top-1/4 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-300"></div>
                    <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full animate-bounce delay-700"></div>
                    <div className="absolute bottom-10 right-10 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div data-aos="fade-right" data-aos-duration="1000">
                            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30">
                                <i className="fas fa-star text-yellow-300 mr-2"></i>
                                <span className="text-sm font-medium">Trusted by 5,000+ Students</span>
                            </div>
                            <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                                Streamline Your
                                <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent animate-pulse">
                                    {' '}Academic Journey
                                </span>
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Experience seamless course registration, real-time GPA tracking, and intelligent scheduling all
                                in one platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/register"
                                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center group"
                                >
                                    <i className="fas fa-rocket mr-2 group-hover:rotate-45 transition-transform"></i>
                                    Start Your Journey
                                </Link>
                                <a
                                    href="#features"
                                    className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition duration-300 text-center group"
                                >
                                    <i className="fas fa-play-circle mr-2 group-hover:scale-110 transition-transform"></i>
                                    Learn More
                                </a>
                            </div>
                        </div>
                        <div className="relative" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition duration-500">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/20 transform hover:scale-110 transition duration-300">
                                        <i className="fas fa-book-open text-4xl mb-3 text-blue-200"></i>
                                        <h3 className="font-bold text-2xl">200+</h3>
                                        <p className="text-sm text-blue-100">Courses</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500/30 to-cyan-500/30 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/20 transform hover:scale-110 transition duration-300 delay-100">
                                        <i className="fas fa-users text-4xl mb-3 text-green-200"></i>
                                        <h3 className="font-bold text-2xl">5,000+</h3>
                                        <p className="text-sm text-green-100">Students</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/20 transform hover:scale-110 transition duration-300 delay-200">
                                        <i className="fas fa-chart-line text-4xl mb-3 text-yellow-200"></i>
                                        <h3 className="font-bold text-2xl">98%</h3>
                                        <p className="text-sm text-yellow-100">Satisfaction</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-500/30 to-pink-500/30 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/20 transform hover:scale-110 transition duration-300 delay-300">
                                        <i className="fas fa-bolt text-4xl mb-3 text-red-200"></i>
                                        <h3 className="font-bold text-2xl">Instant</h3>
                                        <p className="text-sm text-red-100">Enrollment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 pattern-bg"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-20" data-aos="fade-up">
                        <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Designed for modern students who value efficiency, clarity, and control over their academic path.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: 'fa-bolt',
                                color: 'from-blue-500 to-blue-600',
                                title: 'Lightning Fast',
                                description: 'Register for courses in seconds with our optimized interface. No more waiting in virtual lines.',
                                features: ['Instant enrollment', 'Real-time updates', 'Mobile optimized']
                            },
                            {
                                icon: 'fa-chart-pie',
                                color: 'from-green-500 to-emerald-600',
                                title: 'Smart Analytics',
                                description: 'Track your academic performance with real-time GPA calculations and progress insights.',
                                features: ['Live GPA tracking', 'Progress analytics', 'Performance insights']
                            },
                            {
                                icon: 'fa-robot',
                                color: 'from-purple-500 to-indigo-600',
                                title: 'Intelligent Planning',
                                description: 'Avoid conflicts and optimize your schedule with our smart course planning tools.',
                                features: ['Conflict detection', 'Credit tracking', 'Schedule optimization']
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition duration-500 border border-gray-100/50 transform hover:scale-105 group"
                                data-aos="fade-up"
                                data-aos-delay={index * 200}
                            >
                                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                                    <i className={`fas ${feature.icon} text-white text-3xl`}></i>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                                <ul className="space-y-3 text-gray-600">
                                    {feature.features.map((item, idx) => (
                                        <li key={idx} className="flex items-center group">
                                            <i className="fas fa-check text-green-500 mr-3 text-lg group-hover:scale-125 transition-transform"></i>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Course Preview Section */}
            <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20" data-aos="fade-up">
                        <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Featured Courses
                        </h2>
                        <p className="text-xl text-gray-600">
                            Explore our comprehensive curriculum designed for future innovators
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="200">
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition duration-500 border border-gray-100/50 overflow-hidden group transform hover:scale-105"
                                    data-aos="zoom-in"
                                >
                                    <div className="p-8">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition duration-300 shadow-lg">
                                                <i className="fas fa-book text-white text-xl"></i>
                                            </div>
                                            <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm rounded-full font-medium shadow-lg">
                                                {course.credits} Credits
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-2xl text-gray-900 mb-3">{course.course_code}</h4>
                                        <h5 className="font-semibold text-gray-700 text-lg mb-4">{course.course_name}</h5>
                                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-2">
                                            {course.description || 'Comprehensive course covering essential concepts and practical applications.'}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span className="flex items-center group">
                                                <i className="fas fa-layer-group mr-2 group-hover:scale-110 transition-transform"></i>
                                                Level {course.level}
                                            </span>
                                            <span className="flex items-center group">
                                                <i className="fas fa-calendar mr-2 group-hover:scale-110 transition-transform"></i>
                                                Sem {course.semester}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-t border-gray-100">
                                        <Link
                                            to="/login"
                                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center justify-center group"
                                        >
                                            View Details
                                            <i className="fas fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform duration-300"></i>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-16" data-aos="zoom-in">
                                <div className="text-8xl mb-6 text-gray-300 animate-pulse">📚</div>
                                <h3 className="text-2xl font-semibold text-gray-600 mb-3">Courses Coming Soon</h3>
                                <p className="text-gray-500 text-lg">Our course catalog will be available shortly.</p>
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="400">
                        <Link
                            to="/login"
                            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 group"
                        >
                            <i className="fas fa-lock-open mr-3 text-lg group-hover:rotate-12 transition-transform"></i>
                            Sign In to Browse All Courses
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-ping"></div>
                        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-ping delay-700"></div>
                        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-ping delay-300"></div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10" data-aos="zoom-in">
                    <h2 className="text-5xl font-bold mb-8">Ready to Transform Your Academic Experience?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of students who are already managing their courses efficiently with our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-semibold hover:bg-blue-50 transition duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 group"
                        >
                            <i className="fas fa-user-plus mr-3 group-hover:scale-110 transition-transform"></i>
                            Create Account
                        </Link>
                        <Link
                            to="/login"
                            className="border-2 border-white text-white px-10 py-5 rounded-2xl font-semibold hover:bg-white hover:text-blue-600 transition duration-300 transform hover:scale-105 group"
                        >
                            <i className="fas fa-sign-in-alt mr-3 group-hover:scale-110 transition-transform"></i>
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-4 gap-10">
                        <div data-aos="fade-right">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <i className="fas fa-graduation-cap text-white text-xl"></i>
                                </div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Course Registration System - GOG
                                </h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Empowering students with modern academic management tools for a brighter future.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="100">
                            <h4 className="font-semibold text-lg mb-6 text-white">Platform</h4>
                            <ul className="space-y-3 text-gray-400">
                                <li>
                                    <Link to="/courses" className="hover:text-white transition duration-200 hover:translate-x-2 transform block">
                                        <i className="fas fa-book-open mr-2"></i>Course Catalog
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/cgpa-calculator" className="hover:text-white transition duration-200 hover:translate-x-2 transform block">
                                        <i className="fas fa-calculator mr-2"></i>GPA Calculator
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard" className="hover:text-white transition duration-200 hover:translate-x-2 transform block">
                                        <i className="fas fa-tachometer-alt mr-2"></i>Student Dashboard
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="200">
                            <h4 className="font-semibold text-lg mb-6 text-white">About Project</h4>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-center">
                                    <i className="fas fa-code mr-2"></i>
                                    <span>Full-Stack Web Application</span>
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-database mr-2"></i>
                                    <span>PostgreSQL Database</span>
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-shield-alt mr-2"></i>
                                    <span>JWT Authentication</span>
                                </li>
                            </ul>
                        </div>

                        <div data-aos="fade-left" data-aos-delay="300">
                            <h4 className="font-semibold text-lg mb-6 text-white">Connect</h4>
                            <div className="flex space-x-4 mb-6">
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://t.me/thegenius_001"
                                    className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-500 transition duration-300 transform hover:scale-110 shadow-lg"
                                >
                                    <i className="fab fa-telegram"></i>
                                </a>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://github.com/GOG-777"
                                    className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition duration-300 transform hover:scale-110 shadow-lg"
                                >
                                    <i className="fab fa-github"></i>
                                </a>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://x.com/thegenius_xyz"
                                    className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition duration-300 transform hover:scale-110 shadow-lg"
                                >
                                    <i className="fab fa-twitter"></i>
                                </a>
                            </div>

                            <div className="text-gray-400 text-sm">
                                <p className="mb-2">
                                    <i className="fas fa-envelope mr-2"></i>
                                    <a href="mailto:goodluckgodspresence28@gmail.com" className="hover:text-white transition">
                                        goodluckgodspresence28@gmail.com
                                    </a>
                                </p>
                                <p>
                                    <i className="fas fa-graduation-cap mr-2"></i>
                                    IT Defense Project Submission
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400" data-aos="fade-up">
                        <p>&copy; {currentYear} Course Registration System - GOG. IT Defense Project. By Godspresence Goodluck.</p>   </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;