# Database Design

## Introduction

SmartHire AI uses **PostgreSQL** as its primary Relational Database Management System (RDBMS). The database is designed to efficiently manage:

- User authentication and role-based access
- Resume storage and AI-generated resume analysis
- Job Description (JD) storage and Resume–JD matching support
- Interview sessions with HR, Technical, and Managerial interview types
- Conversational interview history
- Candidate answers and AI evaluations
- Real-time interview monitoring and analytics snapshots
- Recruiter shortlisting decisions
- Referential integrity and cascade-safe account deletion

The database follows **Third Normal Form (3NF)** principles to reduce redundancy, maintain data consistency, and support scalability.

---

## Database Objectives

The database is designed to:

- Store user accounts securely
- Support Role-Based Access Control (RBAC) for candidates, recruiters, and administrators
- Manage uploaded resumes
- Store AI-generated resume analysis
- Store Job Descriptions for users
- Support Resume–JD matching
- Manage interview sessions with multiple interview types
- Store conversational interview history
- Store candidate answers and AI-generated evaluations
- Store real-time interview monitoring results
- Store timeline-based monitoring snapshots
- Support recruiter shortlisting decisions
- Maintain referential integrity using primary and foreign keys
- Enforce uniqueness where required
- Support cascade-aware deletion of users and related records
- Provide a scalable foundation for future recruitment features

---

## Deployment Context

In the current release:

| Component | Location |
|-----------|----------|
| Database | Local PostgreSQL instance |
| Backend API | Local FastAPI process |
| Frontend | Deployed on Vercel |
| Public API access | ngrok tunnel to the local API |

Application data therefore lives on the developer's PostgreSQL server while the UI is served publicly from Vercel. Moving PostgreSQL and the API to a managed cloud host remains an optional next step.

---

# Database Tables

## 1. Users

**Purpose:** Stores all registered platform users.

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique User ID |
| full_name | String | NOT NULL | User's full name |
| email | String | UNIQUE, NOT NULL | Unique email address |
| hashed_password | String | NOT NULL | Securely hashed password |
| role | String | NOT NULL | `candidate`, `recruiter`, or `admin` |
| created_at | Timestamp | NOT NULL | Account creation time |

### Relationships

- One User can own many Resumes.
- One User can have at most one Job Description.
- One User can participate in many Interview Sessions.
- One Recruiter User can create many Recruiter Shortlist entries.

---

## 2. Resumes

**Purpose:** Stores uploaded resumes and their extracted text.

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique Resume ID |
| owner_id | Integer | FK → Users.id, NOT NULL | Owner of the resume |
| filename | String | NOT NULL | Uploaded resume filename |
| file_path | String | NOT NULL | Storage path of the uploaded resume |
| extracted_text | Text | Nullable | Text extracted from the resume |
| uploaded_at | Timestamp | NOT NULL | Resume upload time |

### Relationships

- Many Resumes belong to one User.
- One Resume has one Resume Analysis.
- One Resume can have many Interview Questions.
- One Resume can have many Interview Sessions.

---

## 3. Resume Analysis

**Purpose:** Stores structured AI-generated insights extracted from a resume using an LLM.

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique Analysis ID |
| resume_id | Integer | FK → Resumes.id, UNIQUE, NOT NULL | Associated resume |
| technical_skills | JSON | Nullable | Extracted technical skills |
| soft_skills | JSON | Nullable | Extracted soft skills |
| frameworks | JSON | Nullable | Extracted frameworks |
| tools | JSON | Nullable | Extracted tools |
| databases | JSON | Nullable | Extracted database technologies |
| cloud | JSON | Nullable | Extracted cloud technologies |
| certifications | JSON | Nullable | Extracted certifications |
| education | JSON | Nullable | Extracted education details |
| experience | JSON | Nullable | Extracted experience details |
| projects | JSON | Nullable | Extracted project details |
| created_at | Timestamp | NOT NULL | Analysis creation time |

### Relationships

- One Resume has one Resume Analysis.
- Each Resume Analysis belongs to exactly one Resume.

---

## 4. Job Descriptions

**Purpose:** Stores the Job Description associated with a candidate and supports Resume–JD matching and interview personalization.

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique Job Description ID |
| user_id | Integer | FK → Users.id, UNIQUE, NOT NULL | User associated with the JD |
| jd_text | Text | NOT NULL | Job Description content |
| created_at | Timestamp | NOT NULL | JD creation time |
| updated_at | Timestamp | NOT NULL | Last JD update time |

