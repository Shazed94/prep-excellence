import {
	ZCollegeAdmissionsGuidanceForm,
	ZCuid,
	ZUCollegeAdmissionsGuidanceForm,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";

import { validate, validateId } from "@/middleware/validate";
import { GuidanceController, NewsLetterController } from "./controllers";

const router = Router();
const guidanceController = new GuidanceController();
const newsLetterController = new NewsLetterController();

// ============================================
// GUIDANCE ROUTES
// ============================================

router.post(
	"/guidance",
	validate(ZCollegeAdmissionsGuidanceForm),
	guidanceController.create,
);

router.get(
	"/guidance",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	guidanceController.getAll,
);

router.get(
	"/guidance/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	validateId(ZCuid),
	guidanceController.getById,
);

router.put(
	"/guidance/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.CHANGE),
	validateId(ZCuid),
	validate(ZUCollegeAdmissionsGuidanceForm),
	guidanceController.update,
);

router.delete(
	"/guidance/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.DELETE),
	validateId(ZCuid),
	guidanceController.delete,
);

router.post(
	"/newsletter",
	validate(ZCollegeAdmissionsGuidanceForm),
	newsLetterController.create,
);

router.get(
	"/newsletter",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	newsLetterController.getAll,
);

router.get(
	"/newsletter/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	validateId(ZCuid),
	newsLetterController.getById,
);

router.delete(
	"/newsletter/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.DELETE),
	validateId(ZCuid),
	newsLetterController.delete,
);

export default router;
