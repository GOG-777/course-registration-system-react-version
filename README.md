# 🎓 Course Registration System - React Version

A modern, full-stack course registration system built with React, Node.js, and PostgreSQL. This is the React version of my IT Defense Project, originally built with vanilla JavaScript.

## 🌟 Features

- **User Authentication** - Secure JWT-based login and registration
- **Course Management** - Browse, search, and enroll in courses
- **Credit Tracking** - Real-time 24-credit limit monitoring
- **CGPA Calculator** - Advanced GPA/CGPA calculation system
- **Responsive Design** - Mobile-friendly with hamburger menu
- **Docker Ready** - Full Docker Compose setup for easy deployment

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios
- Context API

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- bcryptjs

### DevOps
- Docker + Docker Compose
- Nginx

## 📸 Screenshots

-You can view my portfolio: https://gog-portfolio.vercel.app

## 🎯 Key Features Explained

### Credit Limit System
- Maximum 24 credits per enrollment period
- Real-time tracking with visual progress bar
- Prevents over-enrollment

### CGPA Calculator
- Calculate semester GPA or cumulative CGPA
- Supports all 4 levels (100-400)
- Automatic grade calculation based on Nigerian university system

## 📝 API Endpoints
```
POST   /api/auth/register        - User registration
POST   /api/auth/login           - User login
GET    /api/courses              - Get all courses
POST   /api/enrollments/enroll   - Enroll in course
GET    /api/enrollments/my-courses - Get enrolled courses
PUT    /api/enrollments/drop/:id - Drop a course
```

## 🔧 Environment Variables

See `.env.example` and `backend/.env.example` for required variables.

## 👨‍💻 Author/Developer

**Godspresence Goodluck (GOG)**
- GitHub: [@GOG-777](https://github.com/GOG-777)
- Telegram: [@thegenius_001](https://t.me/thegenius_001)
- Twitter: [@thegenius_xyz](https://x.com/thegenius_xyz)

## 📄 License

This project is part of an IT Defense Project submission.

## 🙏 Acknowledgments

Built for academic purposes - IT Defense Project 2026

---

**Original HTML Version:** https://github.com/GOG-777/IT-Defense-Project