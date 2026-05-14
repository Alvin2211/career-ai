import axios from "axios";
import Interview from "../models/interview.model.js";
import {ApiError} from "../utils/ApiError.js";
const TOTAL_QUESTIONS = 5;

export const startInterview = async (req, res) => {
    try {
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
        );

        
        const interview = await Interview.create({
            userId: "test-user", 
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
        console.error("startInterview error:", error.message);
        throw new ApiError(500, "Failed to start interview");
    }
};

export const finishInterview = async (req, res) => {
    try {
        const { sessionId, answers } = req.body;

        if (!sessionId || !answers || answers.length === 0) {
            throw new ApiError(400, "sessionId and answers array are required");
        }

        const interview = await Interview.findById(sessionId);

        if (!interview) {
            throw new ApiError(404, "Interview session not found");
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
        );

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
        console.error("finishInterview error:", error.message);
        throw new ApiError(500, "Failed to finish interview");
    }
};

export const getHistory = async (req, res) => {
    try {
        const userId = "test-user"; 

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
        console.error("getHistory error:", error.message);
        throw new ApiError(500, "Failed to get history");
    }
};