import json


def interview_report_prompt(
    questions,
):

    return f"""
You are an expert Senior Technical Interviewer.

Analyze the complete interview.

Candidate Responses:

{json.dumps(questions, indent=2)}

Return ONLY valid JSON.

{{
    "summary":"",

    "recommendation":"",

    "overall_strengths":[
    ],

    "overall_weaknesses":[
    ],

    "learning_plan":[
    ]
}}

Rules:

- Summary should be 5-8 lines.
- Recommendation must be one of:
  Strong Hire
  Hire
  Consider
  Needs Improvement
- Strengths should contain 4-6 bullet points.
- Weaknesses should contain 4-6 bullet points.
- Learning plan should contain 5 actionable items.

Return JSON only.
"""