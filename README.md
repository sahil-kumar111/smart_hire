# 🤖 SmartHire AI

### AI-Powered Recruitment Platform with Resume Analysis, JD Matching, Mock Interviews, Real-Time Monitoring & Analytics

**An intelligent recruitment and interview-preparation platform that uses Artificial Intelligence to automate resume analysis, match resumes with Job Descriptions, conduct type-specific AI mock interviews (HR / Technical / Managerial), monitor candidate performance in real time, and generate comprehensive interview analytics.**

---

# 📑 Table of Contents

* [Project Overview](#-project-overview)
* [Objectives](#-objectives)
* [Key Features](#-key-features)
* [System Architecture](#-system-architecture)
* [Technology Stack](#-technology-stack)
* [Artificial Intelligence Stack](#-artificial-intelligence-stack)
* [AI Workflow](#-ai-workflow)
* [Database Design](#-database-design)
* [Security Features](#-security-features)
* [Project Structure](#-project-structure)
* [REST API Documentation](#-rest-api-documentation)
* [Installation Guide](#-installation-guide)
* [Environment Variables](#-environment-variables)
* [Recommended Test Flow](#-recommended-test-flow)
* [Screenshots](#-screenshots)
* [Milestone Progress](#-milestone-progress)
* [Troubleshooting](#-troubleshooting)
* [Deployment](#-deployment)
* [Project Status](#-project-status)
* [Documentation](#-documentation)
* [Author](#-author)

---

# 📌 Project Overview

SmartHire AI is a full-stack AI-powered recruitment and interview-preparation platform.

It enables:

* **Candidates** to upload resumes, perform AI analysis, match resumes with Job Descriptions, take type-specific AI mock interviews, and view analytics and feedback reports.
* **Recruiters** to review completed interviews, view analytics, download PDF reports, and shortlist candidates.
* **Administrators** to view platform users and role-based statistics.

The platform combines modern web development with Generative AI, Speech Processing, Computer Vision, and Natural Language Processing to deliver a realistic and intelligent interview experience.

**Current release status**

| Layer | Status |
|-------|--------|
| Application features | Complete |
| Frontend | Deployed on **Vercel** |
| Backend API | Local FastAPI |
| Database | Local PostgreSQL |
| Public API access | **ngrok** tunnel to local backend |

---

# 🎯 Objectives

The primary objectives of SmartHire AI are:

* Build a secure multi-role AI-powered recruitment platform.
* Analyze resumes using Large Language Models.
* Support Job Description storage and Resume ↔ JD matching.
* Conduct HR, Technical, and Managerial AI mock interviews.
* Evaluate candidate responses automatically.
* Monitor speech, emotion, eye contact, and fluency.
* Provide analytics, feedback, and PDF reports.
* Support recruiter shortlisting workflows.
* Provide administrators with platform user visibility.
* Deploy the frontend publicly and operate the API in a documented hybrid setup.
* Keep the architecture ready for full cloud hosting of API and database.

---

# ✨ Key Features

## 🔐 Authentication & Roles

* User Registration with role selection (Candidate / Recruiter / Admin)
* Secure Login with role verification
* JWT Authentication
* BCrypt Password Hashing
* Protected Routes
* Role-Based Access Control (RBAC)
* Current user profile access
* Secure account deletion
* Logout functionality

---

## 📄 Resume Management

* Upload PDF resumes
* Secure resume storage
* Resume text extraction
* Resume listing / download / deletion
* Cascade-safe related data cleanup
* Multiple resume support
* Owner-restricted resume access

---

## 🤖 AI Resume Analysis

Powered by **Groq LLM**.

Automatically extracts and analyzes:

* Technical Skills, Soft Skills
* Programming Languages, Frameworks, Tools
* Databases, Cloud Technologies
* Certifications, Education, Work Experience, Projects

---

## 🧾 Job Description & Resume Matching

* Save / update / load Job Description
* Resume ↔ JD comparison using an LLM
* Match score, matching skills, missing skills, fit summary

---

## 🎤 AI Mock Interviews

Interview types:

* HR Interview
* Technical Interview
* Managerial Interview

Supports:

* Conversational AI interviews
* Resume-based and type-specific questioning
* Adaptive follow-ups
* Text and voice answers
* Session tracking (`IN_PROGRESS` / `COMPLETED`)
* AI answer evaluation
* Multiple attempts

---

## 🎥 AI Interview Monitoring

* Webcam and microphone monitoring
* Speech-to-Text and transcripts
* Emotion detection
* Eye contact detection
* Filler-word detection and fluency analysis
* Overall monitoring score and AI recommendation
* Monitoring reports and timeline snapshots

---

## 📊 Analytics & Feedback

* Overall score, fluency, eye contact, fillers, emotion
* Score timeline and transcript history
* AI feedback (strengths, weaknesses, suggestions)
* Interview history and progress views
* PDF interview reports

---

## 🧑‍💼 Recruiter Dashboard

* View completed sessions
* Search and score filters
* Open analytics / download PDF
* Shortlist status: Pending / Shortlisted / Rejected (persisted in DB)

---

## 🛡️ Admin Dashboard

* Platform user statistics
* List / search users
* Filter by role

---

# 🏗️ System Architecture

```text
                 +---------------------------+
                 |     React Frontend        |
                 |  TypeScript + Tailwind    |
                 |  (Vercel production)      |
                 +------------+--------------+
                              |
                    REST API (Axios)
                    VITE_API_URL
                              |
                 +------------v--------------+
                 |   ngrok (optional live)   |
                 +------------+--------------+
                              |
                 +------------v--------------+
                 |      FastAPI Backend      |
                 | Auth • Resume • JD        |
                 | Interview • Monitoring    |
                 | Analytics • Shortlist     |
                 | (local / future cloud)    |
                 +------------+--------------+
                              |
         ----------------------------------------
         |                  |                   |
+--------v------+   +-------v-------+   +-------v--------+
| PostgreSQL DB |   |   Groq API    |   |   AI Models    |
| Users         |   | Resume AI     |   | Whisper        |
| Resumes       |   | JD Match      |   | DeepFace       |
| Interviews    |   | Interview AI  |   | MediaPipe      |
| Shortlists    |   | Feedback      |   | OpenCV         |
+---------------+   +---------------+   +----------------+
```

---

# ⚙️ Technology Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React | User Interface |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router DOM | Routing |
| Axios | API Communication |
| React Webcam | Camera Integration |
| Lucide React | Icons |
| Recharts | Data Visualization |
| Vercel | Production frontend hosting |

## Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | REST API Framework |
| Python | Backend language |
| SQLAlchemy | ORM |
| Alembic | Migrations |
| PostgreSQL | Database |
| Pydantic | Validation |
| JWT | Authentication |
| Passlib / BCrypt | Password Hashing |
| Uvicorn | ASGI Server |

---

# 🤖 Artificial Intelligence Stack

## Large Language Model

**Groq API** for:

- Resume analysis
- Resume ↔ JD matching
- Interview conversation and adaptive questions
- Answer evaluation and feedback

## Speech Processing

**OpenAI Whisper** for speech-to-text and transcript support.

## Emotion Recognition

**DeepFace** for facial emotion analysis.

## Eye Contact Detection

**MediaPipe Face Mesh** and **OpenCV** for landmarks and attention estimation.

---

# 🧠 AI Workflow

```text
Resume Upload
      │
      ▼
Resume Parsing
      │
      ▼
Resume Analysis (Groq)
      │
      ▼
Optional Job Description Save
      │
      ▼
Resume ↔ JD Matching
      │
      ▼
Select Interview Type (HR / Technical / Managerial)
      │
      ▼
Create Interview Session
      │
      ▼
Conversational AI Interview
      │
      ▼
Speech + Webcam Monitoring
      ├── Speech-to-Text
      ├── Filler Detection
      ├── Fluency Analysis
      ├── Emotion Detection
      └── Eye Contact Detection
      │
      ▼
AI Answer Evaluation
      │
      ▼
Analytics / Feedback / PDF Report
```

---

# 🗄️ Database Design

| Table | Description |
|-------|-------------|
| users | Platform users with roles |
| resumes | Uploaded resumes |
| resume_analysis | AI-generated resume insights |
| job_descriptions | Job Description text per user |
| interview_questions | Generated interview questions |
| interview_sessions | Sessions with type and status |
| interview_conversations | Conversational history |
| interview_answers | Candidate answers |
| interview_evaluations | AI evaluations |
| interview_monitor_reports | Final monitoring report |
| interview_monitor_snapshots | Timeline snapshots |
| recruiter_shortlists | Recruiter decisions |

See `docs/DatabaseDesign.md` and `docs/ERDiagram.md` for full details.

---

# 🔒️ Security Features

- JWT authentication and BCrypt password hashing
- Role-Based Access Control
- Protected API endpoints and frontend routes
- Owner-restricted resume access
- Role-restricted recruiter and admin features
- Pydantic validation and SQLAlchemy ORM
- Secrets via environment variables (`.env` not committed)
- Secure account deletion with related data cleanup
- CORS configured for local and Vercel origins

---

# 📁 Project Structure

```text
SmartHire-AI
│
├── backend
│   ├── alembic
│   ├── app
│   │   ├── ai
│   │   ├── api
│   │   ├── auth
│   │   ├── core
│   │   ├── database
│   │   ├── models
│   │   ├── repositories
│   │   ├── schemas
│   │   ├── services
│   │   ├── utils
│   │   └── main.py
│   ├── uploads
│   ├── reports
│   ├── requirements.txt
│   └── .env                  
│
├── frontend
│   ├── public
│   ├── src
│   ├── package.json
│   └── vite.config.ts
│
├── docs
│   ├── ProjectScope.md
│   ├── FunctionalRequirements.md
│   ├── NonFunctionalRequirements.md
│   ├── DatabaseDesign.md
│   ├── ERDiagram.md
│   ├── UIWireframes.md
│   ├── UserWorkflows.md
│   └── Deployment.md
│
├── screenshots
├── .gitignore
└── README.md
```

---

# 🌐 REST API Documentation

## Local base URL

```text
http://127.0.0.1:8000/api/v1
```

## Live hybrid base URL (example)

```text
https://xxxx.ngrok-free.dev/api/v1
```

Use Swagger at `/docs` for live confirmation of routes.

### Authentication & User APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register with role |
| POST | `/auth/login` | Login |
| GET | `/users/me` | Current user |
| DELETE | `/users/me` | Delete own account |
| GET | `/users` | List users (Admin) |

### Resume APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resume/upload` | Upload resume |
| GET | `/resume/me` | List resumes |
| GET | `/resume/{id}` | Resume details |
| GET | `/resume/download/{id}` | Download |
| GET | `/resume/analyze/{id}` | Analyze |
| DELETE | `/resume/{id}` | Delete |

### Job Description APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/job-description` | Save JD |
| GET | `/job-description` | Get JD |
| POST | `/job-description/match/{resume_id}` | Match resume |

### Interview APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/interview/start/{resume_id}` | Start (with type) |
| POST | `/interview/chat/{session_id}` | Chat turn |
| POST | `/interview/finish/{session_id}` | Finish |
| GET | `/interview/sessions` | Sessions |
| GET | `/interview/report/{session_id}` | Report |

### Monitoring & Analytics APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/interview-monitor/analyze` | Analyze media |
| GET | `/interview-monitor/history` | History |
| GET | `/interview-monitor/analytics/{session_id}` | Analytics |
| GET | `/feedback/{session_id}` | Feedback |
| GET | `/report/{session_id}` | PDF report |

### Recruiter Shortlist APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recruiter/shortlist` | List statuses |
| POST | `/recruiter/shortlist` | Create/update status |

---

# ⚙️ Installation Guide

## Prerequisites

- Python 3.10+
- Node.js 20+
- PostgreSQL 15+
- Git
- (Optional for live Vercel access) ngrok

```bash
python --version
node --version
npm --version
psql --version
git --version
```

---

# 📥 Clone Repository

```bash
git clone https://github.com/SohamDey2005/SmartHire-AI.git
cd SmartHire-AI
```

---

# 🐍 Backend Setup

```bash
cd backend
python -m venv .venv
```

**Windows**

```bash
.venv\Scripts\activate
```

**Linux / macOS**

```bash
source .venv/bin/activate
```

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

---

# 🔐 Environment Variables

Create `backend/.env`:

```env
APP_NAME=SmartHire AI
APP_VERSION=1.0.0
DEBUG=True
HOST=0.0.0.0
PORT=8000

SECRET_KEY=your_long_random_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/smarthire_ai

FRONTEND_URL=http://localhost:5173

GROQ_API_KEY=your_groq_api_key
```

For hybrid live access, set `FRONTEND_URL` to your Vercel URL after deployment.

**Do not commit `.env`.**

Frontend local environment (`frontend/.env`):

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

Vercel production environment:

```text
VITE_API_URL=https://YOUR-NGROK-HOST/api/v1
```

---

# 🐘 PostgreSQL Setup

```sql
CREATE DATABASE smarthire_ai;
```

```bash
cd backend
alembic upgrade head
```

---

# 🚀 Start Backend

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`

---

# ⚛️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

Production build check:

```bash
npm run build
```

---

# 📂 Upload & Report Directories

```text
backend/uploads/resumes/
backend/uploads/audio/
backend/uploads/images/
backend/reports/
```

---

# 🧪 Recommended Test Flow

1. Register as Candidate → login
2. Upload PDF resume → analyze
3. Save Job Description → run match
4. Select HR / Technical / Managerial → start interview
5. Allow mic/camera → complete interview
6. Review analytics, feedback, PDF
7. Login as Recruiter → shortlist a session
8. Login as Admin → view users

---

# 📸 Screenshots

### Home Page

<img src="screenshots/home.png" alt="Home Page">

### Login Page

<img src="screenshots/login.png" alt="Login Page">

### Registration Page

<img src="screenshots/register.png" alt="Registration Page">

### Candidate Dashboard

<img src="screenshots/candidate-dashboard.png" alt="Candidate Dashboard">

### Resume Analysis

<img src="screenshots/resume-analysis.png" alt="Resume Analysis">

### Job Description + Match

<img src="screenshots/jd-match.png" alt="JD Match">

### Interview Type Selection

<img src="screenshots/interview-type.png" alt="Interview Type">

### Interview Room

<img src="screenshots/interview-room.png" alt="Interview Room">

### Interview Analytics

<img src="screenshots/interview-analytics.png" alt="Interview Analytics">

### AI Feedback

<img src="screenshots/ai-feedback.png" alt="AI Feedback">

### Recruiter Dashboard

<img src="screenshots/recruiter-dashboard.png" alt="Recruiter Dashboard">

### Admin Dashboard

<img src="screenshots/admin-dashboard.png" alt="Admin Dashboard">

---

# 📈 Milestone Progress

## ✅ Milestone 1 — Foundation

Requirements, database, auth, RBAC, resume management, candidate dashboard foundation.

## ✅ Milestone 2 — AI Recruitment Engine

Resume parsing/analysis, interview generation, sessions, answer evaluation.

## ✅ Milestone 3 — AI Monitoring

Speech-to-text, emotion, eye contact, fillers, fluency, monitoring reports/snapshots, analytics.

## ✅ Milestone 4 — Platform Completion

JD + match, interview types, recruiter shortlisting, admin dashboard, account deletion, documentation, **frontend deploy on Vercel**, hybrid live API via **ngrok**.

## ⏳ Optional next

Always-on **cloud backend + managed PostgreSQL** (no local PC/ngrok required).

---

# 🛠️ Troubleshooting

**PostgreSQL connection** — service running, DB exists, `DATABASE_URL` correct.

**Module not found** — activate venv, run `pip install -r requirements.txt`.

**Frontend install issues** — delete `node_modules`, reinstall.

**Camera / mic** — grant permissions; prefer Chrome/Edge; HTTPS is required on a public site.

**AI features** — valid `GROQ_API_KEY`, backend running, network available.

**Vercel site cannot reach API** — backend + ngrok running; `VITE_API_URL` matches the current ngrok URL + `/api/v1`; redeploy after environment-variable changes; CORS allows the Vercel origin.

---

# 🚀 Deployment

## Current (hybrid) model

```text
Vercel (Frontend)
        │
        ▼
ngrok HTTPS URL
        │
        ▼
Local FastAPI (0.0.0.0:8000)
        │
        ▼
Local PostgreSQL
```

### Daily live checklist

- [ ] Start PostgreSQL
- [ ] Start backend: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
- [ ] Start ngrok: `ngrok http 8000`
- [ ] If ngrok URL changed → update Vercel `VITE_API_URL` → redeploy
- [ ] Open the Vercel site

Full details: `docs/Deployment.md`

### Future (optional full cloud)

```text
Vercel Frontend → Cloud FastAPI → Managed PostgreSQL
```

Possible targets: Render / Railway / AWS for API; managed PostgreSQL; Docker + CI/CD.

---

# 📊 Project Status

| Category | Status |
|----------|--------|
| Frontend | ✅ Completed |
| Backend | ✅ Completed |
| Database | ✅ Completed |
| Authentication + Roles | ✅ Completed |
| Resume Management | ✅ Completed |
| Resume Analysis | ✅ Completed |
| Job Description + Match | ✅ Completed |
| Interview Types | ✅ Completed |
| Conversational Interviews | ✅ Completed |
| Interview Monitoring | ✅ Completed |
| Speech / Emotion / Eye Contact | ✅ Completed |
| Analytics / Feedback / PDF | ✅ Completed |
| Recruiter Shortlisting | ✅ Completed |
| Admin User View | ✅ Completed |
| Account Deletion | ✅ Completed |
| Documentation | ✅ Completed |
| Frontend deploy (Vercel) | ✅ Completed |
| Hybrid live API (ngrok) | ✅ Completed |
| Full cloud backend + DB | ⏳ Optional |

---

# 📚 Documentation

| Document | Description |
|----------|-------------|
| `docs/ProjectScope.md` | Scope, objectives, modules |
| `docs/FunctionalRequirements.md` | Functional requirements |
| `docs/NonFunctionalRequirements.md` | Quality attributes |
| `docs/DatabaseDesign.md` | Schema design |
| `docs/ERDiagram.md` | ER diagram |
| `docs/UIWireframes.md` | UI wireframes |
| `docs/UserWorkflows.md` | User and operator workflows |
| `docs/Deployment.md` | Hybrid Vercel + local API + ngrok |

---

# 👨‍💻 Author

**Soham Dey**

B.E. Computer Science & Engineering  
University Institute of Technology, The University of Burdwan

Machine Learning • Artificial Intelligence • Full-Stack Development

- GitHub: https://github.com/SohamDey2005
- LinkedIn: https://www.linkedin.com/in/sohamdeydurgapur

---

# ⭐ Summary

SmartHire AI is a complete AI-powered interview and recruitment support platform integrating multi-role authentication, resume analysis, JD matching, type-specific AI interviews, real-time monitoring, analytics, recruiter shortlisting, and admin visibility.

The **frontend is deployed on Vercel**. The **API and database run locally**, with **ngrok** providing public access for the live site. Moving the backend and PostgreSQL to the cloud is the primary optional step for always-on production operation.