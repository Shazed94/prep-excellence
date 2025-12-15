import { Router } from "express";
import { DifficultyController, DomainController, SkillController, SubjectController, TestTypeController } from "./question-metarial.controller";

const router = Router();

const testTypeController = new TestTypeController();
const subjectController = new SubjectController();
const difficultyController = new DifficultyController();
const domainController = new DomainController();
const skillController = new SkillController();

//========================
// Test Type Routes
//========================

router.post("/test-types", testTypeController.create);
router.get("/test-types", testTypeController.getAll);
router.get("/test-types/:id", testTypeController.getById);
router.put("/test-types/:id", testTypeController.update);
router.delete("/test-types/:id", testTypeController.delete);

//========================
// Subject Routes
//========================

router.post("/subjects", subjectController.create);
router.get("/subjects", subjectController.getAll);
router.get("/subjects/:id", subjectController.getById);
router.put("/subjects/:id", subjectController.update);
router.delete("/subjects/:id", subjectController.delete);

//========================
// Difficulty Routes
//========================

router.post("/difficulties", difficultyController.create);
router.get("/difficulties", difficultyController.getAll);
router.get("/difficulties/:id", difficultyController.getById);
router.put("/difficulties/:id", difficultyController.update);
router.delete("/difficulties/:id", difficultyController.delete);

//========================
// Domain Routes
//========================

router.post("/domains", domainController.create);
router.get("/domains", domainController.getAll);
router.get("/domains/:id", domainController.getById);
router.put("/domains/:id", domainController.update);
router.delete("/domains/:id", domainController.delete);

//========================
// Skill Routes
//========================

router.post("/skills", skillController.create);
router.get("/skills", skillController.getAll);
router.get("/skills/:id", skillController.getById);
router.put("/skills/:id", skillController.update);
router.delete("/skills/:id", skillController.delete);

export default router;
