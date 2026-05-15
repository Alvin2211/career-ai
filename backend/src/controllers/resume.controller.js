import { ApiError } from "../utils/ApiError.js";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { Resume } from "../models/resume.model.js";
import { getAuth } from "@clerk/express";

const parseResume = async (req, res,) => {
    try {
        const {userId} = getAuth(req);
        if (!userId) throw new ApiError(400, "not authenticated");

        if (!req.file) throw new ApiError(400, "No file uploaded");

        const tempFilePath = req.file.path;
        const originalName = req.file.originalname;

        try {
            const fileBuffer = fs.readFileSync(tempFilePath);
            const formData = new FormData();
            formData.append("file", fileBuffer, {
                filename: originalName,
                contentType: req.file.mimetype,
            });

            const pythonResponse = await axios.post(`${process.env.PYTHON_SERVICE_URL}/parse_resume`, formData,
                {
                    headers: formData.getHeaders(),
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity
                }
            );

            const rawData = pythonResponse.data;

            if (!rawData.career_recommend || !Array.isArray(rawData.career_recommend)) {
                throw new ApiError(500, "Invalid response format from Python service");
            }

            const savedResume = await Resume.findOneAndUpdate(
                { userId },
                {
                    extractedData: rawData.extracted_data,
                    careerData: rawData.career_recommend,
                    atsAnalysis: rawData.ats_analysis,
                },
                { new: true, upsert: true }
            );

            res.status(200).json({
                success: true,
                data: savedResume,
            });

        } catch (innerError) {
            if (innerError instanceof ApiError) throw innerError;
            console.error("Error calling Python service:", innerError);
            throw new ApiError(500, "Failed to parse and run LLM on your resume");
        } finally {
            fs.unlink(tempFilePath, (err) => {
                if (err) console.error("Error deleting temp file:", err);
            });
        }

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export { parseResume };