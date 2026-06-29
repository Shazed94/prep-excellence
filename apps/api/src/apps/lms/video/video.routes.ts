import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as videoController from "./video.controller";

const router = Router({ mergeParams: true });

router.post("/:lessonId/videos", authenticate, videoController.createVideo);
router.get("/:lessonId/videos", videoController.getVideoByLesson);
router.get("/videos/:id", videoController.getVideo);
router.patch("/videos/:id", authenticate, videoController.updateVideo);
router.patch(
	"/videos/:id/status",
	authenticate,
	videoController.updateVideoStatus,
);
router.delete("/videos/:id", authenticate, videoController.deleteVideo);

export default router;
