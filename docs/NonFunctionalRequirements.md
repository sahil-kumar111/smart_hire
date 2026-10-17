# Non-Functional Requirements

## Introduction

This document defines the non-functional requirements of the **SmartHire AI** platform.

These requirements describe the quality attributes, performance expectations, security constraints, scalability goals, maintainability standards, usability expectations, compatibility requirements, and AI monitoring capabilities of the platform.

This document reflects the **complete implemented platform** in its current hybrid deployment model:

| Layer | Status |
|-------|--------|
| Application features | Complete |
| Frontend | Deployed on Vercel |
| Backend API | Local FastAPI |
| Database | Local PostgreSQL |
| Public API access | ngrok tunnel |

---

# 1. Performance

The system shall:

- Respond to authentication requests within 2 seconds under normal load.
- Upload PDF resumes efficiently.
- Extract resume text within a few seconds after upload.
- Generate AI resume analysis within an acceptable response time (subject to LLM latency).
- Support Job Description save and Resume ↔ JD matching within acceptable latency.
- Conduct conversational AI interviews with minimal delay between turns (subject to LLM latency).
- Evaluate interview answers with reasonable latency.
- Process speech transcription efficiently on the host machine.
- Perform emotion detection from webcam images in near real-time where hardware allows.
- Detect eye contact from captured interview frames.
- Analyze filler words and communication quality.
- Generate interview monitoring reports and analytics efficiently.
- Support multiple authenticated users simultaneously at project/demo scale.
- Perform database queries efficiently using indexed primary keys and frequently queried foreign-key columns.

---

# 2. Scalability

The platform shall:

- Support increasing numbers of users across Candidate, Recruiter, and Admin roles.
- Support multiple resumes per candidate.
- Support multiple interview sessions per candidate.
- Store interview analytics and monitoring snapshots for future review.
- Handle growing resume and interview datasets at project scale.
- Allow future deployment across multiple backend instances.
- Support Docker-based deployment.
- Support horizontal scaling of backend APIs in a cloud environment.
- Support migration to fully cloud-hosted API and database without schema redesign.

**Current constraint:** Public concurrent capacity is limited by the local backend host and free-tier tunnel (ngrok) rate limits until the API is moved to the cloud.

---

# 3. Security

The platform shall:

- Securely hash passwords using BCrypt.
- Authenticate users using JWT tokens.
- Implement Role-Based Access Control (RBAC) for Candidate, Recruiter, and Admin roles.
- Restrict access to protected APIs based on authentication and role.
- Ensure users can access only authorized resumes and interview data.
- Ensure recruiter and admin features are restricted according to role.
- Validate uploaded PDF files.
- Validate interview media inputs where applicable.
- Protect against SQL Injection through SQLAlchemy ORM and parameterized database operations.
- Protect against Cross-Site Scripting (XSS) through safe frontend practices.
- Store sensitive configuration using environment variables (`.env` not committed to source control).
- Never expose passwords, tokens, or authentication secrets in logs or client bundles.
- Support secure account deletion with related data cleanup.
- Maintain database referential integrity.
- Configure CORS to allow known frontend origins (local Vite and Vercel production URL).

---

# 4. Reliability

The system shall:

- Maintain database consistency.
- Preserve uploaded resume files safely on the configured storage path.
- Store AI resume analysis reliably.
- Store interview conversations, answers, and evaluations reliably.
- Store monitoring snapshots and reports reliably.
- Handle invalid user requests gracefully.
- Return meaningful API error responses.
- Avoid crashes during unexpected input.
- Ensure interview sessions remain consistently status-tracked (`IN_PROGRESS` / `COMPLETED`).
- Maintain consistent relationships between users, resumes, interviews, evaluations, and monitoring data.

---

# 5. Availability

The platform shall:

### Frontend

- Remain publicly available via Vercel under normal hosting conditions.

### Backend and database (current hybrid model)

