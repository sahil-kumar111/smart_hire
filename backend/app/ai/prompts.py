def resume_skill_prompt(
    resume_text: str,
) -> str:

    return f"""
You are an expert AI Resume Analyzer.

Analyze the following resume.

Return ONLY valid JSON.

Do not return markdown.
Do not return explanations.
Do not wrap the JSON inside ```.

Return the JSON in EXACTLY this format.

{{
    "technical_skills": [
        "Python",
        "C++"
    ],
    "soft_skills": [
        "Leadership"
    ],
    "frameworks": [
        "FastAPI",
        "React"
    ],
    "tools": [
        "Git",
        "Docker"
    ],
    "databases": [
        "PostgreSQL"
    ],
    "cloud": [
        "Google Cloud"
    ],
    "certifications": [
        "Azure AI Fundamentals"
    ],
    "education": [
        {{
            "institution": "",
            "degree": "",
            "gpa": "",
            "grade": "",
            "start_date": "",
            "end_date": ""
        }}
    ],
    "experience": [
        {{
            "title": "",
            "company": "",
            "location": "",
            "start_date": "",
            "end_date": "",
            "description": [
                ""
            ]
        }}
    ],
    "projects": [
        {{
            "title": "",
            "tech_stack": [
                ""
            ],
            "start_date": "",
            "end_date": "",
            "description": [
                ""
            ]
        }}
    ]
}}

Rules:

- Return ONLY JSON.
- If a field is unavailable, return an empty string "".
- If a section does not exist, return an empty list [].
- Never invent information.
- Do not omit any keys.
- Ensure the JSON is valid.

Resume:

{resume_text}
"""