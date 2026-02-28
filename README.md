# ResumeMatch AI

> **Free AI-powered ATS Resume Optimizer** — upload your resume, paste a job description, and get a professionally rewritten version with an ATS keyword score in seconds.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + Vite + Tailwind CSS |
| **Backend** | Node.js + Express 5 |
| **Database** | MongoDB Atlas (via Mongoose) |
| **Authentication** | Custom JWT (JSON Web Tokens) |
| **AI Engine** | Groq API — `llama-3.3-70b-versatile` (free tier) |
| **PDF Parsing** | `pdf-parse` |
| **Security** | Helmet, Rate Limiting, bcryptjs |

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Email / Password Sign Up & Login | ✅ |
| JWT-based Protected Routes | ✅ |
| PDF Resume Upload (up to 5MB) | ✅ |
| Resume Text Paste | ✅ |
| AI-powered Resume Rewriting (Groq) | ✅ |
| ATS Keyword Match Score (0–100) | ✅ |
| Missing Keywords Detection | ✅ |
| Professional Summary Generation | ✅ |
| Optimized Experience Bullets | ✅ |
| Skills Section Rewrite | ✅ |
| Improvement Suggestions | ✅ |
| Copy to Clipboard | ✅ |
| Download Result as PDF | ✅ |
| Optimization History (last 20) | ✅ |
| Mobile Responsive | ✅ |
| Dark Mode UI | ✅ |
| Rate Limiting (DoS protection) | ✅ |

---

## ⚙️ Environment Variables

The project uses a **single shared `.env` file** at the root directory that powers both the frontend and the backend.

Create a `.env` file in the root of the project:

```env
# ============================================================
# ResumeMatch AI — Shared .env (frontend + backend)
# ============================================================

# --- MongoDB Atlas ---
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# --- JWT Secret (use a long random string in production) ---
JWT_SECRET=your_super_secret_jwt_key_here

# --- Groq AI (free at https://console.groq.com) ---
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# --- Server ---
PORT=3001
FRONTEND_URL=http://localhost:5173

# --- Frontend (Vite reads VITE_ prefixed vars) ---
VITE_API_URL=http://localhost:3001
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore` by default.

---

## 🛠️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/your-username/resume-maker.git
cd resume-maker
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend (open a new terminal)
cd frontend
npm install
```

### 3. Set up your environment

Create the `.env` file in the **root** of the project (see the template above) and fill in your:
- MongoDB Atlas connection string
- JWT secret key
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 4. Start both servers

```bash
# Terminal 1 — Backend (runs on http://localhost:3001)
cd backend
npm run dev

# Terminal 2 — Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 🌐 Deployment

### Frontend → Vercel
1. Push project to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Set **Root Directory** → `frontend`
4. Add environment variable: `VITE_API_URL` = your Render backend URL
5. Click **Deploy**

### Backend → Render
1. Go to [render.com](https://render.com) → **New Web Service** → Connect your GitHub repo
2. Set **Root Directory** → `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Add all environment variables from your `.env` file:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GROQ_API_KEY`
   - `GROQ_MODEL`
   - `PORT`
   - `FRONTEND_URL` (your Vercel URL)
6. Copy the Render backend URL and paste it into your Vercel `VITE_API_URL` variable

---

## 📁 Project Structure

```
resume-maker/
├── .env                          # Shared env file (not committed)
├── .gitignore
├── README.md
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # Mongoose User schema (bcrypt hashed passwords)
│   │   └── ResumeRequest.js      # Mongoose Resume optimization record schema
│   ├── routes/
│   │   ├── auth.js               # POST /api/auth/signup, /login, GET /api/auth/me
│   │   ├── optimize.js           # POST /api/optimize (PDF upload + AI processing)
│   │   └── history.js            # GET /api/history (last 20 optimizations)
│   └── utils/
│       ├── groq.js               # Groq AI client + master ATS prompt
│       └── pdfParser.js          # pdf-parse wrapper for PDF text extraction
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx               # Routes + AuthProvider wrapper
        ├── context/
        │   └── AuthContext.jsx   # Global JWT auth state (login, signup, logout)
        ├── services/
        │   └── api.js            # Axios client with JWT interceptor
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── ResumeForm.jsx
        │   ├── ResultsPanel.jsx
        │   └── HistoryList.jsx
        └── pages/
            ├── Login.jsx
            ├── Signup.jsx
            └── Dashboard.jsx
```

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT |
| `GET` | `/api/auth/me` | ✅ | Get current logged-in user |
| `POST` | `/api/optimize` | ✅ | Upload PDF or paste text + job description → get AI result |
| `GET` | `/api/history` | ✅ | Fetch the last 20 optimization records |
| `GET` | `/health` | ❌ | Health check |

---

## 📄 License

MIT — Free to use and modify.
