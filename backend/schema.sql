-- =============================================================================
-- SmartHire AI — Complete Production PostgreSQL Schema (Neon Database)
-- =============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'candidate',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_users_id ON users (id);
CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);

-- 2. Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    filename VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    extracted_text TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_resumes_id ON resumes (id);
CREATE INDEX IF NOT EXISTS ix_resumes_owner_id ON resumes (owner_id);

-- 3. Resume Analysis Table
CREATE TABLE IF NOT EXISTS resume_analysis (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL UNIQUE REFERENCES resumes(id) ON DELETE CASCADE,
    technical_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    soft_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    frameworks JSONB NOT NULL DEFAULT '[]'::jsonb,
    tools JSONB NOT NULL DEFAULT '[]'::jsonb,
    databases JSONB NOT NULL DEFAULT '[]'::jsonb,
    cloud JSONB NOT NULL DEFAULT '[]'::jsonb,
    certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    education JSONB NOT NULL DEFAULT '[]'::jsonb,
    experience JSONB NOT NULL DEFAULT '[]'::jsonb,
    projects JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_resume_analysis_id ON resume_analysis (id);
CREATE INDEX IF NOT EXISTS ix_resume_analysis_resume_id ON resume_analysis (resume_id);

-- 4. Job Descriptions Table
CREATE TABLE IF NOT EXISTS job_descriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    jd_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_job_descriptions_id ON job_descriptions (id);
CREATE INDEX IF NOT EXISTS ix_job_descriptions_user_id ON job_descriptions (user_id);

-- 5. Interview Sessions Table
CREATE TABLE IF NOT EXISTS interview_sessions (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR NOT NULL DEFAULT 'IN_PROGRESS',
    interview_type VARCHAR(50) NOT NULL DEFAULT 'technical',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ix_interview_sessions_id ON interview_sessions (id);
CREATE INDEX IF NOT EXISTS ix_interview_sessions_user_id ON interview_sessions (user_id);
CREATE INDEX IF NOT EXISTS ix_interview_sessions_resume_id ON interview_sessions (resume_id);

-- 6. Interview Questions Table
CREATE TABLE IF NOT EXISTS interview_questions (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    expected_points JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_interview_questions_id ON interview_questions (id);
CREATE INDEX IF NOT EXISTS ix_interview_questions_resume_id ON interview_questions (resume_id);

-- 7. Interview Answers Table
CREATE TABLE IF NOT EXISTS interview_answers (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
    candidate_answer TEXT NOT NULL,
    ai_score FLOAT,
    ai_feedback TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_interview_answers_id ON interview_answers (id);
CREATE INDEX IF NOT EXISTS ix_interview_answers_session_id ON interview_answers (session_id);
CREATE INDEX IF NOT EXISTS ix_interview_answers_question_id ON interview_answers (question_id);

-- 8. Interview Evaluations Table
CREATE TABLE IF NOT EXISTS interview_evaluations (
    id SERIAL PRIMARY KEY,
    answer_id INTEGER NOT NULL UNIQUE REFERENCES interview_answers(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    strengths JSONB,
    weaknesses JSONB,
    ideal_answer TEXT,
    feedback TEXT
);
CREATE INDEX IF NOT EXISTS ix_interview_evaluations_id ON interview_evaluations (id);
CREATE INDEX IF NOT EXISTS ix_interview_evaluations_answer_id ON interview_evaluations (answer_id);

-- 9. Interview Conversations Table (Live Chat)
CREATE TABLE IF NOT EXISTS interview_conversations (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_interview_conversations_id ON interview_conversations (id);
CREATE INDEX IF NOT EXISTS ix_interview_conversations_session_id ON interview_conversations (session_id);

-- 10. Interview Monitor Reports Table
CREATE TABLE IF NOT EXISTS interview_monitor_reports (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    transcript TEXT NOT NULL,
    word_count INTEGER DEFAULT 0,
    duration FLOAT DEFAULT 0,
    filler_count INTEGER DEFAULT 0,
    fluency_score FLOAT DEFAULT 0,
    confidence_score FLOAT DEFAULT 0,
    dominant_emotion VARCHAR NOT NULL,
    eye_contact_score FLOAT DEFAULT 0,
    overall_score FLOAT DEFAULT 0,
    recommendation VARCHAR NOT NULL,
    summary TEXT,
    strengths JSONB,
    weaknesses JSONB,
    suggestions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_interview_monitor_reports_id ON interview_monitor_reports (id);
CREATE INDEX IF NOT EXISTS ix_interview_monitor_reports_session_id ON interview_monitor_reports (session_id);

-- 11. Interview Monitor Snapshots Table
CREATE TABLE IF NOT EXISTS interview_monitor_snapshots (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    second FLOAT NOT NULL,
    emotion VARCHAR NOT NULL,
    eye_contact_score FLOAT DEFAULT 0,
    fluency_score FLOAT DEFAULT 0,
    filler_count INTEGER DEFAULT 0,
    overall_score FLOAT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_interview_monitor_snapshots_id ON interview_monitor_snapshots (id);
CREATE INDEX IF NOT EXISTS ix_interview_monitor_snapshots_session_id ON interview_monitor_snapshots (session_id);

-- 12. Recruiter Shortlists Table
CREATE TABLE IF NOT EXISTS recruiter_shortlists (
    id SERIAL PRIMARY KEY,
    recruiter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id INTEGER NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_recruiter_session UNIQUE (recruiter_id, session_id)
);
CREATE INDEX IF NOT EXISTS ix_recruiter_shortlists_id ON recruiter_shortlists (id);
CREATE INDEX IF NOT EXISTS ix_recruiter_shortlists_recruiter_id ON recruiter_shortlists (recruiter_id);
CREATE INDEX IF NOT EXISTS ix_recruiter_shortlists_session_id ON recruiter_shortlists (session_id);
