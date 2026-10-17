import io
import time
import pytest
from fastapi.testclient import TestClient
from reportlab.pdfgen import canvas

from app.main import app

client = TestClient(app)

def create_sample_pdf() -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf)
    c.drawString(100, 750, "Jane Doe - Full Stack Developer")
    c.drawString(100, 730, "Skills: Python, FastAPI, React, PostgreSQL, Docker, AWS")
    c.drawString(100, 710, "Experience: 5 years developing scalable cloud services and modern web applications.")
    c.drawString(100, 690, "Education: BS in Computer Science")
    c.save()
    return buf.getvalue()

def test_01_root_and_health():
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert "SmartHire AI" in res_root.json().get("app", "")

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json().get("status") == "healthy"

def test_02_authentication_flow():
    timestamp = int(time.time())
    candidate_email = f"candidate_{timestamp}@example.com"
    recruiter_email = f"recruiter_{timestamp}@example.com"
    password = "SecurePassword123!"

    # 1. Register candidate
    res_reg_c = client.post("/api/v1/auth/register", json={
        "email": candidate_email,
        "password": password,
        "full_name": "Test Candidate",
        "role": "candidate"
    })
    assert res_reg_c.status_code == 201, res_reg_c.text
    data_c = res_reg_c.json()
    assert data_c["email"] == candidate_email
    assert data_c["role"] == "candidate"

    # 2. Login candidate
    res_login_c = client.post("/api/v1/auth/login", json={
        "email": candidate_email,
        "password": password
    })
    assert res_login_c.status_code == 200, res_login_c.text
    cand_token = res_login_c.json()["access_token"]
    assert cand_token

    # 3. Verify candidate profile
    res_me_c = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {cand_token}"})
    assert res_me_c.status_code == 200
    assert res_me_c.json()["email"] == candidate_email

    # 4. Register recruiter
    res_reg_r = client.post("/api/v1/auth/register", json={
        "email": recruiter_email,
        "password": password,
        "full_name": "Test Recruiter",
        "role": "recruiter"
    })
    assert res_reg_r.status_code == 201, res_reg_r.text

    # 5. Login recruiter
    res_login_r = client.post("/api/v1/auth/login", json={
        "email": recruiter_email,
        "password": password
    })
    assert res_login_r.status_code == 200
    rec_token = res_login_r.json()["access_token"]
    assert rec_token

