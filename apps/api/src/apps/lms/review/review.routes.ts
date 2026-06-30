import {
  ZCuid,
  ZQueryParams,
  createLMSReviewSchema,
  updateLMSReviewSchema,
} from "@prepexcellence/shared-validators";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { validate, validateId, validateQuery } from "@/middleware/validate";
import * as reviewController from "./review.controller";

const router = Router({ mergeParams: true });

router.post(
  "/:courseId/reviews",
  authenticate,
  validateId(ZCuid),
  validate(createLMSReviewSchema),
  reviewController.createReview,
);
router.get(
  "/:courseId/reviews",
  validateId(ZCuid),
  validateQuery(ZQueryParams),
  reviewController.getReviews,
);
router.patch(
  "/reviews/:id",
  validateId(ZCuid),
  authenticate,
  validate(updateLMSReviewSchema),
  reviewController.updateReview,
);
router.delete(
  "/reviews/:id",
  validateId(ZCuid),
  authenticate,
  reviewController.deleteReview,
);

export default router;
