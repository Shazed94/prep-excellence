import prisma from "@/infrastructure/database/connection";

export interface IssueCertificateInput {
	courseId: string;
	studentId: string;
	downloadUrl?: string;
}

class CertificateService {
	/**
	 * Issue a certificate to a student upon course completion.
	 */
	async issueCertificate(input: IssueCertificateInput) {
		const { courseId, studentId, downloadUrl } = input;

		// Check if already exists
		const existing = await prisma.certificate.findUnique({
			where: { courseId_studentId: { courseId, studentId } },
		});

		if (existing) {
			if (existing.status === "ACTIVE") {
				return existing;
			}
			// Reactivate if revoked
			return prisma.certificate.update({
				where: { id: existing.id },
				data: {
					status: "ACTIVE",
					issueDate: new Date(),
					revokedAt: null,
					revokedReason: null,
				},
			});
		}

		// Generate unique certificate number and verification code
		const certificateNumber = `CERT-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
		const verificationCode = crypto
			.randomUUID()
			.replace(/-/g, "")
			.slice(0, 16)
			.toUpperCase();

		const certificate = await prisma.certificate.create({
			data: {
				certificateNumber,
				verificationCode,
				courseId,
				studentId,
				downloadUrl,
				status: "ACTIVE",
			},
			include: {
				course: { select: { title: true, slug: true } },
				student: {
					include: {
						user: { select: { name: true, email: true } },
					},
				},
			},
		});

		return certificate;
	}

	/**
	 * Verify a certificate by verification code.
	 */
	async verifyByCode(verificationCode: string) {
		const certificate = await prisma.certificate.findUnique({
			where: { verificationCode },
			include: {
				course: { select: { title: true, slug: true } },
				student: {
					include: {
						user: { select: { name: true, email: true } },
					},
				},
			},
		});

		if (!certificate) {
			throw new Error("Certificate not found");
		}

		if (certificate.status === "REVOKED") {
			throw new Error("Certificate has been revoked");
		}

		return certificate;
	}

	/**
	 * Get certificate by course and student.
	 */
	async getByCourseAndStudent(courseId: string, studentId: string) {
		return prisma.certificate.findUnique({
			where: { courseId_studentId: { courseId, studentId } },
			include: {
				course: { select: { title: true, slug: true, thumbnail: true } },
				student: {
					include: {
						user: { select: { name: true, email: true, image: true } },
					},
				},
			},
		});
	}

	/**
	 * List certificates for a student.
	 */
	async listByStudent(studentId: string) {
		return prisma.certificate.findMany({
			where: { studentId },
			include: {
				course: {
					select: {
						id: true,
						title: true,
						slug: true,
						thumbnail: true,
					},
				},
			},
			orderBy: { issueDate: "desc" },
		});
	}

	/**
	 * Revoke a certificate.
	 */
	async revoke(id: string, reason: string) {
		return prisma.certificate.update({
			where: { id },
			data: {
				status: "REVOKED" as any,
				revokedAt: new Date(),
				revokedReason: reason,
			},
		});
	}

	/**
	 * Automatically issue certificate if course is completed and no certificate exists.
	 */
	async autoIssueOnCompletion(courseId: string, studentId: string) {
		const courseProgress = await prisma.courseProgress.findUnique({
			where: { courseId_studentId: { courseId, studentId } },
		});

		if (!courseProgress?.isCompleted) {
			return null;
		}

		const existingCert = await prisma.certificate.findUnique({
			where: { courseId_studentId: { courseId, studentId } },
		});

		if (existingCert) {
			return existingCert;
		}

		return this.issueCertificate({ courseId, studentId });
	}
}

export const certificateService = new CertificateService();
