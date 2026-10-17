# SmartHire AI

# User Workflows

## Introduction

This document describes the interaction flows for different users of the **SmartHire AI** platform. It outlines how users navigate through the system and how AI-powered services process resumes, conduct mock interviews, evaluate candidate responses, and generate real-time interview monitoring reports.

These workflows represent the **complete implemented platform** in the current hybrid deployment model (frontend on Vercel; API and database local, exposed publicly via ngrok when live access is required).

---

# Authentication Workflow

```text
Register
    │
    ▼
Select Role (Candidate / Recruiter / Admin)
    │
    ▼
Validate User Details
    │
    ▼
Hash Password
    │
    ▼
Save User with Role
    │
    ▼
Login
    │
    ▼
Select Role
    │
    ▼
Verify Password + Role Match
    │
    ▼
Generate JWT Token
    │
    ▼
Redirect to Role Dashboard
    │
    ├─ Candidate → /dashboard
    ├─ Recruiter → /recruiter
    └─ Admin → /admin
    │
    ▼
Access Protected Routes
    │
    ▼
Logout / Delete Account
```

---

# Candidate Workflow

```text
Candidate Registration / Login
        │
        ▼
Candidate Dashboard
        │
        ├──────────────► Upload Resume (PDF)
        │                      │
        │                      ▼
        │              Resume Stored
        │                      │
        │                      ▼
        │          Resume Text Extraction
        │                      │
        │                      ▼
        │           AI Resume Analysis
        │                      │
        │                      ▼
        │         View Analysis Results
        │
        ├──────────────► Save Job Description
        │                      │
        │                      ▼
        │              Resume ↔ JD Match
        │                      │
        │                      ▼
        │     Match Score / Matching Skills /
        │     Missing Skills / Summary
        │
        ├──────────────► Download Resume
        │
        ├──────────────► Delete Resume
        │
        ├──────────────► Start AI Interview
        │                      │
        │                      ▼
        │          Select Interview Type
        │          (HR / Technical / Managerial)
        │                      │
        │                      ▼
        │          Create Interview Session
        │                      │
        │                      ▼
        │       Conversational AI Interview
        │                      │
        │                      ▼
        │     Speech & Camera Monitoring
        │                      │
        │                      ▼
        │     Analytics / Feedback / Report
        │
        └──────────────► Logout / Delete Account
```

---

# AI Resume Analysis Workflow

```text
Resume Upload
      │
      ▼
Validate PDF
      │
      ▼
Store Resume
      │
      ▼
Extract Resume Text
      │
      ▼
Generate AI Prompt
      │
      ▼
Groq LLM Processing
      │
      ▼
Extract
• Technical Skills
• Soft Skills
• Frameworks
• Tools
• Databases
• Cloud Platforms
• Certifications
• Education
• Experience
• Projects
      │
      ▼
Store Resume Analysis
      │
      ▼
Display Resume Analysis
```

---

# Job Description and Match Workflow

```text
Open Candidate Dashboard
      │
      ▼
Paste Job Description
      │
      ▼
Save Job Description
      │
      ▼
Select Resume → Match
      │
      ▼
LLM Compare Resume vs JD
      │
      ▼
Return
• Match Score
• Matching Skills
• Missing Skills
• Summary
      │
      ▼
Display Match Result Card
```

---

# AI Interview Workflow

```text
Candidate Clicks Interview
        │
        ▼
Select Interview Type
(HR / Technical / Managerial)
        │
        ▼
Validate Resume
        │
        ▼
Load Resume Analysis
        │
        ▼
Create Interview Session
(with interview_type)
        │
        ▼
Display Interview Page
        │
        ▼
Start AI Monitoring
(Camera + Microphone)
        │
        ▼
Conversational Interview Loop
        │
        ├─ Candidate answers (text / voice)
        ├─ Speech processing
        ├─ Emotion detection
        ├─ Eye contact detection
        ├─ Filler / fluency analysis
        ├─ AI generates next question
        │
        ▼
Finish Interview
        │
        ▼
Generate Monitoring Report
        │
        ▼
View Analytics / Feedback / PDF
```

---

# Resume Management Workflow

```text
Upload Resume
      │
      ▼
Validate PDF
      │
      ▼
Save File
      │
      ▼
Create Database Record
      │
      ▼
Resume Appears in Dashboard
      │
      ├────────► Download Resume
      │
      ├────────► Analyze Resume
      │
      ├────────► Match with JD
      │
      ├────────► Start Interview
      │
      └────────► Delete Resume
```

---

# AI Monitoring Workflow

