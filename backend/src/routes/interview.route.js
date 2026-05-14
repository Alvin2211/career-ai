import { Router } from "express";
import {startInterview, finishInterview, getHistory} from "../controllers/interview.controller.js";
import {interviewLimiter} from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/start", interviewLimiter, startInterview);
router.post("/finish", interviewLimiter,  finishInterview);
router.get("/history", getHistory);

export default router;