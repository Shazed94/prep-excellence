import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import * as reviewController from "./review.controller";

const router = Router({ mergeParams: true });

router.post("/:courseId/reviews", authenticate, reviewController.createReview);
router.get("/:courseId/reviews", reviewController.getReviews);
router.patch("/reviews/:id", authenticate, reviewController.updateReview);
router.delete("/reviews/:id", authenticate, reviewController.deleteReview);

export default router;
