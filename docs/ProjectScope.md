# SmartHire AI

# Project Scope

## Project Overview

SmartHire AI is an AI-powered recruitment and interview preparation platform developed using **FastAPI**, **React**, **TypeScript**, **PostgreSQL**, and modern Artificial Intelligence technologies.

The platform enables candidates to securely manage resumes, perform AI-powered resume analysis, match resumes with Job Descriptions, participate in type-specific AI mock interviews (HR / Technical / Managerial), receive AI evaluation, and obtain real-time interview monitoring reports including speech analysis, emotion detection, eye-contact tracking, and communication assessment.

Recruiters can review interview sessions, view analytics, download reports, and shortlist candidates. Administrators can view platform users and role statistics.

This document reflects the **complete implemented platform** in its current hybrid deployment model:

| Layer | Status |
|-------|--------|
| Application features | Complete |
| Frontend | Deployed on Vercel |
| Backend API | Local FastAPI |
| Database | Local PostgreSQL |
| Public API access | ngrok tunnel |

---

# Problem Statement

Traditional recruitment processes require significant manual effort for resume screening, technical evaluation, and interview preparation. Recruiters spend considerable time reviewing resumes, while candidates often lack access to personalized interview practice and objective feedback on both technical and communication skills.

SmartHire AI addresses these challenges by automating resume analysis, Job Description matching, interview preparation, AI-based evaluation, and real-time interview monitoring, creating a more efficient, intelligent, and personalized recruitment experience.

---

# Project Objectives

The primary objectives of SmartHire AI are:

- Build a secure AI-powered recruitment and interview platform.
- Provide role-based authentication and authorization for Candidate, Recruiter, and Admin.
- Enable secure resume management.
- Extract structured information from resumes using AI.
- Support Job Description storage and Resume ↔ JD matching.
- Conduct type-specific AI mock interviews (HR / Technical / Managerial).
- Evaluate candidate responses automatically.
- Monitor candidate communication during interviews.
- Analyze speech, emotion, eye contact, and fluency.
- Generate AI-powered interview reports and analytics.
- Support recruiter shortlisting workflows.
- Support admin visibility into platform users.
- Deploy the frontend for public access and operate the API securely in a documented hybrid setup.
- Keep the architecture ready for full cloud hosting of API and database.

---

# Target Users

The platform supports three categories of users.

## Candidate

Candidates can:

- Register and login securely with role selection.
- Upload, download, and delete resumes.
- Analyze resumes using AI.
- Save and manage Job Descriptions.
- Match resumes with Job Descriptions.
- Select interview type (HR / Technical / Managerial).
- Start conversational AI mock interviews.
- Answer via text or voice.
- Receive AI evaluation and feedback.
- View speech, emotion, eye-contact, and fluency analysis.
- Access interview analytics, history, progress, and PDF reports.
- Delete their account securely.

---

## Recruiter

Recruiters can:

- Register and login securely.
- View completed interview sessions.
- Filter and search sessions by score.
- Open interview analytics.
- Download PDF reports.
- Shortlist, reject, or mark sessions as pending.
- Persist shortlist decisions in the database.
- Delete their account securely.

---

## Administrator

Administrators can:

- Register and login securely.
- View platform user statistics.
- List and search all users.
- Filter users by role.
- Monitor candidate / recruiter / admin counts.
- Delete their account securely.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Recharts / visualization libraries
- Lucide React icons

## Backend

- FastAPI
- Python
- SQLAlchemy ORM
- Alembic
- Pydantic
- JWT Authentication

## Database

- PostgreSQL

## Authentication

- JWT Authentication
- BCrypt Password Hashing
- Role-Based Access Control (RBAC)

## Artificial Intelligence

- Groq API (LLM for analysis, matching, and interview conversation)
- Whisper Speech-to-Text
- DeepFace Emotion Recognition
- MediaPipe Face Mesh
- OpenCV
- Prompt Engineering
- Structured JSON Output

## Deployment (current)

- Frontend: Vercel
- Backend: Local Uvicorn / FastAPI
- Database: Local PostgreSQL
- Tunnel: ngrok for public access to the local API

---

# Current Project Modules (Implemented)

## Authentication Module

- User Registration with role selection
- User Login with role verification
- JWT Authentication
- Protected Routes
- Role-Based Authorization
- Current User Profile
- Account Deletion

## Resume Management Module

- Resume Upload
- Resume Download
- Resume Deletion
- Resume Listing
- Resume Text Extraction
- Resume Storage

