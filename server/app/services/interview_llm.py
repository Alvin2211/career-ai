import json
from fastapi import HTTPException
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from app.core.llmgoogle import llm  




def call_llm(system_prompt: str, human_message: str) -> dict:
    try:
        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_message),
        ])

        chain = prompt | llm
        response = chain.invoke({})
        raw = response.content.strip()

        if raw.startswith("```"):
            raw = raw.strip("`")
            if raw.startswith("json"):
                raw = raw[4:].strip()

        return json.loads(raw)

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"LLM returned invalid JSON: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")




def build_generate_questions_prompt(job_role: str, difficulty: str, interview_type: str, total_questions: int):
    system = f"""You are an expert technical interviewer.

Generate exactly {total_questions} interview questions for a {job_role} position.
Difficulty level: {difficulty}
Interview type: {interview_type}

Rules:
- Each question must be unique and relevant to the role
- Match the difficulty and interview type provided
- Return ONLY valid JSON, no extra text, no markdown

Required JSON format:
{{
  "questions": [
    {{"question": "Write your question here"}},
    {{"question": "Write your question here"}},
    {{"question": "Write your question here"}},
    {{"question": "Write your question here"}},
    {{"question": "Write your question here"}}
  ]
}}"""

    human = "Generate the questions now."
    return system, human




def build_evaluate_answers_prompt(job_role: str, difficulty: str, interview_type: str, qa_pairs: list):

    transcript = ""
    for i, qa in enumerate(qa_pairs, 1):
        transcript += f"Q{i}: {qa.question}\nA{i}: {qa.answer}\n\n"

    system = f"""You are an expert interviewer evaluating a completed mock interview.

Candidate Role: {job_role}
Difficulty: {difficulty}
Interview Type: {interview_type}

Evaluate each answer carefully and give honest, constructive feedback.
Score each answer out of 10.
overall_score should be the average of all individual scores.

Return ONLY valid JSON, no extra text, no markdown.

Required JSON format:
{{
  "overall_score": 7.5,
  "evaluations": [
    {{
      "question": "the question text",
      "score": 8,
      "feedback": "clear feedback about this specific answer"
    }}
  ],
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": ["suggestion to improve 1", "suggestion to improve 2"],
  "summary": "a short overall summary of the candidate's performance"
}}"""

    human = f"Here is the interview transcript to evaluate:\n\n{transcript}"
    return system, human