import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        jobRole: { type: String, required: true },
        difficulty: { type: String, required: true },
        interviewType: { type: String, required: true },
        questions: [{question: String,}],
        answers: [{question: String, answer: String}],
        report: {
            overallScore: Number,
            evaluations: [
                {
                    question: String,
                    score: Number,
                    feedback: String,
                },
            ],
            strengths: [String],
            weaknesses: [String],
            suggestions: [String],
            summary: String,
        },
        status: {
            type: String,
            enum: ["ongoing", "completed"],
            default: "ongoing",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);