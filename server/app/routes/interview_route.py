from fastapi import APIRouter
from app.schemas.interview import GenerateQuestionRequest, GenerateQuestionResponse,EvaluateAnswerRequest, EvaluateAnswerResponse,GenerateReportRequest, GenerateReportResponse
from app.controllers.interview_controller import handle_generate_question, handle_evaluate_answer, handle_generate_report

router=APIRouter(
    prefix="/api1",
    tags=["Mock Interviewer"]
)

@router.post("/generate-question", response_model=GenerateQuestionResponse)
def generate_question(req: GenerateQuestionRequest):
    return handle_generate_question(req)
 
 
@router.post("/evaluate-answer", response_model=EvaluateAnswerResponse)
def evaluate_answer(req: EvaluateAnswerRequest):
    return handle_evaluate_answer(req)
 
 
@router.post("/generate-report", response_model=GenerateReportResponse)
def generate_report(req: GenerateReportRequest):
    return handle_generate_report(req)