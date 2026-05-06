import { Router } from "express";
import { parseResume } from "../controllers/resume.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {resumelimiter} from "../middlewares/rateLimiter.js";

const router = Router();

router.route("/uploadresume").post(ClerkExpressRequireAuth(),resumelimiter,upload.single('file'),parseResume);
export default router;