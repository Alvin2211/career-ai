import { Router } from "express";
import {startInterview, finishInterview, getHistory} from "../controllers/interview.controller.js";
import {interviewLimiter} from "../middlewares/rateLimiter.js";

const router = Router();
router.route("/start").post( interviewLimiter, startInterview);
router.route("/finish").post( interviewLimiter, finishInterview);
router.route("/history").get( getHistory);


export default router;