from app.schemas.interview import GenerateQuestionRequest, GenerateQuestionResponse,EvaluateAnswerRequest, EvaluateAnswerResponse, GenerateReportRequest, GenerateReportResponse
from app.services.interview_llm import call_llm, build_question_prompt, build_evaluate_prompt, build_report_prompt

def handle_generate_question(req: GenerateQuestionRequest) -> GenerateQuestionResponse:
    print("Generating question with data:")
    system, human = build_question_prompt(
        job_role=req.job_role,
        difficulty=req.difficulty,
        interview_type=req.interview_type,
        previous_questions=req.previous_questions,
    )
    question = call_llm(system, human)
    return GenerateQuestionResponse(question=question)



def handle_evaluate_answer(req: EvaluateAnswerRequest) -> EvaluateAnswerResponse:
    system, human = build_evaluate_prompt(
        job_role=req.job_role,
        difficulty=req.difficulty,
        question=req.question,
        answer=req.answer,
    )
    raw = call_llm(system, human)
 
    feedback = ""
    score = 5  
 
    for line in raw.splitlines():
        line = line.strip()
        if line.startswith("FEEDBACK:"):
            feedback = line.replace("FEEDBACK:", "").strip()
        elif line.startswith("SCORE:"):
            try:
                score = int(line.replace("SCORE:", "").strip())
                score = max(1, min(10, score))
            except ValueError:
                score = 5
 
    if not feedback:
        feedback = raw  
 
    return EvaluateAnswerResponse(feedback=feedback, score=score)


def _build_transcript(questions, answers, feedbacks, scores) -> str:
    transcript = ""
    for i, (q, a, f, s) in enumerate(zip(questions, answers, feedbacks, scores), 1):
        transcript += f"\nQ{i}: {q}\nAnswer: {a}\nFeedback: {f}\nScore: {s}/10\n"
    return transcript.strip()
 
 
def _parse_report(raw: str) -> tuple:
    strengths, weaknesses, suggestions, summary = [], [], [], ""
    current_section = None
 
    for line in raw.splitlines():
        line = line.strip()
        if line == "STRENGTHS:":
            current_section = "strengths"
        elif line == "WEAKNESSES:":
            current_section = "weaknesses"
        elif line == "SUGGESTIONS:":
            current_section = "suggestions"
        elif line == "SUMMARY:":
            current_section = "summary"
        elif line.startswith("- ") and current_section in ["strengths", "weaknesses", "suggestions"]:
            item = line[2:].strip()
            if current_section == "strengths":
                strengths.append(item)
            elif current_section == "weaknesses":
                weaknesses.append(item)
            elif current_section == "suggestions":
                suggestions.append(item)
        elif current_section == "summary" and line:
            summary += " " + line
 
    return strengths, weaknesses, suggestions, summary.strip()
 
 
def handle_generate_report(req: GenerateReportRequest) -> GenerateReportResponse:
    overall_score = round(sum(req.scores) / len(req.scores), 1) if req.scores else 0.0
    transcript = _build_transcript(req.questions, req.answers, req.feedbacks, req.scores)
 
    system, human = build_report_prompt(
        job_role=req.job_role,
        difficulty=req.difficulty,
        interview_type=req.interview_type,
        transcript=transcript,
        overall_score=overall_score,
    )
    raw = call_llm(system, human)
 
    strengths, weaknesses, suggestions, summary = _parse_report(raw)
 
    return GenerateReportResponse(
        overall_score=overall_score,
        strengths=strengths or ["Could not parse strengths"],
        weaknesses=weaknesses or ["Could not parse weaknesses"],
        suggestions=suggestions or ["Could not parse suggestions"],
        summary=summary or raw,
    )