### Relationships

- One User can have zero or one Job Description.
- Each Job Description belongs to exactly one User.

The `UNIQUE` constraint on `user_id` implements the current **create-or-update** model.

---

## 5. Interview Questions

**Purpose:** Stores AI-generated interview questions based on resume content.

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique Question ID |
| resume_id | Integer | FK → Resumes.id, NOT NULL | Resume used to generate the question |
| question | Text | NOT NULL | Generated interview question |
| category | String | NOT NULL | Question category |
| difficulty | String | NOT NULL | Question difficulty |
| expected_points | JSONB | Nullable | Expected answer points |
| created_at | Timestamp | NOT NULL | Question creation time |

### Relationships

- One Resume can generate many Interview Questions.
- One Interview Question can be referenced by many Interview Answers.

---

## 6. Interview Sessions

**Purpose:** Represents a complete interview conducted by a candidate.

Supported interview types:

- `hr`
- `technical`
- `managerial`

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique Interview Session ID |
| resume_id | Integer | FK → Resumes.id, NOT NULL | Resume used for the interview |
| user_id | Integer | FK → Users.id, NOT NULL | Candidate conducting the interview |
| status | String | NOT NULL | `IN_PROGRESS` or `COMPLETED` |
| interview_type | String | NOT NULL | `hr`, `technical`, or `managerial` |
| started_at | Timestamp | NOT NULL | Interview start time |
| completed_at | Timestamp | Nullable | Interview completion time |

### Relationships

- One User can have many Interview Sessions.
- One Resume can be associated with many Interview Sessions.
- One Interview Session contains many Interview Conversations.
- One Interview Session contains many Interview Answers.
- One Interview Session has at most one Interview Monitor Report.
- One Interview Session contains many Interview Monitor Snapshots.
- One Interview Session can appear in many Recruiter Shortlist entries.

---

## 7. Interview Conversations

**Purpose:** Stores the conversational history between the candidate and the AI interviewer during an interview.

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique Conversation Message ID |
| session_id | Integer | FK → InterviewSessions.id, NOT NULL | Associated interview session |
| role | String | NOT NULL | Message sender role |
| message | Text | NOT NULL | Conversation message |
| created_at | Timestamp | NOT NULL | Message creation time |

Supported message roles may include:

- `candidate`
- `interviewer`
- `assistant`
- `user`

### Relationships

- Many Conversation Messages belong to one Interview Session.

---

## 8. Interview Answers

**Purpose:** Stores structured answers submitted by the candidate during an interview.

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique Answer ID |
| session_id | Integer | FK → InterviewSessions.id, NOT NULL | Associated interview session |
| question_id | Integer | FK → InterviewQuestions.id, NOT NULL | Question being answered |
| candidate_answer | Text | NOT NULL | Candidate's answer |
| ai_score | Float | Nullable | AI-generated answer score |
| ai_feedback | Text | Nullable | AI-generated answer feedback |
| created_at | Timestamp | NOT NULL | Answer submission time |

### Relationships

- Many Interview Answers belong to one Interview Session.
- Many Interview Answers can reference one Interview Question.
- One Interview Answer has at most one Interview Evaluation.

---

## 9. Interview Evaluations

**Purpose:** Stores detailed AI-generated evaluation of an individual candidate answer.

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique Evaluation ID |
| answer_id | Integer | FK → InterviewAnswers.id, UNIQUE, NOT NULL | Associated interview answer |
| score | Float | NOT NULL | Detailed evaluation score |
| strengths | JSON | Nullable | Identified strengths |
| weaknesses | JSON | Nullable | Identified weaknesses |
| ideal_answer | Text | Nullable | AI-generated ideal answer |
| feedback | Text | Nullable | Detailed evaluation feedback |

### Relationships

- One Interview Answer has at most one Interview Evaluation.
- Each Interview Evaluation belongs to exactly one Interview Answer.

The `UNIQUE` constraint on `answer_id` enforces the one-to-one relationship.

---

## 10. Interview Monitor Reports

