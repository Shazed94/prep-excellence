import {
	createLMSModuleSchema,
	updateLMSModuleSchema,
	ZCuid,
	ZQueryParams,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as moduleController from "./module.controller";

const router = Router({ mergeParams: true });

router.post(
	"/:courseId/modules",
	authenticate,
	validateId(ZCuid),
	validate(createLMSModuleSchema.omit({ courseId: true })),
	moduleController.createModule,
);
router.get(
	"/:courseId/modules",
	validateId(ZCuid),
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
