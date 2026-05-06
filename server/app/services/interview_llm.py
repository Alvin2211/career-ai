from fastapi import HTTPException
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from app.core.llmgoogle import llm


def call_llm(system_prompt: str, human_message: str) -> str:
    try:
        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_message),
        ])
        chain = prompt | llm
        response = chain.invoke({})
        return response.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")


def build_question_prompt(job_role: str, difficulty: str, interview_type: str, previous_questions: list[str]) -> tuple[str, str]:
    previous = "\n".join(f"- {q}" for q in previous_questions) if previous_questions else "None"

    system = f"""You are a strict but fair interviewer conducting a {difficulty}-level {interview_type} interview for a {job_role} position.
Your job is to ask ONE interview question at a time.
Rules:
- Must be relevant to: {job_role}
- Match difficulty: {difficulty} (entry = basic concepts, mid = applied knowledge, senior = deep expertise & system design)
- Interview type: {interview_type} (technical = coding/systems/tools, hr = behavioral/situational, mixed = either)
- NEVER repeat a previously asked question
- Output ONLY the question itself — no numbering, no preamble, no explanation"""

    human = f"Previously asked questions:\n{previous}\n\nAsk the next question."

    return system, human


def build_evaluate_prompt(job_role: str, difficulty: str, question: str, answer: str) -> tuple[str, str]:
    system = f"""You are an expert interviewer evaluating a candidate's answer for a {difficulty}-level {job_role} position.
Evaluate based on:
- Accuracy and correctness
- Depth of knowledge expected at {difficulty} level
- Clarity and relevance to the question

Respond in this EXACT format (no markdown, no extra lines):
FEEDBACK: <2-3 sentence constructive feedback>
SCORE: <integer from 1 to 10>"""

    human = f"Question: {question}\n\nCandidate's answer: {answer}"

    return system, human


def build_report_prompt(job_role: str, difficulty: str, interview_type: str, transcript: str, overall_score: float) -> tuple[str, str]:
    system = f"""You are an expert career counselor reviewing a completed mock interview for a {job_role} position ({difficulty} level, {interview_type} type).
Generate a structured performance report in this EXACT format (no markdown, no extra text):

STRENGTHS:
- <strength 1>
- <strength 2>
- <strength 3>

WEAKNESSES:
- <weakness 1>
- <weakness 2>
- <weakness 3>

SUGGESTIONS:
- <actionable suggestion 1>
- <actionable suggestion 2>
- <actionable suggestion 3>

SUMMARY:
<2-3 sentence overall summary of the candidate's performance and readiness for the role>"""

    human = f"Overall average score: {overall_score}/10\n\nInterview transcript:\n{transcript}"

    return system, human