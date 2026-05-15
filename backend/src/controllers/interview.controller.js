import axios from "axios";
import Interview from "../models/interview.model.js";
import { ApiError } from "../utils/ApiError.js";
import { getAuth } from "@clerk/express";

const TOTAL_QUESTIONS = 5;

export const startInterview = async (req, res) => {
    try {
        const {userId} = getAuth(req);
        if (!userId) throw new ApiError(401, "Unauthorized: Please sign in to start an interview");

        const { jobRole, difficulty, interviewType } = req.body;
        if (!jobRole || !difficulty || !interviewType) {
            throw new ApiError(400, "jobRole, difficulty, and interviewType are required");
        }

        const { data } = await axios.post(
            `${process.env.PYTHON_SERVICE_URL}/generate-questions`,
            {
                job_role: jobRole,
                difficulty: difficulty,
                interview_type: interviewType,
                total_questions: TOTAL_QUESTIONS,
            }
        ).catch((err) => {
            console.error("Python service error:", err.message);
            throw new ApiError(502, "AI service unavailable, please try again");
        });

        const interview = await Interview.create({
            userId,
            jobRole,
            difficulty,
            interviewType,
            questions: data.questions,
            answers: [],
            status: "ongoing",
        });

        return res.status(201).json({
            sessionId: interview._id,
            questions: interview.questions,
        });

    } catch (error) {
        if (error instanceof ApiError) throw error;
        console.error("startInterview error:", error.message);
        throw new ApiError(500, "Failed to start interview");
    }
};

export const finishInterview = async (req, res) => {
    try {
        const {userId} = getAuth(req);
        if (!userId) throw new ApiError(401, "Unauthorized: Please sign in to finish an interview");

        const { sessionId, answers } = req.body;

        if (!sessionId || !answers || answers.length === 0) {
            throw new ApiError(400, "sessionId and answers array are required");
        }

        if (answers.length !== TOTAL_QUESTIONS) {
            throw new ApiError(400, `Expected ${TOTAL_QUESTIONS} answers, got ${answers.length}`);
        }

        const interview = await Interview.findById(sessionId);

        if (!interview) {
            throw new ApiError(404, "Interview session not found");
        }

        if (interview.userId.toString() !== userId) {
            throw new ApiError(403, "Forbidden: You don't own this interview session");
        }

        if (interview.status === "completed") {
            throw new ApiError(400, "This interview is already completed");
        }

        interview.answers = answers;
        await interview.save();

        const { data } = await axios.post(
            `${process.env.PYTHON_SERVICE_URL}/evaluate-answers`,
            {
                job_role: interview.jobRole,
                difficulty: interview.difficulty,
                interview_type: interview.interviewType,
                qa_pairs: answers,
            }
        ).catch((err) => {
            console.error("Python service error:", err.message);
            throw new ApiError(502, "AI service unavailable, please try again");
        });

        interview.report = {
            overallScore: data.overall_score,
            evaluations: data.evaluations,
            strengths: data.strengths,
            weaknesses: data.weaknesses,
            suggestions: data.suggestions,
            summary: data.summary,
        };
        interview.status = "completed";
        await interview.save();

        return res.json({
            success: true,
            report: interview.report,
        });

    } catch (error) {
        if (error instanceof ApiError) throw error;
        console.error("finishInterview error:", error.message);
        throw new ApiError(500, "Failed to finish interview");
    }
};

export const getHistory = async (req, res) => {
    try {
        const {userId} = getAuth(req);
        if (!userId) throw new ApiError(401, "Unauthorized: Please sign in to view history");

        const sessions = await Interview.find(
            { userId, status: "completed" },
            {
                jobRole: 1,
                difficulty: 1,
                interviewType: 1,
                report: 1,
                createdAt: 1,
            }
        ).sort({ createdAt: -1 });

        return res.json(sessions);

    } catch (error) {
        if (error instanceof ApiError) throw error;
        console.error("getHistory error:", error.message);
        throw new ApiError(500, "Failed to get history");
    }
};