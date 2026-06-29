import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as lessonController from "./lesson.controller";

const router = Router({ mergeParams: true });

router.post("/:moduleId/lessons", authenticate, lessonController.createLesson);
router.get("/:moduleId/lessons", lessonController.getLessons);
router.get("/lessons/:id", lessonController.getLesson);
router.patch("/lessons/:id", authenticate, lessonController.updateLesson);
router.delete("/lessons/:id", authenticate, lessonController.deleteLesson);

export default router;
