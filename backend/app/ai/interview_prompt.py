def interview_question_generation_prompt(
    resume_analysis: dict,
    num_questions: int = 5,
) -> str:
    return f"""You are a Senior Technical Interviewer and Hiring Specialist.
Analyze the candidate's resume analysis below and generate {num_questions} tailored interview questions covering the candidate's technical skills, projects, and domain.

Resume Analysis:
{resume_analysis}

Return ONLY a JSON array of objects. Do not include markdown codeblocks or extra explanations.
Each object must have exactly these keys:
- "question": string (the exact interview question)
- "category": string (e.g., "Python", "Data Structures", "System Design", "Databases", "Behavioral")
- "difficulty": string ("Easy", "Medium", or "Hard")
- "expected_points": list of strings (3 to 5 key points expected in a comprehensive answer)

Format:
[
  {{
    "question": "Explain how database indexing improves query performance and when it might cause overhead.",
    "category": "Databases",
    "difficulty": "Medium",
    "expected_points": ["B-tree / Hash indexes", "Disk I/O reduction", "Write overhead on INSERT/UPDATE", "Index maintenance cost"]
  }}
]
"""


def interview_prompt(
    resume_analysis,
    conversation=None,
    candidate_message="",
    interview_type: str = "technical",
):
    if conversation is None:
        conversation = []


    if interview_type == "hr":
        role = "an experienced Senior HR Interviewer"
        focus = """
Focus ONLY on HR / screening topics:
- Self-introduction and background
- Career goals and motivation
- Strengths and weaknesses
- Behavioral questions (STAR method)
- Teamwork and cultural fit
- Why this role / company

Do NOT ask technical, coding, or system design questions.
"""
    elif interview_type == "managerial":
        role = "an experienced Senior Hiring Manager"
        focus = """
Focus ONLY on managerial / leadership topics:
- Leadership and decision-making
- Conflict resolution
- Team management and people skills
- Handling pressure and deadlines
- Project ownership and prioritization
- Situational and behavioral questions

Do NOT ask pure coding or deep technical questions.
"""
    else:
        role = "an experienced Senior Technical Interviewer"
        focus = """
Focus on technical topics:
- Skills and technologies from the resume
- Problem-solving and coding concepts
- Projects and technologies used
- System design (if relevant)
- Domain knowledge
"""

    return f"""
You are {role}.

Your task is to conduct a natural, human-like interview.

{focus}

Resume Analysis:
{resume_analysis}

Conversation History:
{conversation}

Candidate's Latest Message:
{candidate_message}

Rules:

- Ask only ONE question at a time.
- Keep the interview conversational.
- If the candidate asks something, answer naturally.
- Do not dump multiple questions.
- Follow up based on previous answers.
- When enough information has been collected (about 5-7 questions), finish the interview.

Return ONLY valid JSON.

{{
    "reply": "your next response",
    "interview_finished": false
}}
"""