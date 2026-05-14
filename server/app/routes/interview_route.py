from fastapi import APIRouter

from app.schemas.interview import (
    GenerateQuestionsRequest,
    GenerateQuestionsResponse,
    EvaluateAnswersRequest,
    EvaluateAnswersResponse,
)
from app.services.interview_llm import (
    call_llm,
    build_generate_questions_prompt,
    build_evaluate_answers_prompt,
)

router = APIRouter(prefix="/api1", tags=["Interview"])

@router.post("/generate-questions", response_model=GenerateQuestionsResponse)
def generate_questions(req: GenerateQuestionsRequest):
    system, human = build_generate_questions_prompt(
        job_role=req.job_role,
        difficulty=req.difficulty,
        interview_type=req.interview_type,
        total_questions=req.total_questions,
    )
    data = call_llm(system, human)
    return GenerateQuestionsResponse(**data)

@router.post("/evaluate-answers", response_model=EvaluateAnswersResponse)
def evaluate_answers(req: EvaluateAnswersRequest):
    system, human = build_evaluate_answers_prompt(
        job_role=req.job_role,
        difficulty=req.difficulty,
        interview_type=req.interview_type,
        qa_pairs=req.qa_pairs,
    )
    data = call_llm(system, human)
    return EvaluateAnswersResponse(**data)