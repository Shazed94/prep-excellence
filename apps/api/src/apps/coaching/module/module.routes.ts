import { ZCuid } from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validateId } from "@/middleware/validate";
import * as moduleController from "./module.controller";

const router = Router({ mergeParams: true });

const courseIdSchema = z.object({ courseId: ZCuid });

router.post(
	"/:courseId/modules",
	validateId(courseIdSchema),
	authenticate,
	moduleController.createModule,
);
router.get(
	"/:courseId/modules",
	validateId(courseIdSchema),
	moduleController.getModules,
);
router.patch(
	"/modules/:id",
	validateId(ZCuid),
	authenticate,
	moduleController.updateModule,
);
router.delete(
	"/modules/:id",
	validateId(ZCuid),
	authenticate,
	moduleController.deleteModule,
);

export default router;
