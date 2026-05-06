from pydantic import BaseModel, Field
from typing import List, Optional



class GenerateQuestionRequest(BaseModel):
    job_role: str = Field(..., example="Frontend Developer")
    difficulty: str = Field(..., example="mid")       
    interview_type: str = Field(..., example="technical")  
    previous_questions: Optional[List[str]] = Field(default=[], example=[])


class GenerateQuestionResponse(BaseModel):
    question: str


class EvaluateAnswerRequest(BaseModel):
    job_role: str = Field(..., example="Frontend Developer")
    difficulty: str = Field(..., example="mid")
    question: str = Field(..., example="What is the virtual DOM?")
    answer: str = Field(..., example="Virtual DOM is a lightweight copy of the real DOM...")


class EvaluateAnswerResponse(BaseModel):
    feedback: str
    score: int = Field(..., ge=1, le=10)  


class GenerateReportRequest(BaseModel):
    job_role: str
    difficulty: str
    interview_type: str
    questions: List[str]
    answers: List[str]
    feedbacks: List[str]
    scores: List[int]


class GenerateReportResponse(BaseModel):
    overall_score: float
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    summary: str