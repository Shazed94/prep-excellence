import {
	ZCollegeAdmissionsGuidanceForm,
	ZCRole,
	ZCuid,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize, requireSuperUser } from "@/middleware/authorize";
import { validate, validateId } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permission";
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
	// authorize(PERMISSIONS.ROLE.VIEW),
	guidanceController.getAll,
);

guidanceRouter.get(
	"/guidance/:id",
	validateId(ZCuid),
	authenticate,
	// authorize(PERMISSIONS.ROLE.VIEW),
	guidanceController.getById,
);

guidanceRouter.put(
	"/guidance/:id",
	validateId(ZCuid),
	validate(ZCRole),
	authenticate,
	// requireSuperUser(),
	guidanceController.update,
);

guidanceRouter.delete(
	"/guidance/:id",
	authenticate,
	validateId(ZCuid),
	// requireSuperUser(),
	guidanceController.delete,
);

export default guidanceRouter;
