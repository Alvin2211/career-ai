import { Router } from "express";
import { parseResume } from "../controllers/resume.controller.js";
import { genresume } from "../controllers/generate.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/uploadresume").post(upload.single('file'),parseResume);
router.route("/generateresume").post(genresume);
export default router;