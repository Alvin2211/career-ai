import { Router } from "express";
 
import { getcourses } from "../controllers/course.controller.js";
const router = Router();

router.route("/courses").get(getcourses);

export default router;