import {
  ZCuid,
  ZCCoachingModuleSchema,
  ZQueryParams,
  ZUCoachingModuleSchema,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { z } from "zod";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as moduleController from "./module.controller";

const router = Router({ mergeParams: true });

const courseIdSchema = z.object({ courseId: ZCuid });

router.post(
  "/:courseId/modules",
  validateId(courseIdSchema),
  authenticate,
  validate(ZCCoachingModuleSchema.omit({ courseId: true, teacherId: true })),
  moduleController.createModule,
);
router.get(
  "/:courseId/modules",
  validateId(courseIdSchema),
  validateQuery(ZQueryParams),
  moduleController.getModules,
);
router.patch(
  "/modules/:id",
  validateId(ZCuid),
  authenticate,
  validate(ZUCoachingModuleSchema),
  moduleController.updateModule,
);
router.delete(
  "/modules/:id",
  validateId(ZCuid),
  authenticate,
  moduleController.deleteModule,
);

export default router;
