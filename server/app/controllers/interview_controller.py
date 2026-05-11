import json

from app.schemas.interview import (
    GenerateInterviewRequest,
    GenerateInterviewResponse,
    EvaluateInterviewRequest,
    EvaluateInterviewResponse,
)

from app.services.interview_llm import (
    call_llm,
    build_generate_interview_prompt,
    build_evaluate_interview_prompt,
)


def handle_generate_interview(
    req: GenerateInterviewRequest
):

    system, human = build_generate_interview_prompt(
        job_role=req.job_role,
        difficulty=req.difficulty,
        interview_type=req.interview_type,
        total_questions=req.total_questions,
    )

    raw = call_llm(system, human)

    data = json.loads(raw)

    return GenerateInterviewResponse(**data)


def handle_evaluate_interview(
    req: EvaluateInterviewRequest
):

    system, human = build_evaluate_interview_prompt(
        job_role=req.job_role,
        difficulty=req.difficulty,
        interview_type=req.interview_type,
        qa_pairs=req.qa_pairs,
    )

    raw = call_llm(system, human)

    data = json.loads(raw)

    return EvaluateInterviewResponse(**data)