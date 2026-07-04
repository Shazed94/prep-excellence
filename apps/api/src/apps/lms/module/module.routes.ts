import {
	createLMSModuleSchema,
	updateLMSModuleSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import z from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as moduleController from "./module.controller";

const router = Router({ mergeParams: true });
export const ZCourseId = z.object({
	courseId: z.cuid("Invalid CUID format"),
});

router.post(
	"/:courseId/modules",
	authenticate,
	validateId(ZCourseId),
	validate(createLMSModuleSchema.omit({ courseId: true })),
	moduleController.createModule,
);
router.get(
	"/:courseId/modules",
	validateId(ZCourseId),
	validateQuery(ZQueryParams),
	moduleController.getModules,
);
router.patch(
	"/modules/:id",
	validateId(ZCuid),
	authenticate,
	validate(updateLMSModuleSchema),
	moduleController.updateModule,
);
router.delete(
	"/modules/:id",
	validateId(ZCuid),
	authenticate,
	moduleController.deleteModule,
);

export default router;
