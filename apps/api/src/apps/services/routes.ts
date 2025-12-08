import {
	ZCollegeAdmissionsGuidanceForm,
	ZCuid,
	ZUCollegeAdmissionsGuidanceForm,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId } from "@/middleware/validate";
import { GuidanceController } from "./controllers";

const guidanceRouter = Router();
const guidanceController = new GuidanceController();

// ============================================
// GUIDANCE ROUTES
// ============================================

guidanceRouter.post(
	"/guidance",
	validate(ZCollegeAdmissionsGuidanceForm),
	guidanceController.create,
);

guidanceRouter.get(
	"/guidance",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	guidanceController.getAll,
);

guidanceRouter.get(
	"/guidance/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	validateId(ZCuid),
	guidanceController.getById,
);

guidanceRouter.put(
	"/guidance/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.CHANGE),
	validateId(ZCuid),
	validate(ZUCollegeAdmissionsGuidanceForm),
	guidanceController.update,
);

guidanceRouter.delete(
	"/guidance/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.DELETE),
	validateId(ZCuid),
	guidanceController.delete,
);

export default guidanceRouter;
