import {
	ZCStudent,
	ZCTeacher,
	ZCuid,
	ZLogin,
	ZQueryParams,
	ZRegister,
	ZUStudent,
	ZUTeacher,
	ZUUser,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
// import { authorize, authorizeResourceAccess } from "@/middleware/authorize";
import { validate, validateId, validateQuery } from "@/middleware/validate";
// import { PERMISSIONS } from "@/utils/permission";
import {
	AuthController,
	StudentController,
	UserController,
} from "./controllers";
import { TeacherController } from "./teacher.controllers";

const router = Router();

const authController = new AuthController();
const userController = new UserController();
const studentController = new StudentController();
const teacherController = new TeacherController();

router.post("/auth/login", validate(ZLogin), authController.login);
router.post("/auth/register", validate(ZRegister), authController.register);
router.post("/auth/refresh", authController.refreshToken);
router.post("/auth/logout", authController.logout);

router.get("/users/me", userController.getMe);
router.get(
	"/users/:id",
	validateId(ZCuid),
	// authorize([PERMISSIONS.USER.VIEW, PERMISSIONS.USER.VIEW_OWN]),
	userController.getById,
);
router.get(
	"/users",
	validateQuery(ZQueryParams),
	// authorize(PERMISSIONS.USER.VIEW),
	userController.getAll,
);
router.put(
	"/users/:id",
	validateId(ZCuid),
	validate(ZUUser),
	// authorizeResourceAccess(PERMISSIONS.USER.CHANGE, (req) => req.params.id),
	userController.update,
);
router.patch(
	"/users/:id/status",
	validateId(ZCuid),
	// authorize(PERMISSIONS.USER.CHANGE),
	userController.isActive,
);
router.delete(
	"/users/:id",
	validateId(ZCuid),
	// authorize(PERMISSIONS.USER.DELETE),
	userController.deleteUser,
);

router.post("/students/", validate(ZCStudent), studentController.create);

router.get(
	"/students",
	validateQuery(ZQueryParams),
	// authorize([PERMISSIONS.STUDENT.VIEW, PERMISSIONS.STUDENT.VIEW_CHILDREN]),
	studentController.getAll,
);

router.get(
	"/students/:id",
	validateId(ZCuid),
	// authorize([
	// 	PERMISSIONS.STUDENT.VIEW,
	// 	PERMISSIONS.STUDENT.VIEW_OWN,
	// 	PERMISSIONS.STUDENT.VIEW_CHILDREN,
	// ]),
	studentController.getById,
);

router.put(
	"/students/:id",
	validateId(ZCuid),
	validate(ZUStudent),
	// authorize([PERMISSIONS.STUDENT.CHANGE, PERMISSIONS.STUDENT.CHANGE_OWN]),
	studentController.update,
);

router.post(
	"/teachers/",
	validate(ZCTeacher),
	authenticate,
	teacherController.create,
);

router.get(
	"/teachers",
	validateQuery(ZQueryParams),
	authenticate,
	// authorize([PERMISSIONS.TEACHER.VIEW, PERMISSIONS.TEACHER.VIEW_CHILDREN]),
	teacherController.getAll,
);

router.get(
	"/teachers/:id",
	validateId(ZCuid),
	authenticate,
	// authorize([
	// 	PERMISSIONS.STUDENT.VIEW,
	// 	PERMISSIONS.STUDENT.VIEW_OWN,
	// 	PERMISSIONS.STUDENT.VIEW_CHILDREN,
	// ]),
	teacherController.getById,
);

router.put(
	"/teachers/:id",
	validateId(ZCuid),
	validate(ZUTeacher),
	authenticate,
	// authorize([PERMISSIONS.TEACHER.CHANGE, PERMISSIONS.TEACHER.CHANGE_OWN]),
	teacherController.update,
);

router.delete(
	"/teachers/:id",
	validateId(ZCuid),
	authenticate,
	// authorize(PERMISSIONS.TEACHER.DELETE),
	teacherController.delete,
);

export default router;
