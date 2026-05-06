import axios from "axios";
import interviewModel from "../models/interview.model.js";
import { ApiError } from "../utils/ApiError.js";

const TOTAL_QUESTIONS = 5;

export const startInterview = async (req, res) => {
    try {
        console.log("Starting interview with data:", req.body);
        const userId = "test-user";
        const { jobRole, difficulty, interviewType } = req.body;

        if (!userId || !jobRole || !difficulty || !interviewType) {
            throw new ApiError(400, "userId, jobRole, difficulty and interviewType are required");
        }

        const response = await axios.post(`${process.env.PYTHON_SERVICE_URL}/generate-question`, {
            job_role: jobRole,
            difficulty: difficulty,
            interview_type: interviewType,
            previous_questions: [],
        });

        const intSession = new interviewModel({
            userId,
            jobRole,
            difficulty,
            interviewType,
            totalQuestions: TOTAL_QUESTIONS,
            questions: [response.data.question],
            answers: [],
            feedbacks: [],
            scores: [],
            status: "ongoing",
        });

        await intSession.save();

        return res.status(201).json({
            sessionId: intSession._id,
            question: response.data.question,
            questionNumber: 1,
            totalQuestions: TOTAL_QUESTIONS,
        });

    } catch (error) {
        console.error("Error starting interview:", error);
        res.status(500).json({ message: "Failed to start interview" });
    }
};

export const submitAnswer = async (req, res) => {
    try {
        const { sessionId, answer } = req.body;

        if (!sessionId || !answer) {
            throw new ApiError(400, "sessionId and answer are required");
        }
        
        const session = await interviewModel.findById(sessionId);
        if (!session) throw new ApiError(404, "Session not found");
        if (session.status === "completed") throw new ApiError(400, "Interview already completed");

        const currentQuestionIndex = session.answers.length;
        const currentQuestion = session.questions[currentQuestionIndex];

        const { data: evalData } = await axios.post(`${process.env.PYTHON_SERVICE_URL}/evaluate-answer`, {
            job_role: session.jobRole,
            difficulty: session.difficulty,
            question: currentQuestion,
            answer,
        });

        session.answers.push(answer);
        session.feedbacks.push(evalData.feedback);
        session.scores.push(evalData.score);

        const isLastQuestion = session.answers.length === session.totalQuestions;

        if (isLastQuestion) {
            const { data: reportData } = await axios.post(`${process.env.PYTHON_SERVICE_URL}/generate-report`, {
                job_role: session.jobRole,
                difficulty: session.difficulty,
                interview_type: session.interviewType,
                questions: session.questions,
                answers: session.answers,
                feedbacks: session.feedbacks,
                scores: session.scores,
            });

            session.report = {
                overallScore: reportData.overall_score,
                strengths: reportData.strengths,
                weaknesses: reportData.weaknesses,
                suggestions: reportData.suggestions,
                summary: reportData.summary,
            };
            session.status = "completed";
            await session.save();

            return res.json({
                done: true,
                feedback: evalData.feedback,
                score: evalData.score,
                report: session.report,
            });

        } else {
            const { data: nextQuestionData } = await axios.post(`${process.env.PYTHON_SERVICE_URL}/generate-question`, {
                job_role: session.jobRole,
                difficulty: session.difficulty,
                interview_type: session.interviewType,
                previous_questions: session.questions,
            });

            session.questions.push(nextQuestionData.question);
            await session.save();

            return res.json({
                done: false,
                feedback: evalData.feedback,
                score: evalData.score,
                nextQuestion: nextQuestionData.question,
                questionNumber: session.questions.length,
            });
        }

    } catch (err) {
        console.error("submitAnswer error:", err.message);
        return res.status(500).json({ message: err.message });
    }
};


export const getHistory = async (req, res) => {
    try {
        const userId = "test-user";
        const sessions = await interviewModel.find(
            { userId, status: "completed" },
            { jobRole: 1, difficulty: 1, interviewType: 1, "report.overallScore": 1, createdAt: 1 }
        ).sort({ createdAt: -1 });

        return res.json(
            sessions.map((s) => ({
                sessionId: s._id,
                jobRole: s.jobRole,
                difficulty: s.difficulty,
                interviewType: s.interviewType,
                overallScore: s.report?.overallScore,
                createdAt: s.createdAt,
            }))
        );

    } catch (err) {
        console.error("getHistory error:", err.message);
        return res.status(500).json({ message: err.message });
    }
};


export const getReport = async (req, res) => {
    try {
        const session = await interviewModel.findById(req.params.sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });

        return res.json({
            sessionId: session._id,
            jobRole: session.jobRole,
            difficulty: session.difficulty,
            interviewType: session.interviewType,
            questions: session.questions,
            answers: session.answers,
            feedbacks: session.feedbacks,
            scores: session.scores,
            report: session.report,
            createdAt: session.createdAt,
        });

    } catch (err) {
        console.error("getReport error:", err.message);
        return res.status(500).json({ message: err.message });
    }
};

