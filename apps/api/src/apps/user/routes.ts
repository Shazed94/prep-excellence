import {
	ZCStudent,
	ZCuid,
	ZLogin,
	ZPagination,
	ZRegister,
	ZUStudent,
	ZUUser,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authorize, authorizeResourceAccess } from "@/middleware/authorize";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permission";
import {
	AuthController,
	StudentController,
	UserController,
} from "./controllers";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/auth/login", validate(ZLogin), authController.login);
authRouter.post("/auth/register", validate(ZRegister), authController.register);
authRouter.post("/auth/refresh", authController.refreshToken);
authRouter.post("/auth/logout", authController.logout);

const userRouter = Router();
const userController = new UserController();
const studentController = new StudentController();

// User routes with authorization
userRouter.get("/users/me", userController.getMe); // No permission check - users can always view themselves

userRouter.get(
	"/users/:id",
	validateId(ZCuid),
	authorize([PERMISSIONS.USER.VIEW, PERMISSIONS.USER.VIEW_OWN]), // Can view if has general view or viewing own
	userController.getById,
);

userRouter.get(
	"/users",
	validateQuery(ZPagination),
	authorize(PERMISSIONS.USER.VIEW), // Only users with view_user permission
	userController.getAll,
);

userRouter.put(
	"/users/:id",
	validateId(ZCuid),
	validate(ZUUser),
	authorizeResourceAccess(PERMISSIONS.USER.CHANGE, (req) => req.params.id), // Check ownership or permission
	userController.update,
);

userRouter.patch(
	"/users/:id/status",
	validateId(ZCuid),
	authorize(PERMISSIONS.USER.CHANGE), // Only admins can toggle user status
	userController.isActive,
);

userRouter.delete(
	"/users/:id",
	validateId(ZCuid),
	authorize(PERMISSIONS.USER.DELETE), // Only admins can delete users
	userController.deleteUser,
);

// Student routes with authorization
userRouter.get(
	"/students/:id",
	validateId(ZCuid),
	authorize([
		PERMISSIONS.STUDENT.VIEW,
		PERMISSIONS.STUDENT.VIEW_OWN,
		PERMISSIONS.STUDENT.VIEW_CHILDREN,
	]), // Admin, student themselves, or parent
	studentController.getById,
);

userRouter.get(
	"/students",
	validateQuery(ZPagination),
	authorize([PERMISSIONS.STUDENT.VIEW, PERMISSIONS.STUDENT.VIEW_CHILDREN]), // Admin or parent viewing children
	studentController.getAll,
);

authRouter.post("/students/", validate(ZCStudent), studentController.create); // No auth needed for registration

userRouter.put(
	"/students/:id",
	validateId(ZCuid),
	validate(ZUStudent),
	authorize([PERMISSIONS.STUDENT.CHANGE, PERMISSIONS.STUDENT.CHANGE_OWN]), // Admin or student updating themselves
	studentController.update,
);

export { authRouter, userRouter };