**Purpose:** Stores the final AI-generated monitoring summary for an interview session. Used by the Feedback Dashboard and related analytics.

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique Monitoring Report ID |
| session_id | Integer | FK → InterviewSessions.id, UNIQUE, NOT NULL | Associated interview session |
| overall_score | Float | Nullable | Overall monitoring score |
| fluency_score | Float | Nullable | Fluency score |
| eye_contact_score | Float | Nullable | Eye-contact score |
| filler_count | Integer | Nullable | Number of detected filler words |
| dominant_emotion | String | Nullable | Dominant detected emotion |
| recommendation | String | Nullable | Overall recommendation |
| transcript | Text | Nullable | Complete interview transcript |
| word_count | Integer | Nullable | Number of words in transcript |
| summary | Text | Nullable | AI-generated interview summary |
| strengths | JSON | Nullable | Identified candidate strengths |
| weaknesses | JSON | Nullable | Identified candidate weaknesses |
| suggestions | JSON | Nullable | Improvement suggestions |
| created_at | Timestamp | NOT NULL | Report creation time |

### Relationships

- One Interview Session has at most one Interview Monitor Report.
- Each Interview Monitor Report belongs to exactly one Interview Session.

The `UNIQUE` constraint on `session_id` enforces the one-to-one relationship.

---

## 11. Interview Monitor Snapshots

**Purpose:** Stores AI analysis results captured during live interview monitoring. These snapshots support timeline-based analytics and visualization.

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique Snapshot ID |
| session_id | Integer | FK → InterviewSessions.id, NOT NULL | Associated interview session |
| second | Integer | Nullable | Timeline position in seconds |
| transcript | Text | Nullable | Transcript available at the snapshot |
| emotion | String | Nullable | Detected emotion |
| eye_contact_score | Float | Nullable | Eye-contact score |
| filler_count | Integer | Nullable | Filler-word count |
| fluency_score | Float | Nullable | Fluency score |
| overall_score | Float | Nullable | Overall snapshot score |
| created_at | Timestamp | NOT NULL | Snapshot creation time |

### Relationships

- Many Interview Monitor Snapshots belong to one Interview Session.

---

## 12. Recruiter Shortlists

**Purpose:** Stores recruiter decisions regarding candidate interview sessions.

| Attribute | Type | Constraints | Description |
|---|---|---|---|
| id | Integer | PK | Unique Shortlist ID |
| recruiter_id | Integer | FK → Users.id, NOT NULL | Recruiter making the decision |
| session_id | Integer | FK → InterviewSessions.id, NOT NULL | Interview session being reviewed |
| status | String | NOT NULL | `pending`, `shortlisted`, or `rejected` |
| created_at | Timestamp | NOT NULL | Shortlist record creation time |
| updated_at | Timestamp | NOT NULL | Last decision update time |

### Constraints

A unique composite constraint is applied to:

```text
(recruiter_id, session_id)
```

This prevents the same recruiter from creating duplicate shortlist records for the same interview session.

### Relationships

- Many Recruiter Shortlist entries belong to one Recruiter User.
- Many Recruiter Shortlist entries can reference one Interview Session.
- Each Recruiter Shortlist entry references exactly one Interview Session.

---

# Entity Relationship Overview

```text
Users (1)
│
├── JobDescriptions (0..1)
│
├── Resumes (N)
│   ├── ResumeAnalysis (1)
│   ├── InterviewQuestions (N)
│   │   └── InterviewAnswers (N)
│   │       └── InterviewEvaluations (0..1)
│   │
│   └── InterviewSessions (N)
│       ├── InterviewConversations (N)
│       ├── InterviewAnswers (N)
│       ├── InterviewMonitorReports (0..1)
│       ├── InterviewMonitorSnapshots (N)
│       └── RecruiterShortlists (N)
│
└── RecruiterShortlists (N)

RecruiterShortlists (N) ──── (1) InterviewSessions
```

---

# Database Relationships

| Parent | Child | Relationship |
|---|---|---|
| User | Resume | One-to-Many |
| User | Job Description | One-to-One / Optional |
| User | Interview Session | One-to-Many |
| User (Recruiter) | Recruiter Shortlist | One-to-Many |
| Resume | Resume Analysis | One-to-One |
| Resume | Interview Question | One-to-Many |
| Resume | Interview Session | One-to-Many |
| Interview Session | Interview Conversation | One-to-Many |
| Interview Session | Interview Answer | One-to-Many |
| Interview Question | Interview Answer | One-to-Many |
| Interview Answer | Interview Evaluation | One-to-One / Optional |
| Interview Session | Interview Monitor Report | One-to-One / Optional |
| Interview Session | Interview Monitor Snapshot | One-to-Many |
| Interview Session | Recruiter Shortlist | One-to-Many |

