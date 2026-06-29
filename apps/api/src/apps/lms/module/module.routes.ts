import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as moduleController from "./module.controller";

const router = Router({ mergeParams: true });

router.post("/:courseId/modules", authenticate, moduleController.createModule);
router.get("/:courseId/modules", moduleController.getModules);
router.patch("/modules/:id", authenticate, moduleController.updateModule);
router.delete("/modules/:id", authenticate, moduleController.deleteModule);

export default router;
