import { Router } from "express";
import {startInterview,submitAnswer,finishInterview,getHistory,getReport} from "../controllers/interview.controller.js";

const router = Router();

router.post("/start", startInterview);
router.post("/answer", submitAnswer);
router.post("/finish", finishInterview);
router.get("/history/:userId", getHistory);
router.get("/report/:sessionId", getReport);

    
export default router;