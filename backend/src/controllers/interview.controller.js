import axios from "axios";

import interviewModel from "../models/interview.model.js";

import { ApiError } from "../utils/ApiError.js";

const TOTAL_QUESTIONS = 5;

export const startInterview = async (req, res) => {

    try {

        const userId = "test-user";

        const {
            jobRole,
            difficulty,
            interviewType,
        } = req.body;

        if (
            !jobRole ||
            !difficulty ||
            !interviewType
        ) {
            throw new ApiError(
                400,
                "Missing required fields"
            );
        }

        const { data } = await axios.post(
            `${process.env.PYTHON_SERVICE_URL}/generate-interview`,
            {
                job_role: jobRole,
                difficulty,
                interview_type: interviewType,
                total_questions: TOTAL_QUESTIONS,
            }
        );

        const session = await interviewModel.create({

            userId,

            jobRole,

            difficulty,

            interviewType,

            totalQuestions: TOTAL_QUESTIONS,

            questions: data.questions,

            answers: [],

            evaluations: [],

            status: "ongoing",
        });

        return res.status(201).json({

            sessionId: session._id,

            totalQuestions: TOTAL_QUESTIONS,

            questions: session.questions.map(q => ({
                question: q.question,
            })),
        });

    } catch (error) {

        console.error(
            "startInterview error:",
            error.message
        );

        return res.status(500).json({
            message: "Failed to start interview"
        });
    }
};


export const submitAnswer = async (req, res) => {

    try {

        const {
            sessionId,
            question,
            answer,
        } = req.body;

        if (
            !sessionId ||
            !question ||
            !answer
        ) {
            throw new ApiError(
                400,
                "Missing required fields"
            );
        }

        const session =
            await interviewModel.findById(sessionId);

        if (!session) {
            throw new ApiError(
                404,
                "Session not found"
            );
        }

        if (session.status === "completed") {
            throw new ApiError(
                400,
                "Interview already completed"
            );
        }

        session.answers.push({
            question,
            answer,
        });

        await session.save();

        return res.json({
            success: true,
            answersCount: session.answers.length,
        });

    } catch (error) {

        console.error(
            "submitAnswer error:",
            error.message
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


export const finishInterview = async (req, res) => {

    try {

        const { sessionId } = req.body;

        if (!sessionId) {
            throw new ApiError(
                400,
                "sessionId required"
            );
        }

        const session =
            await interviewModel.findById(sessionId);

        if (!session) {
            throw new ApiError(
                404,
                "Session not found"
            );
        }

        const { data } = await axios.post(
            `${process.env.PYTHON_SERVICE_URL}/evaluate-interview`,
            {
                job_role: session.jobRole,
                difficulty: session.difficulty,
                interview_type: session.interviewType,
                qa_pairs: session.answers,
            }
        );

        session.evaluations =
            data.evaluations;

        session.report = {
            overallScore: data.overall_score,
            strengths: data.strengths,
            weaknesses: data.weaknesses,
            suggestions: data.suggestions,
            summary: data.summary,
        };

        session.status = "completed";

        await session.save();

        return res.json({

            success: true,

            report: session.report,

            evaluations: session.evaluations,
        });

    } catch (error) {

        console.error(
            "finishInterview error:",
            error.message
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


export const getHistory = async (req, res) => {

    try {

        const userId = "test-user";

        const sessions =
            await interviewModel.find(
                {
                    userId,
                    status: "completed",
                },
                {
                    jobRole: 1,
                    difficulty: 1,
                    interviewType: 1,
                    report: 1,
                    createdAt: 1,
                }
            ).sort({
                createdAt: -1,
            });

        return res.json(sessions);

    } catch (error) {

        console.error(
            "getHistory error:",
            error.message
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


export const getReport = async (req, res) => {

    try {

        const session =
            await interviewModel.findById(
                req.params.sessionId
            );

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        return res.json(session);

    } catch (error) {

        console.error(
            "getReport error:",
            error.message
        );

        return res.status(500).json({
            message: error.message
        });
    }
};