import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: String,
    expectedAnswer: String,
    rubric: String,
});

const evaluationSchema = new mongoose.Schema({
    question: String,
    score: Number,
    feedback: String,
});

const interviewSchema = new mongoose.Schema(
    {
        userId: {type: String,required: true},
        jobRole: {type: String,required: true},
        difficulty: {type: String,required: true},
        interviewType: {type: String,required: true},
        totalQuestions: {type: Number,default: 5},
        questions: [questionSchema],
        answers: [
            {
                question: String,
                answer: String,
            }
        ],
        evaluations: [evaluationSchema],
        report: {
            overallScore: Number,
            strengths: [String],
            weaknesses: [String],
            suggestions: [String],
            summary: String,
        },
        status: {type: String,enum: ["ongoing", "completed"],default: "ongoing"},
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "InterviewSession",
    interviewSchema
);