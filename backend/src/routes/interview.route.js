import { Router } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {startInterview, submitAnswer, getHistory, getReport} from "../controllers/interview.controller.js";

const router = Router();
router.route("/start").post(startInterview);
router.route("/answer").post(submitAnswer);
router.route("/history/:userId").get(getHistory);
router.route("/report/:sessionId").get(getReport);

export default router;