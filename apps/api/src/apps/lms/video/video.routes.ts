import {
	createLMSVideoSchema,
	updateLMSVideoSchema,
	updateLMSVideoStatusSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as videoController from "./video.controller";

const router = Router({ mergeParams: true });

router.post(
	"/:lessonId/videos",
	authenticate,
	validateId(ZCuid),
	validate(createLMSVideoSchema.omit({ lessonId: true })),
	videoController.createVideo,
);
router.get(
	"/:lessonId/videos",
	validateId(ZCuid),
	validateQuery(ZQueryParams),
	videoController.getVideoByLesson,
);
router.get("/videos/:id", validateId(ZCuid), videoController.getVideo);
router.patch(
	"/videos/:id",
	validateId(ZCuid),
	authenticate,
	validate(updateLMSVideoSchema),
	videoController.updateVideo,
);
router.patch(
	"/videos/:id/status",
	validateId(ZCuid),
	authenticate,
	validate(updateLMSVideoStatusSchema),
	videoController.updateVideoStatus,
);
router.delete(
	"/videos/:id",
	validateId(ZCuid),
	authenticate,
	videoController.deleteVideo,
);

export default router;