- Be available while the operator runs PostgreSQL, the FastAPI process, and the ngrok tunnel.
- Recover gracefully from temporary local failures after process restart.
- Document a clear startup sequence for operators.

### Future production target

- Support continuous backend operation on cloud infrastructure.
- Support high-availability database and API hosting.
- Minimize service interruption during deployments and maintenance.

---

# 6. Maintainability

The project shall:

- Follow a modular architecture.
- Separate frontend and backend applications.
- Follow a layered backend architecture.

### Architecture Layers

- API Layer
- Service Layer
- Repository Layer
- Database Layer
- AI Service Layer

The project shall:

- Use reusable React components.
- Use reusable FastAPI services.
- Follow clean coding practices.
- Use SQLAlchemy ORM for database interaction.
- Use Alembic for database migrations.
- Include project documentation under `docs/`.
- Support future feature extensions without major refactoring.
- Maintain clear separation between business logic, API handling, database operations, and AI services.
- Configure environment-specific values (`DATABASE_URL`, `GROQ_API_KEY`, `VITE_API_URL`, `FRONTEND_URL`) outside source code.

---

# 7. Usability

The platform shall:

- Provide a clean and intuitive interface for Candidate, Recruiter, and Admin roles.
- Support responsive layouts.
- Display meaningful success and error messages.
- Show loading indicators during AI processing.
- Display interview monitoring and analytics results clearly.
- Minimize user interactions for common tasks.
- Allow seamless navigation between resume management, interviews, analytics, and recruiter workflows.
- Provide clear feedback after important operations such as resume upload, analysis, interview completion, and shortlist updates.

---

# 8. Compatibility

The application shall support:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

Future versions should also support:

- Mobile browsers
- Tablet devices

The platform uses standard web technologies and browser APIs (including media devices for interview monitoring) to maintain cross-browser compatibility. Camera and microphone features require user permission and HTTPS on the public frontend.

---

# 9. Database

The database shall:

- Use PostgreSQL as the primary relational database.
- Maintain referential integrity using foreign keys.
- Store structured resume analysis using JSON/JSONB fields where appropriate.
- Store Job Descriptions per user.
- Store interview questions, sessions, conversations, answers, and evaluations.
- Store interview monitoring snapshots and reports.
- Store recruiter shortlist decisions.
- Store timestamps for account and interview activities.
- Support indexes for frequently queried columns.
- Prevent duplicate data where appropriate.
- Enforce unique email addresses for users.
- Enforce unique recruiter–session combinations for shortlist records.
- Support safe deletion of related records according to application and database relationship rules.
- Support database migrations using Alembic.

**Current hosting:** Local PostgreSQL. Schema is cloud-ready for managed PostgreSQL migration.

---

# 10. Artificial Intelligence Quality

## Resume Analysis

The AI engine shall:

- Extract technical and soft skills.
- Detect programming languages, frameworks, tools, databases, and cloud technologies.
- Extract certifications, education, experience, and projects.
- Generate structured resume analysis via a Groq-hosted LLM.

## Resume ↔ JD Matching

The AI engine shall:

- Compare resume content with the Job Description.
- Produce a match score.
- Identify matching and missing skills.
- Generate a concise candidate–job fit summary.

## Interview Question and Conversation Generation

The AI engine shall:

- Generate personalized interview conversations.
- Support HR, Technical, and Managerial interview styles.
- Generate questions based on resume information where applicable.
- Adapt follow-up questions based on previous candidate answers.
- Maintain interview context throughout a session.

## Interview Answer Evaluation

The AI engine shall:

- Evaluate candidate answers.
- Assign scores.
- Identify strengths and weaknesses.
- Generate constructive feedback.
- Provide ideal-answer guidance where applicable.
- Store evaluations for later review.

## Interview Monitoring

The AI monitoring engine shall:

