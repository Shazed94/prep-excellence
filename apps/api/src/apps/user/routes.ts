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
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
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

userRouter.use(authenticate);

userRouter.get("/users/me", userController.getMe);
userRouter.get("/users/:id", validateId(ZCuid), userController.getById);
userRouter.get("/users", validateQuery(ZPagination), userController.getAll);
userRouter.put(
	"/users/:id",
	validateId(ZCuid),
	validate(ZUUser),
	userController.update,
);
userRouter.patch(
	"/users/:id/status",
	validateId(ZCuid),
	userController.isActive,
);
userRouter.delete("/users/:id", validateId(ZCuid), userController.delete);

userRouter.get("/students/:id", validateId(ZCuid), studentController.getById);
userRouter.get(
	"/students",
	validateQuery(ZPagination),
	studentController.getAll,
);
authRouter.post("/students/", validate(ZCStudent), studentController.create);
userRouter.put(
	"/students/:id",
	validateId(ZCuid),
	validate(ZUStudent),
	studentController.update,
);

export { authRouter, userRouter };
