import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import { PERMISSIONS } from "@/utils/permission";
import { AuditLogController } from "./controllers";

const router = Router();
const auditLogController = new AuditLogController();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/audit-logs
 * @desc    Get all audit logs with filtering and pagination
 * @access  Private (requires AUDIT.VIEW_LOGS permission)
 */
router.get(
	"/",
	authorize([PERMISSIONS.AUDIT_LOG.VIEW]),
	auditLogController.getAll,
);

/**
 * @route   GET /api/audit-logs/me
 * @desc    Get audit logs for current user's actions
 * @access  Private
 */
router.get("/me", auditLogController.getMyAuditLogs);

/**
 * @route   GET /api/audit-logs/:id
 * @desc    Get a single audit log by ID
 * @access  Private (requires AUDIT.VIEW_LOGS permission)
 */
router.get(
	"/:id",
	authorize([PERMISSIONS.AUDIT_LOG.VIEW]),
	auditLogController.getById,
);

/**
 * @route   GET /api/audit-logs/entity/:entityId
 * @desc    Get audit logs for a specific entity
 * @access  Private (requires AUDIT.VIEW_LOGS permission)
 */
router.get(
	"/entity/:entityId",
	authorize([PERMISSIONS.AUDIT_LOG.VIEW]),
	auditLogController.getByEntityId,
);

export default router;
