def interview_evaluation_prompt(
    question: str,
    answer: str,
) -> str:

    return f"""
You are a Senior Technical Interviewer.

Evaluate the candidate's answer.

Question:
{question}

Candidate Answer:
{answer}

Return ONLY valid JSON.

Do not return markdown.

Format:

{{
    "score": 8,
    "strengths": [
        ""
    ],
    "weaknesses": [
        ""
    ],
    "ideal_answer": "",
    "feedback": ""
}}

Rules:

- score must be between 0 and 10.
- Return only JSON.
- Do not explain outside JSON.
"""