- Convert speech to text.
- Detect filler words.
- Measure communication fluency.
- Detect facial emotions and dominant emotion where applicable.
- Detect eye contact and calculate eye-contact scores.
- Generate communication recommendations and overall monitoring scores.
- Generate monitoring reports and timeline-based analytics snapshots.

AI quality and latency depend on the selected Groq model, host hardware (for vision/speech), and network conditions.

---

# 11. Logging

The backend shall:

- Log authentication events where appropriate.
- Log database operations where useful for debugging.
- Log resume upload and analysis requests.
- Log interview session creation and completion.
- Log monitoring analysis requests.
- Capture unexpected exceptions.
- Record validation failures.
- Avoid logging sensitive information such as passwords, authentication secrets, or private credentials.

---

# 12. Monitoring

The platform shall support:

- Backend performance observation during operation.
- API error visibility through logs and client feedback.
- Interview monitoring analytics within the product UI.
- Future integration with cloud APM, uptime checks, and usage metrics after full cloud hosting.

---

# 13. Portability

The application shall:

- Run on Windows and Linux.
- Support future execution inside Docker containers.
- Support cloud deployment of the API and database without major source-code modifications.
- Keep environment-specific configuration separate from application source code.
- Allow the frontend to target any API base URL via `VITE_API_URL`.

---

# 14. Extensibility

The architecture shall support future implementation of:

- Job Management / Companies
- Candidate Application Pipeline
- Coding Assessments
- Live Video Interviews
- Email / Push Notifications
- Advanced Recruiter Analytics
- Cloud Object Storage for uploads
- CI/CD Deployment
- Multi-language Resume Analysis
- Additional AI interview evaluation metrics
- Always-on cloud API and managed database (replacing local + ngrok)

---

# 15. Documentation

The project shall include:

- README
- Project Scope
- Functional Requirements
- Non-Functional Requirements
- Database Design
- ER Diagram
- UI documentation and workflows
- Deployment documentation (hybrid Vercel + local API + ngrok)

All documentation shall remain synchronized with the current implementation.

---

# 16. Deployment (Current Model)

The system shall support:

- Frontend production builds hosted on Vercel.
- Backend process bound to a network-accessible host/port for tunneling (`0.0.0.0:8000`).
- Secure secret management via local `.env` and Vercel environment variables.
- Operator checklist: start PostgreSQL → start API → start ngrok → ensure `VITE_API_URL` matches the tunnel → access the Vercel site.

---

# Non-Functional Status

## Implemented

- Modular FastAPI backend
- React + TypeScript frontend
- PostgreSQL integration
- SQLAlchemy ORM and Alembic migrations
- JWT authentication and BCrypt password hashing
- Role-Based Access Control (Candidate / Recruiter / Admin)
- Resume upload and AI analysis
- Job Description management and Resume ↔ JD match
- Interview types (HR / Technical / Managerial)
- Conversational interviews and AI answer evaluation
- Speech, emotion, eye-contact, and filler analysis
- Monitoring reports, snapshots, and analytics dashboards
- Recruiter shortlisting and admin user visibility
- Account deletion with related data cleanup
- RESTful API architecture
- Structured project documentation
- Frontend deployment on Vercel
- Hybrid live access via local API + ngrok

## Optional / future

- Always-on cloud-hosted backend and managed PostgreSQL
- Docker Compose / containerized production stack
- CI/CD pipeline
- Formal automated test suite in CI
- Email / push notifications
- Expanded production monitoring (APM, uptime, centralized logs)

---

# Summary

SmartHire AI meets the non-functional requirements defined for an AI-powered interview and recruitment support system at project scale.

The implementation emphasizes performance within practical AI/hardware limits, security, maintainability, usability, database integrity, and extensibility.

The frontend is publicly deployed. Availability of the full product currently depends on the hybrid model (local API, local database, and tunnel). Moving the backend and PostgreSQL to the cloud is the primary remaining step for always-on production operation; CI/CD, broader automated testing, and notifications are additional optional hardening items.