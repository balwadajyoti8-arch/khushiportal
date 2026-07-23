# Interview Preparation Portal

A comprehensive interview preparation platform for students and job seekers to prepare for placements and internships with coding question banks, MCQ mock tests, interview scheduling, analytics, and interview experiences from top companies.

## Features

- **Dynamic Topic System** - LeetCode-like topic-based question organization
- **Coding Question Bank** - 200+ coding questions with filters and progress tracking
- **MCQ Tests** - Mock tests with multiple topics and difficulty levels
- **Company Bank** - Interview experiences and preparation tips for top companies
- **Mock Interviews** - Schedule and manage mock interviews with feedback
- **Progress Analytics** - Track your preparation progress with detailed analytics
- **Bookmarks & Notes** - Save important questions and add personal notes
- **Dark Mode** - Modern dark mode support throughout the application
- **Admin Dashboard** - Complete admin panel for content management

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- Lucide Icons
- Recharts

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- CORS
- Helmet (Security)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/Khushibharuwala/interview-preparation.git
cd interview-preparation
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Setup environment variables

**Backend (.env):**
```
PORT=5000
MONGO_URI=mongodb+srv://admin:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/interview-portal?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

5. Seed the database
```bash
cd backend
node scripts/seed.js
```

6. Start the backend server
```bash
cd backend
npm run dev
```

7. Start the frontend server
```bash
cd frontend
npm run dev
```

8. Open your browser
```
http://localhost:5173
```

## Default Credentials

### Admin Account
- Email: admin@interviewportal.com
- Password: adminpassword

### Student Account
- Email: student@interviewportal.com
- Password: studentpassword

## Project Structure

```
interview-preparation/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── public/
└── README.md
```

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For any queries, please contact the project maintainers.
