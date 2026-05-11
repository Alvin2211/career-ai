import json

from fastapi import HTTPException
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate

from app.core.llmgoogle import llm


def call_llm(system_prompt: str, human_message: str):

    try:

        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_message),
        ])

        chain = prompt | llm

        response = chain.invoke({})

        return response.content.strip()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LLM Error: {str(e)}"
        )


def build_generate_interview_prompt(
    job_role: str,
    difficulty: str,
    interview_type: str,
    total_questions: int
):

    system = f"""
You are an expert interviewer.

Generate {total_questions} UNIQUE interview questions for a {job_role} role.

Difficulty Level:
{difficulty}

Interview Type:
{interview_type}

For EACH question provide:
- question
- expected_answer
- rubric

Return STRICT JSON ONLY.

Format:

{{
  "questions": [
    {{
      "question": "...",
      "expected_answer": "...",
      "rubric": "..."
    }}
  ]
}}
"""

    human = "Generate the interview."

    return system, human


def build_evaluate_interview_prompt(
    job_role: str,
    difficulty: str,
    interview_type: str,
    qa_pairs: list
):

    transcript = ""

    for i, qa in enumerate(qa_pairs, 1):

        transcript += f"""
Question {i}:
{qa.question}

Candidate Answer:
{qa.answer}

"""

    system = f"""
You are an expert interviewer evaluating a completed mock interview.

Role:
{job_role}

Difficulty:
{difficulty}

Interview Type:
{interview_type}

Evaluate ALL answers carefully.

Return STRICT JSON ONLY.

Format:

{{
  "overall_score": 8.5,
  "evaluations": [
    {{
      "question": "...",
      "score": 8,
      "feedback": "..."
    }}
  ],
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "suggestions": ["...", "..."],
  "summary": "..."
}}
"""

    human = transcript

    return system, human