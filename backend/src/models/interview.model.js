import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true},
        jobRole: { type: String, required: true },
        difficulty: { type: String, required: true },
        interviewType: { type: String, required: true },
        totalQuestions: { type: Number, default: 5 },
        questions: [{ type: String }],
        answers: [{ type: String }],
        feedbacks: [{ type: String }],
        scores: [{ type: Number }],
        report: {
            overallScore: { type: Number },
            strengths: [{ type: String }],
            weaknesses: [{ type: String }],
            suggestions: [{ type: String }],
            summary: { type: String },
        },
        status: {
            type: String,
            enum: ["ongoing", "completed"],
            default: "ongoing",
        },

    },{ timestamps: true }

);

export default mongoose.model("InterviewSession", interviewSchema);