# SmartHire AI

# UI Wireframes

## Introduction

This document presents the user interface wireframes for the **SmartHire AI** platform.

The wireframes represent the complete application screens implemented across Candidate, Recruiter, and Admin roles, including authentication, resume management, Job Description matching, type-specific AI interviews, interview monitoring, analytics, shortlisting, and account management.

The frontend is deployed on **Vercel**. The live UI calls the API using `VITE_API_URL` (local development or ngrok URL for hybrid live access).

---

# Candidate Interface

## 1. Home Page

```text
+------------------------------------------------------------+
|                                                            |
|                         SmartHire AI                       |
|                AI-Powered Interview Platform               |
|                                                            |
|     Resume Analysis • JD Match • Mock Interviews           |
|           AI Monitoring • Analytics • Reports              |
|                                                            |
|                 [ Login ]    [ Register ]                  |
|                                                            |
+------------------------------------------------------------+
```

---

## 2. Login Page

```text
+--------------------------------------------------------------+
| Left Branding Panel          | Right Form Panel              |
|                              |                               |
| SmartHire AI                 | Sign In                       |
| AI Interview Platform        | Role: [Candidate]             |
| Feature highlights           |       [Recruiter]             |
|                              |       [Admin]                 |
|                              |                               |
|                              | Email                         |
|                              | Password                      |
|                              |                               |
|                              | [ Sign In ]                   |
|                              | New user? Sign up             |
+--------------------------------------------------------------+
| © 2026 SmartHire AI • All rights reserved                    |
+--------------------------------------------------------------+
```

---

## 3. Registration Page

```text
+--------------------------------------------------------------+
| Left Branding Panel          | Right Form Panel              |
|                              |                               |
| Create your account          | Create Account                |
| and start your journey       |                               |
| Feature highlights           | Register as:                  |
|                              | [Candidate] [Recruiter]       |
|                              | [Admin]                       |
|                              |                               |
|                              | Full Name                     |
|                              | Email                         |
|                              | Password                      |
|                              | Confirm Password              |
|                              | [ ] Agree Terms               |
|                              |                               |
|                              | [ Create Account ]            |
|                              | Already have account? Sign in |
+--------------------------------------------------------------+
| © 2026 SmartHire AI • All rights reserved                    |
+--------------------------------------------------------------+
```

---

## 4. Candidate Dashboard

```text
+--------------------------------------------------------------------------+
| SmartHire AI                          [Delete Account] [Logout]          |
|                                                                          |
| Date & Time                                                              |
| Welcome, Candidate                                                       |
| Role Badge: CANDIDATE                                                    |
+--------------------------------------------------------------------------+
|                                                                          |
| Stats Cards                                                              |
| [Total Resumes] [Analyzed] [Interviews Taken] [Avg Score]                |
|                                                                          |
+--------------------------------------------------------------------------+
| Job Description                                                          |
|                                                                          |
| [ Textarea: Paste Job Description ]                                      |
|                                                                          |
| [ Save Job Description ]      JD saved                                   |
+--------------------------------------------------------------------------+
| Resume ↔ JD Match Result (when available)                                |
|                                                                          |
| Match Score: XX%                                                         |
+--------------------------------------------------------------------------+
| Upload Resume                                                            |
|                                                                          |
| [ Choose PDF ] [ Upload ]                                                |
+--------------------------------------------------------------------------+
| My Resumes                                                               |
|                                                                          |
| Resume.pdf                                                               |
| [Download] [Analyze] [Match] [Interview] [Delete]                        |
|                                                                          |
+--------------------------------------------------------------------------+
```

---

## 5. Interview Type Selection Modal

```text
+----------------------------------------------+
|                                              |
|              Select Interview Type           |
|                                              |
|              ( ) HR Interview                |
|              ( ) Technical Interview         |
|              ( ) Managerial Interview        |
|                                              |
|       [ Cancel ]       [ Start Interview ]   |
|                                              |
+----------------------------------------------+
```

---

## 6. AI Resume Analysis

```text
+----------------------------------------------------------------+
|                     AI Resume Analysis                         |
+----------------------------------------------------------------+
| Technical Skills                                               |
|                                                                |
+----------------------------------------------------------------+
| Soft Skills                                                    |
|                                                                |
+----------------------------------------------------------------+
| Frameworks / Tools / Databases / Cloud                         |
|                                                                |
+----------------------------------------------------------------+
| Certifications                                                 |
|                                                                |
+----------------------------------------------------------------+
| Education                                                      |
|                                                                |
+----------------------------------------------------------------+
| Experience                                                     |
|                                                                |
+----------------------------------------------------------------+
| Projects                                                       |
|                                                                |
+----------------------------------------------------------------+
```

---

## 7. AI Interview Page

```text
+------------------------------------------------------------------------------------+
|                              SmartHire AI Interview                                |
| Session Information                                                                |
+------------------------------------------------------------------------------------+
|                                                                                    |
| Chat Window                                                                        |
|                                                                                    |
| AI Interviewer Messages                                                            |
|                                                                                    |
| Candidate Messages                                                                 |
|                                                                                    |
+------------------------------------------------------------------------------------+
| Text Input / Voice Recorder / Send                                                 |
+------------------------------------------------------------------------------------+
| Live Webcam Monitor                                                                |
| Emotion / Eye Contact / Monitoring Status                                          |
+------------------------------------------------------------------------------------+
```

---

## 8. Interview Analytics

