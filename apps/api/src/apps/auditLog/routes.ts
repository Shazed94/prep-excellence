/**
 * @fileoverview Audit Log API Routes
 *
 * This file contains all route definitions for the Audit Log module with comprehensive
 * Swagger/OpenAPI documentation for each endpoint.
 *
 * @module auditLog/routes
 *
 * Route Organization:
 * ==================
 *
 * AUDIT LOGS:
 *   GET    /                    - Get all audit logs (AUDIT_LOG.VIEW)
 *   GET    /me                  - Get current user's audit logs (authenticated)
 *   GET    /:id                 - Get audit log by ID (AUDIT_LOG.VIEW)
 *   GET    /entity/:entityId    - Get audit logs for entity (AUDIT_LOG.VIEW)
 *
 * Permission System:
 * ==================
 * - AUDIT_LOG: VIEW, VIEW_OWN, EXPORT
 *
 * All routes require authentication.
 */

import { ZCuid, ZQueryParams } from "@prepexcellence/shared-validators";
import { Router } from "express";
import z from "zod";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import { validateId, validateQuery } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permission";
import { AuditLogController } from "./controllers";

const router = Router();
const auditLogController = new AuditLogController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/audit-logs:
 *   get:
 *     summary: Get all audit logs
 *     description: Retrieve all audit logs with filtering and pagination (requires AUDIT_LOG.VIEW permission)
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VIEW, EXPORT]
 *         description: Filter by action type
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *         description: Filter by entity type (e.g., User, Course, Payment)
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: cuid
 *         description: Filter by user ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs until this date
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Audit logs retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: cuid
 *                       action:
 *                         type: string
 *                         example: UPDATE
 *                       entityType:
 *                         type: string
 *                         example: Course
 *                       entityId:
 *                         type: string
 *                         format: cuid
 *                       userId:
 *                         type: string
 *                         format: cuid
 *                       user:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *                       changes:
 *                         type: object
 *                         description: JSON object containing old and new values
 *                       ipAddress:
 *                         type: string
 *                         example: 192.168.1.1
 *                       userAgent:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
	"/",
	validateQuery(ZQueryParams),
	authorize([PERMISSIONS.AUDIT_LOG.VIEW]),
	auditLogController.getAll,
);

/**
 * @swagger
 * /api/v1/audit-logs/me:
 *   get:
 *     summary: Get current user's audit logs
 *     description: Retrieve audit logs for the authenticated user's actions
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: User's audit logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Your audit logs retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: cuid
 *                       action:
 *                         type: string
 *                       entityType:
 *                         type: string
 *                       entityId:
 *                         type: string
 *                       changes:
 *                         type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
	"/me",
	validateQuery(ZQueryParams),
	auditLogController.getMyAuditLogs,
);

/**
 * @swagger
 * /api/v1/audit-logs/{id}:
 *   get:
 *     summary: Get audit log by ID
 *     description: Retrieve a specific audit log entry (requires AUDIT_LOG.VIEW permission)
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: Audit log ID
 *     responses:
 *       200:
 *         description: Audit log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Audit log retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: cuid
 *                     action:
 *                       type: string
 *                       example: UPDATE
 *                     entityType:
 *                       type: string
 *                       example: Course
 *                     entityId:
 *                       type: string
 *                       format: cuid
 *                     userId:
 *                       type: string
 *                       format: cuid
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         email:
 *                           type: string
 *                     changes:
 *                       type: object
 *                       description: Contains old and new values for changed fields
 *                       example:
 *                         title:
 *                           old: "Old Course Title"
 *                           new: "New Course Title"
 *                         price:
 *                           old: 49.99
 *                           new: 59.99
 *                     ipAddress:
 *                       type: string
 *                       example: 192.168.1.1
 *                     userAgent:
 *                       type: string
 *                       example: Mozilla/5.0...
 *                     metadata:
 *                       type: object
 *                       description: Additional contextual information
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
	"/:id",
	validateId(ZCuid),
	authorize([PERMISSIONS.AUDIT_LOG.VIEW]),
	auditLogController.getById,
);

/**
 * @swagger
 * /api/v1/audit-logs/entity/{entityId}:
 *   get:
 *     summary: Get audit logs for a specific entity
 *     description: Retrieve all audit logs for a specific entity (requires AUDIT_LOG.VIEW permission)
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *           format: cuid
 *         description: Entity ID (e.g., course ID, user ID)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *     responses:
 *       200:
 *         description: Entity audit logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Entity audit logs retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       action:
 *                         type: string
 *                       entityType:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       user:
 *                         type: object
 *                       changes:
 *                         type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
	"/entity/:entityId",
	validateId(z.object({ entityId: z.cuid() })),
	authorize([PERMISSIONS.AUDIT_LOG.VIEW]),
	auditLogController.getByEntityId,
);

export default router;