---

# Database Normalization

The SmartHire AI database follows the principles of **Third Normal Form (3NF)**.

## First Normal Form (1NF)

- Atomic values for individual attributes
- No repeating groups within a table
- Unique primary keys for every record
- Separate tables for logically different entities

JSON/JSONB fields are used only where structured AI-generated collections are intentionally stored as a single attribute.

## Second Normal Form (2NF)

- Every table has a defined primary key
- Non-key attributes depend on the complete primary key
- The schema does not rely on unnecessary composite primary keys

## Third Normal Form (3NF)

- Non-key attributes depend directly on the primary key
- Transitive dependencies are minimized
- Related entities are separated into independent tables
- Foreign keys represent relationships rather than duplicating entity information

---

# Data Integrity

Data integrity is maintained through:

- Primary key constraints
- Foreign key constraints
- Unique constraints
- NOT NULL constraints
- SQLAlchemy ORM relationships
- Alembic database migrations
- Application-level validation
- Cascade-aware deletion logic
- Composite uniqueness constraints where required

---

# Cascade-Aware Deletion

User deletion is designed to safely remove or handle related records, including:

- Resumes
- Resume Analysis
- Job Descriptions
- Interview Questions
- Interview Sessions
- Interview Conversations
- Interview Answers
- Interview Evaluations
- Interview Monitor Reports
- Interview Monitor Snapshots
- Recruiter Shortlist records

Exact behavior is controlled by SQLAlchemy relationships, foreign-key rules, and application service logic.

---

# Implementation Status

| Table | Status |
|---|---|
| Users | Implemented |
| Resumes | Implemented |
| Resume Analysis | Implemented |
| Job Descriptions | Implemented |
| Interview Questions | Implemented |
| Interview Sessions | Implemented |
| Interview Conversations | Implemented |
| Interview Answers | Implemented |
| Interview Evaluations | Implemented |
| Interview Monitor Reports | Implemented |
| Interview Monitor Snapshots | Implemented |
| Recruiter Shortlists | Implemented |

**Schema status:** Complete for the current product release (hybrid deployment with local PostgreSQL).

---

# Database Features

The current database supports:

- Secure user authentication
- Role-Based Access Control (candidate, recruiter, admin)
- Resume upload and management
- Resume text extraction
- AI-powered resume analysis
- Job Description storage
- Resume–JD matching support
- Dynamic interview type selection (HR / Technical / Managerial)
- Conversational AI interviews
- Interview session tracking
- Interview question management
- Candidate answer storage
- AI-based answer evaluation
- Speech-to-text transcript storage
- Emotion detection results
- Eye-contact analysis
- Filler-word analysis
- Fluency scoring
- Interview monitoring reports
- Timeline-based monitoring snapshots
- Analytics and feedback data
- Recruiter shortlisting workflow
- Admin user visibility
- Referential integrity
- Cascade-aware account deletion
- Database migrations using Alembic

---

# Database Summary

The SmartHire AI database provides a modular, normalized, and scalable foundation for an AI-powered interview and recruitment platform.

## Current Implementation

- User authentication and role management
- Resume storage and AI analysis
- Job Description management and matching support
- Dynamic interview types and conversational interviews
- Session management, answers, and evaluations
- Real-time monitoring (speech, emotion, eye contact, fillers, fluency)
- Analytics and feedback storage
- Recruiter shortlisting
- Admin-oriented user data
- Local PostgreSQL in the hybrid Vercel + local API deployment model

## Design Principles

- **Modular** — Separate tables for independent business entities
- **Normalized** — 3NF to minimize redundancy
- **Scalable** — Ready for additional recruitment features
- **Referentially consistent** — Foreign keys and constraints
- **Maintainable** — SQLAlchemy ORM and Alembic
- **Extensible** — Supports future workflows and AI capabilities
- **Cloud-ready** — Can be moved to managed PostgreSQL without redesigning the schema

---

# Conclusion

The SmartHire AI database supports the full workflow of an AI-powered interview and recruitment platform: registration, resume analysis, JD matching, typed AI interviews, real-time monitoring, performance evaluation, and recruiter shortlisting.

PostgreSQL, normalized relational design, JSON/JSONB for AI-structured data, foreign keys, uniqueness constraints, SQLAlchemy, and Alembic together provide a reliable foundation for the current hybrid deployment and for a future fully cloud-hosted backend.