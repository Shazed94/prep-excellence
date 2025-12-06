import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize, requireSuperUser } from "@/middleware/authorize";
import { PERMISSIONS } from "@/utils/permission";
import { PermissionController, RoleController } from "./controllers";
import { validate, validateId } from "@/middleware/validate";
import { ZCRole, ZCuid } from "@prepexcellence/shared-validators";

const router = Router();
const roleController = new RoleController();
const permissionController = new PermissionController();

// ============================================
// ROLE ROUTES
// ============================================

	
	
router.post(
	"/roles",
	validate(ZCRole),
	authenticate,
	requireSuperUser(),
	roleController.create,
);


router.get(
	"/roles",
	authenticate,
	authorize(PERMISSIONS.ROLE.VIEW),
	roleController.getAll,
);

router.get(
	"/roles/:id",
	validateId(ZCuid),
	authenticate,
	authorize(PERMISSIONS.ROLE.VIEW),
	roleController.getById,
);


router.put(
	"/roles/:id",
	validateId(ZCuid),
	validate(ZCRole),
	authenticate,
	requireSuperUser(),
	roleController.update,
);


router.delete(
	"/roles/:id",
	authenticate,
	validateId(ZCuid),
	requireSuperUser(),
	roleController.delete,
);

// ============================================
// ROLE PERMISSION ASSIGNMENT ROUTES
// ============================================


router.get(
	"/permissions",
	authenticate,
	authorize(PERMISSIONS.PERMISSION.VIEW),
	permissionController.getAll,
);

router.get(
	"/permissions/module/:module",
	authenticate,
	authorize(PERMISSIONS.PERMISSION.VIEW),
	permissionController.getByModule,
);


router.get(
	"/permissions/scopes",
	authenticate,
	authorize(PERMISSIONS.PERMISSION.VIEW),
	permissionController.getScopes,
);

export default router;
