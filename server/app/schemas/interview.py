from pydantic import BaseModel
from typing import List


class InterviewQuestion(BaseModel):
    question: str
    expected_answer: str
    rubric: str


class GenerateInterviewRequest(BaseModel):
    job_role: str
    difficulty: str
    interview_type: str
    total_questions: int = 5


class GenerateInterviewResponse(BaseModel):
    questions: List[InterviewQuestion]


class CandidateAnswer(BaseModel):
    question: str
    answer: str


class EvaluateInterviewRequest(BaseModel):
    job_role: str
    difficulty: str
    interview_type: str
    qa_pairs: List[CandidateAnswer]


class QuestionEvaluation(BaseModel):
    question: str
    score: int
    feedback: str


class EvaluateInterviewResponse(BaseModel):
    overall_score: float
    evaluations: List[QuestionEvaluation]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    summary: str