## AI Resume Analysis Module

- Technical Skill Extraction
- Soft Skill Extraction
- Framework / Tool / Database / Cloud Detection
- Certification Extraction
- Education / Experience / Project Extraction
- Structured AI Analysis Storage and Display

## Job Description Module

- Save Job Description
- Load Job Description
- Update Job Description
- Resume ↔ JD Match (score, matching skills, missing skills, summary)

## AI Interview Engine

- Interview Type Selection (HR / Technical / Managerial)
- Conversational AI Interview Flow
- Resume-based and type-specific questioning
- Adaptive follow-up questions
- Interview Session Tracking

## Interview Session Module

- Start Interview Session
- Finish Interview Session
- Session Status Tracking
- Session History
- Multiple Interview Attempts

## AI Answer Evaluation Module

- AI Answer Evaluation
- Feedback Generation
- Evaluation Storage
- Overall Performance Support

## AI Interview Monitoring Module

- Speech-to-Text Conversion
- Transcript Generation
- Emotion Recognition
- Eye Contact Detection
- Filler Word Detection
- Communication Fluency Analysis
- Overall Communication Score
- AI Recommendation Generation
- Monitoring Reports
- Monitoring Snapshots for Analytics

## Candidate Dashboard

- Resume Management
- Resume Analysis
- Job Description Management
- Resume Match
- Interview Access by Type
- Interview History / Analytics / Feedback / Progress
- PDF Reports
- Account Deletion

## Recruiter Dashboard

- Interview Session Overview
- Score Filters and Search
- Analytics Access
- PDF Download
- Shortlist / Reject / Pending Status
- Account Deletion

## Admin Dashboard

- User Statistics
- User Listing
- Role Filtering and Search
- Account Deletion

## Deployment Module (Hybrid)

- Production frontend on Vercel
- Environment-based API URL (`VITE_API_URL`)
- Local API and PostgreSQL operation
- ngrok-based public API access for the live frontend
- CORS configuration for local and Vercel origins

---

# Remaining Work

## Optional cloud infrastructure

- Always-on production backend hosting
- Managed cloud PostgreSQL
- Removal of dependency on local PC + ngrok for live demos
- Optional Docker Compose packaging
- Optional CI/CD pipeline
- Optional email / notification services
- Optional expanded automated test suite in CI

---

# Expected Outcomes

SmartHire AI currently provides:

- Secure multi-role authentication system
- Resume management platform
- AI-powered resume parsing and analysis
- Job Description management and Resume ↔ JD matching
- Type-specific conversational AI interviews
- AI answer evaluation
- Speech-to-text, emotion, eye-contact, and fluency analysis
- Interview monitoring reports and analytics
- Recruiter shortlisting workflow
- Admin user visibility
- Responsive role-based dashboards
- Public frontend deployment with documented hybrid API access
- Modular backend architecture ready for full cloud hosting

---

# Project Scope Status

## Completed (Milestone 1)

- Project Initialization
- Database Design
- Authentication
- JWT Authorization
- Role-Based Access Control
- Resume Management
- Candidate Dashboard foundation

## Completed (Milestone 2)

- Resume Parsing
- AI Resume Analysis
- Skill Extraction
- Interview Question / Conversation Generation
- Interview Session Management
- AI Interview Workflow
- AI Answer Evaluation

## Completed (Milestone 3)

- Speech-to-Text Processing
- Emotion Detection
- Eye Contact Detection
- Filler Word Detection
- Communication Analysis
- Interview Monitoring
- Monitoring Reports and Snapshots
- Analytics Support

## Completed (Milestone 4)

- Job Description Module
- Resume ↔ JD Match
- Interview Type Selection (HR / Technical / Managerial)
- Recruiter Dashboard and Shortlisting
- Admin Dashboard
- Account Deletion
- Full role-based frontend protection
- Frontend deployment on Vercel
- Hybrid live API access (local backend + ngrok)

## Remaining (optional)

- Fully cloud-hosted backend and managed database (always-on, no local tunnel)

---

# Expected Final Outcome

SmartHire AI is a complete AI-powered interview and recruitment support platform capable of assisting candidates through resume analysis, JD matching, and mock interviews, while providing recruiters with evaluation insights and shortlisting tools, and administrators with user visibility.

Feature scope for the project is complete. The frontend is publicly deployed; the API and database operate in a hybrid local model suitable for evaluation and demonstration. Moving the backend and PostgreSQL to the cloud is the primary optional step for always-on production operation.