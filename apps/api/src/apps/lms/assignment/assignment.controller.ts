import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { lmsAssignmentService } from "./assignment.service";

export const createAssignment = asyncHandler(
	async (req: Request, res: Response) => {
		const assignment = await lmsAssignmentService.create(req.body, req);
		res.status(201).json({ success: true, data: assignment });
	},
);

export const getAssignmentByLesson = asyncHandler(
	async (req: Request, res: Response) => {
		const assignment = await lmsAssignmentService.getByLesson(
			req.params.lessonId,
		);
		res.status(200).json({ success: true, data: assignment });
	},
);

export const getAssignment = asyncHandler(
	async (req: Request, res: Response) => {
		const assignment = await lmsAssignmentService.getById(req.params.id);
		res.status(200).json({ success: true, data: assignment });
	},
);

export const updateAssignment = asyncHandler(
	async (req: Request, res: Response) => {
		const assignment = await lmsAssignmentService.update(
			req.params.id,
			req.body,
			req,
		);
		res.status(200).json({ success: true, data: assignment });
	},
);

export const deleteAssignment = asyncHandler(
	async (req: Request, res: Response) => {
		await lmsAssignmentService.delete(req.params.id, req);
		res
			.status(200)
			.json({ success: true, message: "Assignment deleted successfully" });
	},
);

export const submitAssignment = asyncHandler(
	async (req: Request, res: Response) => {
		const submission = await lmsAssignmentService.submit(
			req.params.id,
			req.user!.id,
			req.body.fileUrl,
			req.body.notes,
		);
		res.status(201).json({ success: true, data: submission });
	},
);

export const gradeSubmission = asyncHandler(
	async (req: Request, res: Response) => {
		const { grade, feedback } = req.body;
		const submission = await lmsAssignmentService.grade(
			req.params.submissionId,
			grade,
			feedback,
			req.user!.id,
		);
		res.status(200).json({ success: true, data: submission });
	},
);

export const getSubmissions = asyncHandler(
	async (req: Request, res: Response) => {
		const submissions = await lmsAssignmentService.getSubmissions(
			req.params.id,
		);
		res.status(200).json({ success: true, data: submissions });
	},
);
