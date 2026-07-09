import {
	ZAddLessonAttachmentsSchema,
	ZCCoachingLessonSchema,
	ZCuid,
	ZQueryParams,
	ZUCoachingLessonSchema,
	ZUpdateLessonAttachmentsSchema,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { uploadLessonAttachments } from "@/middleware/upload";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as lessonController from "./lesson.controller";

const router = Router({ mergeParams: true });

const moduleIdSchema = z.object({ moduleId: z.cuid("Invalid CUID format") });

router.post(
	"/:moduleId/lessons",
	validateId(moduleIdSchema),
	authenticate,
	validate(ZCCoachingLessonSchema),
	lessonController.createLesson,
);
router.get(
	"/:moduleId/lessons",
	validateId(moduleIdSchema),
	validateQuery(ZQueryParams),
	lessonController.getLessons,
);
router.get("/lessons/:id", validateId(ZCuid), lessonController.getLesson);
router.patch(
	"/lessons/:id",
	validateId(ZCuid),
	authenticate,
	validate(ZUCoachingLessonSchema),
	lessonController.updateLesson,
);
router.delete(
	"/lessons/:id",
	validateId(ZCuid),
	authenticate,
	lessonController.deleteLesson,
);

router.post(
	"/lessons/:id/attachments",
	validateId(ZCuid),
	authenticate,
	uploadLessonAttachments,
	validate(ZAddLessonAttachmentsSchema),
	lessonController.addLessonAttachments,
);

router.put(
	"/lessons/:id/attachments",
	validateId(ZCuid),
	authenticate,
	uploadLessonAttachments,
	validate(ZUpdateLessonAttachmentsSchema),
	lessonController.updateLessonAttachments,
);

router.get(
	"/lessons/:id/attachments",
	validateId(ZCuid),
	lessonController.getLessonAttachments,
);

router.delete(
	"/lessons/:id/attachments/:attachmentId",
	validateId(ZCuid),
	authenticate,
	lessonController.deleteLessonAttachment,
);

export default router;
