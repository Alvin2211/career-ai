from pydantic import BaseModel
from typing import List

class GenerateQuestionsRequest(BaseModel):
    job_role: str
    difficulty: str
    interview_type: str
    total_questions: int = 5


class QuestionItem(BaseModel):
    question: str


class GenerateQuestionsResponse(BaseModel):
    questions: List[QuestionItem]


class QAPair(BaseModel):
    question: str
    answer: str


class EvaluateAnswersRequest(BaseModel):
    job_role: str
    difficulty: str
    interview_type: str
    qa_pairs: List[QAPair]


class QuestionEvaluation(BaseModel):
    question: str
    score: int       
    feedback: str


class EvaluateAnswersResponse(BaseModel):
    overall_score: float           
    evaluations: List[QuestionEvaluation]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    summary: str