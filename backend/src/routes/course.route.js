import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Router } from "express";
 
import { getcourses } from "../controllers/course.controller.js";
const router = Router();

router.route("/courses").get(ClerkExpressRequireAuth(),getcourses);

export default router;