def test_03_full_candidate_recruiter_interview_lifecycle():
    timestamp = int(time.time())
    cand_email = f"cand_life_{timestamp}@test.com"
    rec_email = f"rec_life_{timestamp}@test.com"
    password = "Password123!"

    # Candidate setup
    res_c_reg = client.post("/api/v1/auth/register", json={
        "email": cand_email, "password": password, "full_name": "Life Candidate", "role": "candidate"
    })
    assert res_c_reg.status_code == 201, res_c_reg.text
    c_login = client.post("/api/v1/auth/login", json={"email": cand_email, "password": password}).json()
    c_token = c_login["access_token"]
    c_headers = {"Authorization": f"Bearer {c_token}"}

    # Recruiter setup
    res_r_reg = client.post("/api/v1/auth/register", json={
        "email": rec_email, "password": password, "full_name": "Life Recruiter", "role": "recruiter"
    })
    assert res_r_reg.status_code == 201, res_r_reg.text
    r_login = client.post("/api/v1/auth/login", json={"email": rec_email, "password": password}).json()
    r_token = r_login["access_token"]
    r_headers = {"Authorization": f"Bearer {r_token}"}

    # Step A: Candidate uploads resume
    pdf_content = create_sample_pdf()
    res_upload = client.post(
        "/api/v1/resume/upload",
        headers=c_headers,
        files={"file": ("test_resume.pdf", pdf_content, "application/pdf")}
    )
    assert res_upload.status_code == 200, res_upload.text
    resume_data = res_upload.json()
    resume_id = resume_data["id"]
    assert resume_id > 0

    # Step A.1: Candidate analyzes resume with AI
    res_an_resume = client.get(f"/api/v1/resume/analyze/{resume_id}", headers=c_headers)
    assert res_an_resume.status_code == 200, res_an_resume.text
    an_data = res_an_resume.json()
    assert "analysis" in an_data

    # Step B: Recruiter posts Job Description
    jd_text = "Looking for a Senior Python Developer with experience in FastAPI, PostgreSQL, and React."
    res_jd = client.post(
        "/api/v1/job-description",
        headers=r_headers,
        json={"jd_text": jd_text}
    )
    assert res_jd.status_code == 200, res_jd.text
    jd_data = res_jd.json()
    assert jd_data["jd_text"] == jd_text

    # Step C: Recruiter gets Job Description
    res_get_jd = client.get("/api/v1/job-description", headers=r_headers)
    assert res_get_jd.status_code == 200
    assert res_get_jd.json()["id"] == jd_data["id"]

    # Step D: Recruiter matches candidate resume with JD
    res_match = client.post(
        "/api/v1/resume/match",
        headers=r_headers,
        json={"resume_id": resume_id}
    )
    assert res_match.status_code == 200, res_match.text
    match_result = res_match.json()
    assert "match_score" in match_result
    assert match_result["match_score"] >= 0

    # Step E: Candidate generates questions for resume
    res_q = client.get(f"/api/v1/interview/generate/{resume_id}", headers=c_headers)
    assert res_q.status_code == 200, res_q.text
    questions = res_q.json()
    assert len(questions) > 0
    first_q = questions[0]
    assert "question" in first_q

    # Step F: Candidate starts interview session
    res_start = client.post(
        f"/api/v1/interview/start/{resume_id}",
        headers=c_headers,
        json={"interview_type": "technical"}
    )
    assert res_start.status_code == 200, res_start.text
    session = res_start.json()
    session_id = session["id"]
    assert session_id > 0

    # Step G: Candidate interacts via conversational chat
    res_chat = client.post(
        f"/api/v1/interview/chat/{session_id}",
        headers=c_headers,
        json={"message": "Hello, I am ready for the technical interview. Can you ask me about Python and FastAPI?"}
    )
    assert res_chat.status_code == 200, res_chat.text
    chat_resp = res_chat.json()
    assert "reply" in chat_resp and len(chat_resp["reply"]) > 0

    # Step H: Candidate submits an answer to the first question
    res_ans = client.post(
        "/api/v1/interview/answer",
        headers=c_headers,
        json={
            "session_id": session_id,
            "question_id": first_q["id"],
            "candidate_answer": "In Python, FastAPI uses ASGI and Pydantic for high performance asynchronous request validation and dependency injection."
        }
    )
    assert res_ans.status_code == 200, res_ans.text
    ans_data = res_ans.json()
    assert ans_data["session_id"] == session_id

    # Step I: Candidate finishes the interview session
    res_finish = client.post(f"/api/v1/interview/finish/{session_id}", headers=c_headers)
    assert res_finish.status_code == 200, res_finish.text
    assert res_finish.json()["status"].upper() == "COMPLETED"

    # Step J: Candidate queries feedback and analytics
    res_fb = client.get(f"/api/v1/interview-monitor/feedback/{session_id}", headers=c_headers)
    assert res_fb.status_code in [200, 404]

    res_an = client.get(f"/api/v1/interview-monitor/analytics/{session_id}", headers=c_headers)
    assert res_an.status_code in [200, 404]

    # Step K: Download PDF Report
    res_pdf = client.get(f"/api/v1/report/interview/{session_id}", headers=c_headers)
    assert res_pdf.status_code == 200, res_pdf.text
    assert res_pdf.headers.get("content-type") == "application/pdf"
    assert res_pdf.content.startswith(b"%PDF")
