import {
	ZCFreeSeminarForm,
	ZCollegeAdmissionsGuidanceForm,
	ZCTrustedCompanies,
	ZCuid,
	ZNewsletterSubscription,
	ZUCollegeAdmissionsGuidanceForm,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { uploadImage } from "@/middleware/upload";

import { validate, validateId } from "@/middleware/validate";
import {
	FreeSeminarController,
	GuidanceController,
	NewsLetterController,
	TrustedCompaniesController,
} from "./controllers";

const router = Router();
const guidanceController = new GuidanceController();
const newsLetterController = new NewsLetterController();
const trustedCompaniesController = new TrustedCompaniesController();
const freeSeminarController = new FreeSeminarController();

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
	validate(ZNewsletterSubscription),
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

router.post(
	"/trusted-companies",
	uploadImage, // Handle file upload first
	validate(ZCTrustedCompanies),
	trustedCompaniesController.create,
);

router.get(
	"/trusted-companies",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	trustedCompaniesController.getAll,
);

router.get(
	"/trusted-companies/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	validateId(ZCuid),
	trustedCompaniesController.getById,
);

router.put(
	"/trusted-companies/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.CHANGE),
	uploadImage, // Handle file upload first
	validateId(ZCuid),
	validate(ZCTrustedCompanies),
	trustedCompaniesController.update,
);

router.delete(
	"/trusted-companies/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.DELETE),
	validateId(ZCuid),
	trustedCompaniesController.delete,
);

router.post(
	"/free-seminars",
	validate(ZCFreeSeminarForm),
	freeSeminarController.create,
);

router.get(
	"/free-seminars",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	freeSeminarController.getAll,
);

router.get(
	"/free-seminars/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.VIEW),
	validateId(ZCuid),
	freeSeminarController.getById,
);

router.delete(
	"/free-seminars/:id",
	authenticate,
	// authorize(PERMISSIONS.GUIDANCE.DELETE),
	validateId(ZCuid),
	freeSeminarController.delete,
);

export default router;