```text
+-------------------------------------------------------------------------------+
|                            Interview Analytics                                |
+-------------------------------------------------------------------------------+
| Cards: Overall Score | Fluency | Eye Contact | Communication                  |
+-------------------------------------------------------------------------------+
|                                                                               |
| Score Timeline                                                                |
|                                                                               |
|                 [ Analytics Chart ]                                           |
|                                                                               |
+-------------------------------------------------------------------------------+
| Transcript History                                                            |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

## 9. AI Feedback Dashboard

```text
+--------------------------------------------------------------+
|                    AI Feedback Dashboard                     |
+--------------------------------------------------------------+
| Overall Score                                                |
|                                                              |
+--------------------------------------------------------------+
| Fluency                                                      |
|                                                              |
+--------------------------------------------------------------+
| Strengths                                                    |
|                                                              |
+--------------------------------------------------------------+
| Weaknesses                                                   |
|                                                              |
+--------------------------------------------------------------+
| Suggestions                                                  |
|                                                              |
+--------------------------------------------------------------+
| Full Transcript                                              |
|                                                              |
+--------------------------------------------------------------+
```

---

## 10. Interview History / Progress

```text
+------------------------------------------------------------------+
|                    Interview History / Progress                  |
+------------------------------------------------------------------+
| Session List                                                     |
|                                                                  |
| Session | Interview Type | Score | Date | Actions                |
|                                                                  |
+------------------------------------------------------------------+
| Progress Charts                                                  |
|                                                                  |
| [ Performance / Progress Charts ]                                |
|                                                                  |
+------------------------------------------------------------------+
| Summary Metrics                                                  |
+------------------------------------------------------------------+
```

---

# Recruiter Interface

## 1. Recruiter Dashboard

```text
+--------------------------------------------------------------------------+
| SmartHire AI • Recruiter Portal          [Delete Account] [Logout]       |
|                                                                          |
| Welcome, Recruiter                                                       |
| Role Badge: RECRUITER                                                    |
+--------------------------------------------------------------------------+
|                                                                          |
| Stats                                                                    |
| [Interviews] [Avg Score] [High Performers] [Shortlisted]                 |
|                                                                          |
+--------------------------------------------------------------------------+
| Candidate Interviews                                                     |
|                                                                          |
| Filters: All / High / Medium / Low     Search Session ID                 |
|                                                                          |
+--------------------------------------------------------------------------+
| Session #123                                                             |
| Candidate | Interview Type | Score | Status | Actions                    |
|                                                                          |
| [View Analytics] [Download PDF] [Shortlist] [Reject] [Pending]           |
+--------------------------------------------------------------------------+
```

---

# Administrator Interface

## 1. Admin Dashboard

```text
+--------------------------------------------------------------------------+
| SmartHire AI • Admin Portal              [Delete Account] [Logout]       |
|                                                                          |
| Welcome, Admin                                                           |
| Role Badge: ADMIN                                                        |
+--------------------------------------------------------------------------+
|                                                                          |
| Stats                                                                    |
| [Total Users] [Candidates] [Recruiters] [Admins]                         |
|                                                                          |
+--------------------------------------------------------------------------+
| User Management                                                          |
|                                                                          |
| Filter by Role: [All] [Candidate] [Recruiter] [Admin]                    |
| Search: [Name / Email]                                                   |
|                                                                          |
+--------------------------------------------------------------------------+
| User Table                                                               |
|                                                                          |
| ID | Name | Email | Role | Created At | Actions                          |
|                                                                          |
+--------------------------------------------------------------------------+
```

---

# Navigation Flow

## Candidate Workflow

```text
Home
  ↓
Login / Register (with role)
  ↓
Candidate Dashboard
  ↓
Upload Resume
  ↓
AI Resume Analysis
  ↓
Save Job Description
  ↓
Resume ↔ JD Match
  ↓
Select Interview Type
  ↓
AI Interview Room
  ↓
Interview Completion
  ↓
Analytics / Feedback / History / Progress / PDF Report
```

---

## Recruiter Workflow

```text
Login (Recruiter)
  ↓
Recruiter Dashboard
  ↓
Filter / Search Sessions
  ↓
View Analytics
  ↓
Download PDF
  ↓
Shortlist / Reject / Pending
```

---

## Administrator Workflow

```text
Login (Admin)
  ↓
Admin Dashboard
  ↓
View Users
  ↓
Filter by Role
  ↓
Search Users
```

---

## Live Access Workflow (Operator)

```text
Start PostgreSQL
  ↓
Start FastAPI (0.0.0.0:8000)
  ↓
Start ngrok → copy HTTPS URL
  ↓
Ensure Vercel VITE_API_URL = https://<ngrok>/api/v1
  ↓
Users open Vercel frontend URL
```

---

# UI Status

## Implemented

- Home Page
- Login Page with role selection
- Registration Page with role selection
- Candidate Dashboard
- Resume Upload / List / Analysis
- Job Description section
- Resume ↔ JD Match UI
- Interview Type Selection
- AI Interview Room with monitoring
- Interview Analytics
- AI Feedback Dashboard
- Interview History / Progress
- Recruiter Dashboard
- Admin Dashboard
- Delete Account and Logout on all role dashboards
- Responsive design
- Frontend production deploy on Vercel
- API base URL configuration via `VITE_API_URL`

## Optional / Future

- Always-on cloud API (no local backend or ngrok required for the live UI)
- Further mobile layout refinements
- Dark mode (if desired)

---

# Summary

The SmartHire AI interface provides complete role-based experiences for Candidates, Recruiters, and Administrators.

The UI supports the full interview preparation and evaluation workflow, including:

- Secure authentication
- Resume management
- AI resume analysis
- Job Description management
- Resume ↔ JD matching
- Type-specific AI interviews
- Real-time interview monitoring
- Speech, emotion, eye-contact, and communication analysis
- Interview analytics and AI feedback
- Interview history and progress
- Recruiter shortlisting
- Admin user management
- Account management

The frontend UI is complete and publicly hosted on Vercel. Full product availability still depends on the hybrid backend (local API + database + tunnel) until the API is moved to the cloud.