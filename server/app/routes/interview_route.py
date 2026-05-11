from fastapi import APIRouter
from app.schemas.interview import (GenerateInterviewRequest, GenerateInterviewResponse, EvaluateInterviewRequest, EvaluateInterviewResponse)
from app.controllers.interview_controller import (handle_generate_interview, handle_evaluate_interview)

router = APIRouter(
    prefix="/api1",
    tags=["Mock Interview"]
)

@router.post(
    "/generate-interview",
    response_model=GenerateInterviewResponse
)
def generate_interview(req: GenerateInterviewRequest):

    return handle_generate_interview(req)


@router.post(
    "/evaluate-interview",
    response_model=EvaluateInterviewResponse
)
def evaluate_interview(req: EvaluateInterviewRequest):

    return handle_evaluate_interview(req)