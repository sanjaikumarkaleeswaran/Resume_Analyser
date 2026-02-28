# ResumeMatch AI

> **Free AI-powered ATS Resume Optimizer** — paste your resume + job description, get an optimized version with ATS score in seconds.

## Tech Stack
- **Frontend**: Vite + React + Tailwind CSS → Deployed on Vercel
- **Backend**: Node.js + Express → Deployed on Render
- **Auth + DB + Storage**: Supabase (PostgreSQL + Auth)
- **AI**: Groq (free tier — `llama-3.3-70b-versatile`)

---

## 🗄️ Supabase Database Setup

Run this SQL in your Supabase project's **SQL Editor**:

```sql
-- Create the resume_requests table
CREATE TABLE resume_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  resume_text text,
  job_description text,
  experience_level text,
  professional_summary text,
  optimized_experience text,
  skills_section text,
  keyword_match_score integer,
  missing_keywords text[],
  suggestions text
);

-- Enable Row Level Security
ALTER TABLE resume_requests ENABLE ROW LEVEL SECURITY;

-- Policy: users can only access their own records
CREATE POLICY "Users manage own records"
  ON resume_requests
  FOR ALL
  USING (auth.uid() = user_id);
```

Also in **Supabase Dashboard → Authentication → Settings**:
- Enable **Email/Password** provider
- You can disable "Confirm email" for quick local testing

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key        # From Supabase → Settings → API → service_role
GROQ_API_KEY=your-groq-api-key                    # From https://console.groq.com (free)
GROQ_MODEL=llama-3.3-70b-versatile
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key       # From Supabase → Settings → API → anon key
VITE_API_URL=http://localhost:3001
```

---

## 🚀 Local Development

### 1. Clone and install

```bash
# Backend
cd "d:\AI_Projects\resume maker\backend"
npm install

# Frontend
cd "d:\AI_Projects\resume maker\frontend"
npm install
```

### 2. Set up environment files

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in backend/.env

# Frontend
cp frontend/.env.example frontend/.env
# Fill in frontend/.env
```

### 3. Run the Supabase SQL schema (see above)

### 4. Start both servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173**

---

## 🌐 Deployment

### Frontend → Vercel
1. Push project to GitHub
2. Import frontend folder in Vercel
3. Set **Root Directory** → `frontend`
4. Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL` (your Render URL)
5. Deploy

### Backend → Render
1. Create new **Web Service** → connect GitHub repo
2. Set **Root Directory** → `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Add env vars: all from `backend/.env`
6. Copy the Render URL to Vercel `VITE_API_URL` and backend `FRONTEND_URL`

---

## 📁 Project Structure

```
resume maker/
├── backend/
│   ├── server.js               # Express entry point
│   ├── middleware/
│   │   └── auth.js             # Supabase JWT validation
│   ├── routes/
│   │   ├── optimize.js         # POST /api/optimize
│   │   └── history.js          # GET /api/history
│   └── utils/
│       ├── groq.js             # Groq AI + master prompt
│       └── pdfParser.js        # PDF text extraction
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx  # Supabase auth state
    │   ├── services/
    │   │   ├── supabase.js      # Supabase client
    │   │   └── api.js           # Axios client
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── ResumeForm.jsx
    │   │   ├── ResultsPanel.jsx
    │   │   └── HistoryList.jsx
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Signup.jsx
    │       └── Dashboard.jsx
    ├── tailwind.config.js
    └── index.html
```

---

## ✅ Features

| Feature | Status |
|---------|--------|
| Email/Password Auth | ✅ |
| PDF Upload | ✅ |
| Resume Text Paste | ✅ |
| AI Optimization (Groq) | ✅ |
| ATS Score + Progress Bar | ✅ |
| Tabbed Results | ✅ |
| Copy to Clipboard | ✅ |
| Download as PDF | ✅ |
| Optimization History | ✅ |
| Mobile Responsive | ✅ |
| Dark Mode | ✅ |
| Rate Limiting | ✅ |
