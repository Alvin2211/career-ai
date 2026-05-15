import { Router } from "express"; 
import { getRoadmap } from "../controllers/roadmap.controller.js";
import {roadmaplimiter} from "../middlewares/rateLimiter.js";

const router = Router();
router.route("/roadmap").get(roadmaplimiter,getRoadmap);

export default router;