```text
Interview Starts
       │
       ▼
Open Webcam
       │
       ▼
Enable Microphone
       │
       ▼
Record Candidate Response
       │
       ▼
Capture Webcam Frame
       │
       ▼
Speech-to-Text
       │
       ▼
Emotion Detection
       │
       ▼
Eye Contact Detection
       │
       ▼
Filler Word Detection
       │
       ▼
Fluency Analysis
       │
       ▼
Generate Overall Score
       │
       ▼
Generate AI Recommendation
       │
       ▼
Save Monitoring Report + Snapshots
       │
       ▼
Display Monitoring / Analytics
```

---

# Interview Evaluation Workflow

```text
Candidate Submits Answer
        │
        ▼
Validate Input
        │
        ▼
Generate AI Prompt
        │
        ▼
Groq LLM Evaluation
        │
        ▼
Evaluate
• Technical Accuracy
• Completeness
• Clarity
• Communication
        │
        ▼
Generate Score + Feedback
        │
        ▼
Store Evaluation
        │
        ▼
Display Evaluation / Feedback
```

---

# Interview Session Workflow

```text
Start Interview
        │
        ▼
Select Type (HR / Technical / Managerial)
        │
        ▼
Create Session
(Status = IN_PROGRESS)
        │
        ▼
Start Monitoring
        │
        ▼
Conversational Q&A
        │
        ▼
Evaluate Responses + Monitor Signals
        │
        ▼
Finish Interview
        │
        ▼
Update Session
(Status = COMPLETED)
        │
        ▼
View Analytics / Feedback / History / PDF
```

---

# Recruiter Workflow

```text
Recruiter Login
        │
        ▼
Recruiter Dashboard
        │
        ├────────► View Interview Sessions
        │
        ├────────► Filter by Score
        │
        ├────────► Search Sessions
        │
        ├────────► Open Analytics
        │
        ├────────► Download PDF Report
        │
        ├────────► Shortlist / Reject / Pending
        │
        └────────► Logout / Delete Account
```

---

# Administrator Workflow

```text
Administrator Login
        │
        ▼
Admin Dashboard
        │
        ├────────► View User Statistics
        │
        ├────────► List All Users
        │
        ├────────► Filter by Role
        │
        ├────────► Search Users
        │
        └────────► Logout / Delete Account
```

---

# Live Access Workflow (Operator)

```text
Start PostgreSQL
        │
        ▼
Start FastAPI (host 0.0.0.0, port 8000)
        │
        ▼
Start ngrok http 8000
        │
        ▼
Copy HTTPS forwarding URL
        │
        ▼
Set Vercel VITE_API_URL =
https://<ngrok-host>/api/v1
(Redeploy frontend if URL changed)
        │
        ▼
Users open Vercel site
        │
        ▼
API calls reach local backend via tunnel
```

---

# Local Development Workflow

```text
Start PostgreSQL
        │
        ▼
Start FastAPI on localhost:8000
        │
        ▼
Start Vite frontend (npm run dev)
        │
        ▼
VITE_API_URL=http://127.0.0.1:8000/api/v1
        │
        ▼
Open http://localhost:5173
```

---

# Current Workflow Status

## Implemented

- User Registration with role selection
- User Login with role verification
- JWT Authentication
- Role-Based Access Control
- Candidate Dashboard
- Resume Upload / Download / Delete
- Resume Text Extraction
- AI Resume Analysis
- Job Description Save / Load
- Resume ↔ JD Match
- Interview Type Selection
- Conversational AI Interview Sessions
- Speech-to-Text
- Emotion Recognition
- Eye Contact Detection
- Filler Word Detection
- Communication Analysis
- Overall AI Scoring
- AI Recommendation Generation
- Interview Monitoring
- Interview Analytics / Feedback / History / Progress
- PDF Reports
- Recruiter Dashboard and Shortlisting
- Admin Dashboard and User Visibility
- Account Deletion
- Protected Routes
- Frontend deployment on Vercel
- Hybrid live access (local API + ngrok)

## Optional / Future

- Always-on cloud-hosted backend and managed PostgreSQL (no local PC or tunnel required)

---

# Summary

SmartHire AI supports complete end-to-end workflows for Candidates, Recruiters, and Administrators.

The platform covers:

- Authentication and role-based access
- Resume management and AI analysis
- Job Description management and Resume ↔ JD matching
- Type-specific AI mock interviews
- Candidate answer evaluation
- Speech-to-text processing
- Emotion and eye-contact detection
- Filler-word and fluency analysis
- Real-time interview monitoring
- Analytics and AI feedback
- Interview history and PDF reports
- Recruiter shortlisting
- Admin user visibility
- Secure account management
- Public frontend access with hybrid API operation

Feature workflows are complete. Live product availability depends on the hybrid operator workflow until the API and database are moved to the cloud.