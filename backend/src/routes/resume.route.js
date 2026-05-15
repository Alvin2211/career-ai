import { Router } from "express";
import { parseResume } from "../controllers/resume.controller.js";
import upload from "../middlewares/multer.middleware.js";
import {resumelimiter} from "../middlewares/rateLimiter.js";

const router = Router();

router.route("/uploadresume").post(resumelimiter, upload.single('file'), parseResume);
export default router;