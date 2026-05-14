import { Router } from "express";
import {startInterview, finishInterview, getHistory } from "../controllers/interview.controller.js";

const router = Router();

router.post("/start", startInterview);
router.post("/finish", finishInterview);
router.get("/history", getHistory);

export default router;