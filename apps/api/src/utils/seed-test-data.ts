/**
 * TEST DATA SEED
 * Run: npx tsx src/utils/seed-test-data.ts
 *
 * Creates realistic fake data for development/testing:
 *  - 2 Teachers with profiles, specializations, availabilities
 *  - 4 Students
 *  - 1 Category
 *  - 2 Courses (1 COACHING + 1 LMS), each with modules, lessons,
 *    live classes, video content, assignments, exams
 *  - Enrollments, assignment/exam submissions, progress
 *  - OneToOne sessions, recordings, reviews
 *  - Course reviews
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { PrismaClient } from "@/generated/client";
import logger from "./logger";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─── helpers ─────────────────────────────────────────────────────────────────

const hash = (pw: string) => bcrypt.hash(pw, 10);

function daysFromNow(n: number) {
	const d = new Date();
	d.setDate(d.getDate() + n);
	return d;
}

function hoursFromNow(h: number) {
	return new Date(Date.now() + h * 60 * 60 * 1000);
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
	logger.info("🌱  Seeding test data...");

	// ══════════════════════════════════════════════════════════════════
	// 1.  ROLES  (must already exist — run seed.ts first)
	// ══════════════════════════════════════════════════════════════════
	const [studentRole, teacherRole] = await Promise.all([
		prisma.role.findUniqueOrThrow({ where: { name: "Student" } }),
		prisma.role.findUniqueOrThrow({ where: { name: "Teacher" } }),
	]);

	// ══════════════════════════════════════════════════════════════════
	// 2.  USERS
	// ══════════════════════════════════════════════════════════════════
	const pw = await hash("Test@1234");

	const teacherUser1 = await prisma.user.upsert({
		where: { email: "sarah.johnson@test.com" },
		update: {},
		create: {
			email: "sarah.johnson@test.com",
			name: "Sarah Johnson",
			password: pw,
			phone: "+12025550101",
			isActive: true,
			isVerified: true,
			roleId: teacherRole.id,
		},
	});

	const teacherUser2 = await prisma.user.upsert({
		where: { email: "david.kim@test.com" },
		update: {},
		create: {
			email: "david.kim@test.com",
			name: "David Kim",
			password: pw,
			phone: "+12025550102",
			isActive: true,
			isVerified: true,
			roleId: teacherRole.id,
		},
	});

	const studentUser1 = await prisma.user.upsert({
		where: { email: "alice.smith@test.com" },
		update: {},
		create: {
			email: "alice.smith@test.com",
			name: "Alice Smith",
			password: pw,
			phone: "+12025550201",
			isActive: true,
			isVerified: true,
			roleId: studentRole.id,
		},
	});

	const studentUser2 = await prisma.user.upsert({
		where: { email: "bob.jones@test.com" },
		update: {},
		create: {
			email: "bob.jones@test.com",
			name: "Bob Jones",
			password: pw,
			phone: "+12025550202",
			isActive: true,
			isVerified: true,
			roleId: studentRole.id,
		},
	});

	const studentUser3 = await prisma.user.upsert({
		where: { email: "charlie.brown@test.com" },
		update: {},
		create: {
			email: "charlie.brown@test.com",
			name: "Charlie Brown",
			password: pw,
			phone: "+12025550203",
			isActive: true,
			isVerified: true,
			roleId: studentRole.id,
		},
	});

	const studentUser4 = await prisma.user.upsert({
		where: { email: "diana.prince@test.com" },
		update: {},
		create: {
			email: "diana.prince@test.com",
			name: "Diana Prince",
			password: pw,
			phone: "+12025550204",
			isActive: true,
			isVerified: true,
			roleId: studentRole.id,
		},
	});

	logger.info("  ✔ Users created");

	// ══════════════════════════════════════════════════════════════════
	// 3.  TEACHER RECORDS
	// ══════════════════════════════════════════════════════════════════
	const teacher1 = await prisma.teacher.upsert({
		where: { userId: teacherUser1.id },
		update: {},
		create: {
			userId: teacherUser1.id,
			bio: "Experienced SAT Math tutor with 8+ years helping students achieve perfect scores. Former Ivy League grad student.",
			qualifications: "M.Sc. Mathematics – Columbia University",
			experienceYears: 8,
			subjects: ["SAT Math", "Algebra", "Calculus", "Statistics"],
			certifications: ["College Board Certified", "SAT Expert Educator"],
		},
	});

	const teacher2 = await prisma.teacher.upsert({
		where: { userId: teacherUser2.id },
		update: {},
		create: {
			userId: teacherUser2.id,
			bio: "Specialist in SAT Evidence-Based Reading & Writing. Published author of SAT prep guides.",
			qualifications: "B.A. English Literature – UCLA",
			experienceYears: 6,
			subjects: ["SAT Reading", "SAT Writing", "Vocabulary", "Grammar"],
			certifications: ["Princeton Review Certified Tutor"],
		},
	});

	logger.info("  ✔ Teacher records created");

	// ══════════════════════════════════════════════════════════════════
	// 4.  STUDENT RECORDS
	// ══════════════════════════════════════════════════════════════════
	const student1 = await prisma.student.upsert({
		where: { userId: studentUser1.id },
		update: {},
		create: {
			userId: studentUser1.id,
			grade: "11",
			class: "A",
			section: "Science",
			academicStatus: "ACTIVE",
			currentLevel: "Advanced",
			gpa: 3.8,
			guardianName: "Mary Smith",
			guardianPhone: "+12025550301",
			guardianEmail: "mary.smith@test.com",
		},
	});

	const student2 = await prisma.student.upsert({
		where: { userId: studentUser2.id },
		update: {},
		create: {
			userId: studentUser2.id,
			grade: "12",
			class: "B",
			section: "Arts",
			academicStatus: "ACTIVE",
			currentLevel: "Intermediate",
			gpa: 3.4,
			guardianName: "Tom Jones",
			guardianPhone: "+12025550302",
			guardianEmail: "tom.jones@test.com",
		},
	});

	const student3 = await prisma.student.upsert({
		where: { userId: studentUser3.id },
		update: {},
		create: {
			userId: studentUser3.id,
			grade: "11",
			class: "A",
			section: "Science",
			academicStatus: "ACTIVE",
			currentLevel: "Beginner",
			gpa: 3.1,
		},
	});

	const student4 = await prisma.student.upsert({
		where: { userId: studentUser4.id },
		update: {},
		create: {
			userId: studentUser4.id,
			grade: "10",
			class: "C",
			section: "Commerce",
			academicStatus: "ACTIVE",
			currentLevel: "Intermediate",
			gpa: 3.6,
		},
	});

	logger.info("  ✔ Student records created");

	// ══════════════════════════════════════════════════════════════════
	// 5.  TEACHER PROFILES
	// ══════════════════════════════════════════════════════════════════
	const teacherProfile1 = await prisma.teacherProfile.upsert({
		where: { teacherId: teacher1.id },
		update: {},
		create: {
			teacherId: teacher1.id,
			onlineHourlyRate: 75,
			offlineHourlyRate: 90,
			timezone: "America/New_York",
			videoUrl: "https://example.com/videos/sarah-intro.mp4",
			rating: 4.8,
			totalSessions: 142,
			totalReviews: 38,
			isAvailable: true,
			responseTime: 2,
			specializations: {
				create: [
					{
						subject: "SAT Math",
						level: "ADVANCED",
						yearsExp: 8,
						description:
							"Full SAT Math section — algebra, problem-solving, data analysis",
					},
					{
						subject: "Calculus",
						level: "EXPERT",
						yearsExp: 10,
						description: "AP Calculus AB/BC and college-level calculus",
					},
				],
			},
		},
	});

	const teacherProfile2 = await prisma.teacherProfile.upsert({
		where: { teacherId: teacher2.id },
		update: {},
		create: {
			teacherId: teacher2.id,
			onlineHourlyRate: 65,
			offlineHourlyRate: 80,
			timezone: "America/Los_Angeles",
			rating: 4.6,
			totalSessions: 89,
			totalReviews: 24,
			isAvailable: true,
			responseTime: 3,
			specializations: {
				create: [
					{
						subject: "SAT Reading",
						level: "ADVANCED",
						yearsExp: 6,
						description:
							"Evidence-based reading, passage analysis, and critical thinking",
					},
					{
						subject: "SAT Writing",
						level: "ADVANCED",
						yearsExp: 6,
						description: "Grammar, expression of ideas, and essay writing",
					},
				],
			},
		},
	});

	logger.info("  ✔ Teacher profiles created");

	// ══════════════════════════════════════════════════════════════════
	// 6.  TEACHER AVAILABILITIES
	// ══════════════════════════════════════════════════════════════════
	// Teacher 1 – three upcoming slots
	const avail1 = await prisma.teacherAvailability.create({
		data: {
			profileId: teacherProfile1.id,
			availabilityType: "ONLINE",
			category: "AVAILABLE",
			sessionDuration: 60,
			hourlyRate: 75,
			title: "SAT Math Session",
			specificDate: daysFromNow(3),
			specificStartTime: new Date(daysFromNow(3).setHours(10, 0, 0, 0)),
			specificEndTime: new Date(daysFromNow(3).setHours(11, 0, 0, 0)),
			isBooked: true, // will be booked by a session below
		},
	});

	await prisma.teacherAvailability.create({
		data: {
			profileId: teacherProfile1.id,
			availabilityType: "ONLINE",
			category: "AVAILABLE",
			sessionDuration: 60,
			hourlyRate: 75,
			title: "SAT Math Session",
			specificDate: daysFromNow(7),
			specificStartTime: new Date(daysFromNow(7).setHours(14, 0, 0, 0)),
			specificEndTime: new Date(daysFromNow(7).setHours(15, 0, 0, 0)),
			isBooked: false,
		},
	});

	await prisma.teacherAvailability.create({
		data: {
			profileId: teacherProfile1.id,
			availabilityType: "OFFLINE",
			category: "AVAILABLE",
			sessionDuration: 90,
			hourlyRate: 90,
			title: "In-Person Math Tutoring",
			specificDate: daysFromNow(10),
			specificStartTime: new Date(daysFromNow(10).setHours(9, 0, 0, 0)),
			specificEndTime: new Date(daysFromNow(10).setHours(10, 30, 0, 0)),
			isBooked: false,
		},
	});

	// Teacher 2 – recurring weekly + one-time slot
	await prisma.teacherAvailability.create({
		data: {
			profileId: teacherProfile2.id,
			availabilityType: "ONLINE",
			category: "AVAILABLE",
			sessionDuration: 60,
			hourlyRate: 65,
			title: "SAT Reading Session",
			dayOfWeek: "MONDAY",
			repeatDuration: 90,
			isBooked: false,
		},
	});

	const avail5 = await prisma.teacherAvailability.create({
		data: {
			profileId: teacherProfile2.id,
			availabilityType: "ONLINE",
			category: "AVAILABLE",
			sessionDuration: 60,
			hourlyRate: 65,
			title: "SAT Writing Session",
			specificDate: daysFromNow(5),
			specificStartTime: new Date(daysFromNow(5).setHours(16, 0, 0, 0)),
			specificEndTime: new Date(daysFromNow(5).setHours(17, 0, 0, 0)),
			isBooked: true,
		},
	});

	logger.info("  ✔ Teacher availabilities created");

	// ══════════════════════════════════════════════════════════════════
	// 7.  CATEGORY
	// ══════════════════════════════════════════════════════════════════
	const category = await prisma.category.upsert({
		where: { name: "SAT Preparation" },
		update: {},
		create: {
			name: "SAT Preparation",
			description:
				"Comprehensive SAT test preparation courses covering all sections",
		},
	});

	logger.info("  ✔ Category created");

	// ══════════════════════════════════════════════════════════════════
	// 8.  COURSES
	// ══════════════════════════════════════════════════════════════════

	// ── 8a. COACHING course ─────────────────────────────────────────
	const coachingCourse = await prisma.course.upsert({
		where: { slug: "advanced-sat-math-coaching" },
		update: {},
		create: {
			courseType: "COACHING",
			title: "Advanced SAT Math — Coaching Program",
			slug: "advanced-sat-math-coaching",
			shortDescription:
				"Live, instructor-led SAT Math prep with weekly sessions, assignments, and exams.",
			longDescription:
				"A 12-week intensive coaching program designed to take students from intermediate to expert level in SAT Math. Includes live Jitsi sessions twice a week, graded assignments, and module-end exams. Limited to 20 students per cohort.",
			level: "ADVANCED",
			tags: ["SAT", "Math", "Coaching", "Algebra", "Data Analysis"],
			isPublished: true,
			publishedAt: new Date(),
			price: 1200,
			discount: 100,
			capacity: 20,
			startDate: daysFromNow(7),
			endDate: daysFromNow(91),
			categoryId: category.id,
			teacherId: teacher1.id,
			createdById: teacherUser1.id,
		},
	});

	// ── 8b. LMS course ──────────────────────────────────────────────
	const lmsCourse = await prisma.course.upsert({
		where: { slug: "sat-reading-mastery-lms" },
		update: {},
		create: {
			courseType: "LMS",
			title: "SAT Reading & Writing Mastery",
			slug: "sat-reading-mastery-lms",
			shortDescription:
				"Self-paced SAT Reading and Writing course with video lessons and practice exams.",
			longDescription:
				"Master every skill tested on the SAT Evidence-Based Reading and Writing section. Work through curated video lessons, reading passages, grammar drills, and full-length practice exams at your own pace.",
			level: "INTERMEDIATE",
			tags: ["SAT", "Reading", "Writing", "Vocabulary", "Self-paced"],
			isPublished: true,
			publishedAt: new Date(),
			price: 299,
			discount: 0,
			requirements: ["Basic English grammar knowledge", "Access to a computer"],
			whatYouLearn: [
				"Tackle SAT Reading passages confidently",
				"Master SAT grammar and expression of ideas",
				"Build an SAT-focused vocabulary",
				"Score 750+ on the Reading & Writing section",
			],
			averageRating: 4.6,
			totalReviews: 2,
			teacherId: teacher2.id,
			createdById: teacherUser2.id,
		},
	});

	logger.info("  ✔ Courses created");

	// ══════════════════════════════════════════════════════════════════
	// 9.  COURSE MODULES
	// ══════════════════════════════════════════════════════════════════

	// COACHING modules
	const coachingMod1 = await prisma.courseModule.create({
		data: {
			courseId: coachingCourse.id,
			title: "Module 1 — Algebra Foundations",
			description:
				"Covers linear equations, inequalities, and systems. Unlocked at enrollment.",
			orderIndex: 1,
			unlockAtPercent: 0,
			teacherId: teacher1.id,
		},
	});

	const coachingMod2 = await prisma.courseModule.create({
		data: {
			courseId: coachingCourse.id,
			title: "Module 2 — Problem Solving & Data Analysis",
			description: "Ratios, percentages, statistics, and data interpretation.",
			orderIndex: 2,
			unlockAtPercent: 50,
			teacherId: teacher1.id,
		},
	});

	// LMS modules
	const lmsMod1 = await prisma.courseModule.create({
		data: {
			courseId: lmsCourse.id,
			title: "Module 1 — Reading Comprehension",
			description: "Strategies for literary and informational passages.",
			orderIndex: 1,
			unlockAtPercent: 0,
			duration: 180,
		},
	});

	const lmsMod2 = await prisma.courseModule.create({
		data: {
			courseId: lmsCourse.id,
			title: "Module 2 — SAT Writing & Language",
			description: "Grammar, punctuation, and expression of ideas.",
			orderIndex: 2,
			unlockAtPercent: 0,
			duration: 210,
		},
	});

	logger.info("  ✔ Course modules created");

	// ══════════════════════════════════════════════════════════════════
	// 10. LESSONS
	// ══════════════════════════════════════════════════════════════════

	// ── Coaching Module 1 ───────────────────────────────────────────
	const lesson_c1_live = await prisma.lesson.create({
		data: {
			courseModuleId: coachingMod1.id,
			title: "Intro to Linear Equations — Live Session",
			description:
				"Interactive live class covering one- and two-variable linear equations.",
			orderIndex: 1,
			lessonType: "LIVE_CLASS",
			isPublished: true,
			publishedAt: new Date(),
		},
	});

	const lesson_c1_assign = await prisma.lesson.create({
		data: {
			courseModuleId: coachingMod1.id,
			title: "Algebra Foundations — Graded Assignment",
			description:
				"Practice problems testing everything from the first live session.",
			orderIndex: 2,
			lessonType: "ASSIGNMENT",
			isPublished: true,
			publishedAt: new Date(),
		},
	});

	const lesson_c1_exam = await prisma.lesson.create({
		data: {
			courseModuleId: coachingMod1.id,
			title: "Module 1 — End of Module Exam",
			description: "Timed exam covering all Algebra Foundation topics.",
			orderIndex: 3,
			lessonType: "EXAM",
			isPublished: true,
			publishedAt: new Date(),
		},
	});

	// ── Coaching Module 2 ───────────────────────────────────────────
	const lesson_c2_video = await prisma.lesson.create({
		data: {
			courseModuleId: coachingMod2.id,
			title: "Understanding Ratios & Percentages — Video",
			description: "Pre-recorded walkthrough of ratio and percentage problems.",
			orderIndex: 1,
			lessonType: "VIDEO_CONTENT",
			isPublished: true,
			publishedAt: new Date(),
		},
	});

	const lesson_c2_exam = await prisma.lesson.create({
		data: {
			courseModuleId: coachingMod2.id,
			title: "Module 2 — Data Analysis Exam",
			description: "Timed exam on problem solving and data analysis.",
			orderIndex: 2,
			lessonType: "EXAM",
			isPublished: true,
			publishedAt: new Date(),
		},
	});

	// ── LMS Module 1 ────────────────────────────────────────────────
	const lesson_l1_video = await prisma.lesson.create({
		data: {
			courseModuleId: lmsMod1.id,
			title: "Passage Types & Reading Strategies",
			description:
				"Video overview of literary, historical, and science passages.",
			orderIndex: 1,
			lessonType: "VIDEO_CONTENT",
			isPublished: true,
			publishedAt: new Date(),
		},
	});

	await prisma.lesson.create({
		data: {
			courseModuleId: lmsMod1.id,
			title: "How to Tackle Paired Passages",
			description:
				"Reading material and annotated examples for paired passage questions.",
			orderIndex: 2,
			lessonType: "READING_MATERIAL",
			isPublished: true,
			publishedAt: new Date(),
			content: `# Paired Passages Strategy

## What are Paired Passages?
The SAT Reading section always includes one set of paired passages — two shorter texts that relate to the same topic but may present different perspectives.

## Step-by-step Approach
1. **Read Passage 1 first** and answer its specific questions.
2. **Read Passage 2** with Passage 1 in mind.
3. **Tackle relationship questions last** — these ask how the authors agree, disagree, or differ in approach.

## Common Question Types
- "How would the author of Passage 2 respond to the claim in Passage 1?"
- "Both authors agree that..."
- "Unlike Passage 1, Passage 2 primarily..."

## Key Tips
- Don't compare while reading — focus on one passage at a time.
- Underline the main claim of each passage in the opening paragraph.
- For relationship questions, go back and find specific textual evidence.`,
		},
	});

	const lesson_l1_exam = await prisma.lesson.create({
		data: {
			courseModuleId: lmsMod1.id,
			title: "Reading Comprehension — Quiz",
			description:
				"Short quiz testing reading strategies covered in this module.",
			orderIndex: 3,
			lessonType: "EXAM",
			isPublished: true,
			publishedAt: new Date(),
		},
	});

	// ── LMS Module 2 ────────────────────────────────────────────────
	const lesson_l2_video = await prisma.lesson.create({
		data: {
			courseModuleId: lmsMod2.id,
			title: "SAT Grammar Rules — Video Series",
			description: "Concise video lessons on the most tested grammar rules.",
			orderIndex: 1,
			lessonType: "VIDEO_CONTENT",
			isPublished: true,
			publishedAt: new Date(),
		},
	});

	const lesson_l2_assign = await prisma.lesson.create({
		data: {
			courseModuleId: lmsMod2.id,
			title: "Grammar Drill — Writing Assignment",
			description:
				"Apply grammar rules by correcting 20 real SAT-style sentences.",
			orderIndex: 2,
			lessonType: "ASSIGNMENT",
			isPublished: true,
			publishedAt: new Date(),
		},
	});

	logger.info("  ✔ Lessons created");

	// ══════════════════════════════════════════════════════════════════
	// 11. LIVE CLASS (for coaching live lesson)
	// ══════════════════════════════════════════════════════════════════
	await prisma.liveClass.create({
		data: {
			lessonId: lesson_c1_live.id,
			teacherId: teacher1.id,
			provider: "JITSI",
			status: "SCHEDULED",
			meetingId: "prepexc-alg-001",
			meetingUrl: "https://meet.jit.si/prepexc-alg-001",
			hostUrl:
				"https://meet.jit.si/prepexc-alg-001#userInfo.displayName=Sarah%20Johnson",
			scheduledStartAt: daysFromNow(8),
			scheduledEndAt: hoursFromNow(24 * 8 + 1.5),
			durationMinutes: 90,
			maxParticipants: 20,
			isRecorded: true,
		},
	});

	// ══════════════════════════════════════════════════════════════════
	// 12. VIDEO CONTENT
	// ══════════════════════════════════════════════════════════════════
	await prisma.videoContent.create({
		data: {
			lessonId: lesson_c2_video.id,
			title: "Ratios & Percentages Walkthrough",
			description: "35-minute recorded lesson with worked examples.",
			status: "ready",
			masterPlaylistUrl:
				"https://cdn.example.com/videos/ratios-pct/master.m3u8",
			thumbnailUrl: "https://cdn.example.com/thumbs/ratios-pct.jpg",
			duration: 2100,
			width: 1920,
			height: 1080,
			codec: "h264",
			bitrate: 2500000,
			fps: 30,
			fileSize: 650000000,
			processedAt: new Date(),
		},
	});

	await prisma.videoContent.create({
		data: {
			lessonId: lesson_l1_video.id,
			title: "Passage Types & Reading Strategies",
			description: "28-minute overview of SAT reading passage categories.",
			status: "ready",
			masterPlaylistUrl:
				"https://cdn.example.com/videos/passage-types/master.m3u8",
			thumbnailUrl: "https://cdn.example.com/thumbs/passage-types.jpg",
			duration: 1680,
			width: 1920,
			height: 1080,
			codec: "h264",
			bitrate: 2000000,
			fps: 30,
			fileSize: 420000000,
			processedAt: new Date(),
		},
	});

	await prisma.videoContent.create({
		data: {
			lessonId: lesson_l2_video.id,
			title: "SAT Grammar Rules — Full Series",
			description:
				"45-minute grammar video covering subject-verb agreement, punctuation, and concision.",
			status: "ready",
			masterPlaylistUrl:
				"https://cdn.example.com/videos/grammar-rules/master.m3u8",
			thumbnailUrl: "https://cdn.example.com/thumbs/grammar-rules.jpg",
			duration: 2700,
			width: 1920,
			height: 1080,
			codec: "h264",
			bitrate: 2200000,
			fps: 30,
			fileSize: 590000000,
			processedAt: new Date(),
		},
	});

	logger.info("  ✔ Video content created");

	// ══════════════════════════════════════════════════════════════════
	// 13. ASSIGNMENTS
	// ══════════════════════════════════════════════════════════════════
	const assignment1 = await prisma.assignment.create({
		data: {
			lessonId: lesson_c1_assign.id,
			title: "Algebra Foundations Practice Set",
			description:
				"20-question practice set covering linear equations and inequalities.",
			instructions:
				"Solve each problem and show your work. For systems of equations, indicate the method used (substitution or elimination). Submit your answers as typed text below.",
			totalPoints: 100,
			dueDate: daysFromNow(14),
			allowLateSubmission: true,
			lateSubmissionPenalty: 10,
		},
	});

	const assignment2 = await prisma.assignment.create({
		data: {
			lessonId: lesson_l2_assign.id,
			title: "SAT Grammar Correction Drill",
			description: "Correct 20 SAT-style sentences and explain each fix.",
			instructions:
				"For each sentence, (1) identify the error type, (2) write the corrected sentence, and (3) explain the rule applied. Submit as a single text response.",
			totalPoints: 100,
			dueDate: daysFromNow(21),
			allowLateSubmission: false,
		},
	});

	logger.info("  ✔ Assignments created");

	// ══════════════════════════════════════════════════════════════════
	// 14. EXAMS  (with questions and options)
	// ══════════════════════════════════════════════════════════════════

	// ── Exam A: Coaching Module 1 end-of-module exam ───────────────
	const examA = await prisma.exam.create({
		data: {
			lessonId: lesson_c1_exam.id,
			title: "Algebra Foundations — End of Module Exam",
			description: "15 multiple-choice questions. You have 20 minutes.",
			passingScore: 70,
			timeLimit: 20,
			maxAttempts: 2,
			shuffleQuestions: false,
			showResults: true,
		},
	});

	// Questions for Exam A
	const [eAq1, eAq2, eAq3] = await Promise.all([
		prisma.examQuestion.create({
			data: {
				examId: examA.id,
				question: "If 3x + 7 = 22, what is the value of x?",
				type: "MCQ_SINGLE",
				orderIndex: 1,
				points: 2,
				explanation:
					"Subtract 7 from both sides: 3x = 15, then divide by 3: x = 5.",
				options: {
					create: [
						{ text: "3", isCorrect: false, orderIndex: 1 },
						{ text: "5", isCorrect: true, orderIndex: 2 },
						{ text: "7", isCorrect: false, orderIndex: 3 },
						{ text: "15", isCorrect: false, orderIndex: 4 },
					],
				},
			},
		}),
		prisma.examQuestion.create({
			data: {
				examId: examA.id,
				question:
					"Which of the following is the solution to the system: y = 2x + 1 and y = -x + 7?",
				type: "MCQ_SINGLE",
				orderIndex: 2,
				points: 2,
				explanation: "Set equal: 2x + 1 = -x + 7 → 3x = 6 → x = 2, y = 5.",
				options: {
					create: [
						{ text: "(1, 3)", isCorrect: false, orderIndex: 1 },
						{ text: "(2, 5)", isCorrect: true, orderIndex: 2 },
						{ text: "(3, 7)", isCorrect: false, orderIndex: 3 },
						{ text: "(-2, -3)", isCorrect: false, orderIndex: 4 },
					],
				},
			},
		}),
		prisma.examQuestion.create({
			data: {
				examId: examA.id,
				question:
					"The inequality 2x − 4 > 10 is satisfied by which value of x?",
				type: "MCQ_SINGLE",
				orderIndex: 3,
				points: 2,
				explanation: "2x > 14 → x > 7. Only x = 8 satisfies this.",
				options: {
					create: [
						{ text: "x = 5", isCorrect: false, orderIndex: 1 },
						{ text: "x = 7", isCorrect: false, orderIndex: 2 },
						{ text: "x = 8", isCorrect: true, orderIndex: 3 },
						{ text: "x = 3", isCorrect: false, orderIndex: 4 },
					],
				},
			},
		}),
	]);

	// ── Exam B: LMS Module 1 reading quiz ─────────────────────────
	const examB = await prisma.exam.create({
		data: {
			lessonId: lesson_l1_exam.id,
			title: "Reading Comprehension — Module Quiz",
			description: "10 questions testing reading strategies. No time limit.",
			passingScore: 60,
			timeLimit: null,
			maxAttempts: 3,
			shuffleQuestions: true,
			showResults: true,
		},
	});

	const [eBq1, eBq2] = await Promise.all([
		prisma.examQuestion.create({
			data: {
				examId: examB.id,
				question: "When tackling paired passages, which step should come LAST?",
				type: "MCQ_SINGLE",
				orderIndex: 1,
				points: 1,
				explanation:
					"Relationship questions require understanding both passages, so they should be answered last.",
				options: {
					create: [
						{
							text: "Answer Passage 1 specific questions",
							isCorrect: false,
							orderIndex: 1,
						},
						{
							text: "Answer Passage 2 specific questions",
							isCorrect: false,
							orderIndex: 2,
						},
						{
							text: "Answer questions about both passages",
							isCorrect: true,
							orderIndex: 3,
						},
						{
							text: "Skim both passages simultaneously",
							isCorrect: false,
							orderIndex: 4,
						},
					],
				},
			},
		}),
		prisma.examQuestion.create({
			data: {
				examId: examB.id,
				question:
					"Which of the following is NOT one of the main SAT passage types?",
				type: "MCQ_SINGLE",
				orderIndex: 2,
				points: 1,
				explanation:
					"The main types are literary, historical/social studies, and science. 'Mathematical' is not a category.",
				options: {
					create: [
						{ text: "Literary fiction", isCorrect: false, orderIndex: 1 },
						{
							text: "Historical / social studies",
							isCorrect: false,
							orderIndex: 2,
						},
						{ text: "Science", isCorrect: false, orderIndex: 3 },
						{ text: "Mathematical reasoning", isCorrect: true, orderIndex: 4 },
					],
				},
			},
		}),
	]);

	// ── Exam C: Coaching Module 2 data analysis exam ───────────────
	const examC = await prisma.exam.create({
		data: {
			lessonId: lesson_c2_exam.id,
			title: "Data Analysis — Module 2 Exam",
			description:
				"10 questions on ratios, percentages, and data interpretation.",
			passingScore: 70,
			timeLimit: 15,
			maxAttempts: 1,
			shuffleQuestions: false,
			showResults: true,
		},
	});

	await Promise.all([
		prisma.examQuestion.create({
			data: {
				examId: examC.id,
				question: "A store reduces a $80 item by 25%. What is the sale price?",
				type: "MCQ_SINGLE",
				orderIndex: 1,
				points: 2,
				explanation: "25% of $80 = $20. Sale price = $80 − $20 = $60.",
				options: {
					create: [
						{ text: "$50", isCorrect: false, orderIndex: 1 },
						{ text: "$55", isCorrect: false, orderIndex: 2 },
						{ text: "$60", isCorrect: true, orderIndex: 3 },
						{ text: "$65", isCorrect: false, orderIndex: 4 },
					],
				},
			},
		}),
	]);

	logger.info("  ✔ Exams, questions, and options created");

	// ══════════════════════════════════════════════════════════════════
	// 15. ENROLLMENTS
	// ══════════════════════════════════════════════════════════════════
	// Alice + Bob + Charlie → coaching course
	// Bob + Charlie + Diana → LMS course
	await prisma.enrollment.upsert({
		where: {
			courseId_studentId: {
				courseId: coachingCourse.id,
				studentId: student1.id,
			},
		},
		update: {},
		create: {
			courseId: coachingCourse.id,
			studentId: student1.id,
			status: "ACTIVE",
		},
	});
	await prisma.enrollment.upsert({
		where: {
			courseId_studentId: {
				courseId: coachingCourse.id,
				studentId: student2.id,
			},
		},
		update: {},
		create: {
			courseId: coachingCourse.id,
			studentId: student2.id,
			status: "ACTIVE",
		},
	});
	await prisma.enrollment.upsert({
		where: {
			courseId_studentId: {
				courseId: coachingCourse.id,
				studentId: student3.id,
			},
		},
		update: {},
		create: {
			courseId: coachingCourse.id,
			studentId: student3.id,
			status: "ACTIVE",
		},
	});

	await prisma.enrollment.upsert({
		where: {
			courseId_studentId: { courseId: lmsCourse.id, studentId: student2.id },
		},
		update: {},
		create: {
			courseId: lmsCourse.id,
			studentId: student2.id,
			status: "ACTIVE",
		},
	});
	await prisma.enrollment.upsert({
		where: {
			courseId_studentId: { courseId: lmsCourse.id, studentId: student3.id },
		},
		update: {},
		create: {
			courseId: lmsCourse.id,
			studentId: student3.id,
			status: "ACTIVE",
		},
	});
	await prisma.enrollment.upsert({
		where: {
			courseId_studentId: { courseId: lmsCourse.id, studentId: student4.id },
		},
		update: {},
		create: {
			courseId: lmsCourse.id,
			studentId: student4.id,
			status: "ACTIVE",
		},
	});

	logger.info("  ✔ Enrollments created");

	// ══════════════════════════════════════════════════════════════════
	// 16. ASSIGNMENT SUBMISSIONS
	// ══════════════════════════════════════════════════════════════════

	// Alice submitted + graded (coaching assignment)
	await prisma.assignmentSubmission.upsert({
		where: {
			assignmentId_studentId: {
				assignmentId: assignment1.id,
				studentId: student1.id,
			},
		},
		update: {},
		create: {
			assignmentId: assignment1.id,
			studentId: student1.id,
			status: "GRADED",
			submittedAt: daysFromNow(-2),
			textAnswer:
				"Q1: x = 5 (subtracted 7, then divided by 3). Q2: (2,5) using substitution. Q3: x = 8 because 2(8)-4=12 > 10...",
			score: 88,
			isPassed: true,
			teacherFeedback:
				"Excellent work Alice! Great methodology shown on Q2. Minor arithmetic slip on Q7.",
			reviewedAt: daysFromNow(-1),
			reviewedById: teacher1.id,
			publishedAt: daysFromNow(-1),
		},
	});

	// Bob submitted but not yet graded
	await prisma.assignmentSubmission.upsert({
		where: {
			assignmentId_studentId: {
				assignmentId: assignment1.id,
				studentId: student2.id,
			},
		},
		update: {},
		create: {
			assignmentId: assignment1.id,
			studentId: student2.id,
			status: "SUBMITTED",
			submittedAt: new Date(),
			textAnswer:
				"Q1: 3x+7=22, 3x=15, x=5. Q2: Setting equations equal gives x=2, y=5...",
		},
	});

	// Bob submitted LMS grammar assignment
	await prisma.assignmentSubmission.upsert({
		where: {
			assignmentId_studentId: {
				assignmentId: assignment2.id,
				studentId: student2.id,
			},
		},
		update: {},
		create: {
			assignmentId: assignment2.id,
			studentId: student2.id,
			status: "UNDER_REVIEW",
			submittedAt: daysFromNow(-1),
			textAnswer:
				"Sentence 1: 'The team are playing well' → 'The team is playing well'. Error: subject-verb agreement...",
		},
	});

	logger.info("  ✔ Assignment submissions created");

	// ══════════════════════════════════════════════════════════════════
	// 17. EXAM SUBMISSIONS
	// ══════════════════════════════════════════════════════════════════

	// Re-fetch questions with their options (options were created in nested writes)
	const [eAq1Full, eAq2Full, eAq3Full, eBq1Full, eBq2Full] = await Promise.all([
		prisma.examQuestion.findUniqueOrThrow({
			where: { id: eAq1.id },
			include: { options: true },
		}),
		prisma.examQuestion.findUniqueOrThrow({
			where: { id: eAq2.id },
			include: { options: true },
		}),
		prisma.examQuestion.findUniqueOrThrow({
			where: { id: eAq3.id },
			include: { options: true },
		}),
		prisma.examQuestion.findUniqueOrThrow({
			where: { id: eBq1.id },
			include: { options: true },
		}),
		prisma.examQuestion.findUniqueOrThrow({
			where: { id: eBq2.id },
			include: { options: true },
		}),
	]);

	const correctOption = (q: typeof eAq1Full) =>
		q.options.find((o) => o.isCorrect)!;
	const wrongOption = (q: typeof eAq1Full) =>
		q.options.find((o) => !o.isCorrect)!;

	// Alice — Exam A — passed (all correct)
	const examSubA_Alice = await prisma.examSubmission.create({
		data: {
			examId: examA.id,
			studentId: student1.id,
			status: "PUBLISHED",
			submittedAt: daysFromNow(-3),
			completedAt: daysFromNow(-3),
			score: 100,
			totalPoints: 6,
			earnedPoints: 6,
			totalQuestions: 3,
			correctAnswers: 3,
			isPassed: true,
			timeSpent: 720,
			reviewedAt: daysFromNow(-2),
			reviewedById: teacher1.id,
			teacherFeedback: "Perfect score! Strong algebra fundamentals.",
			publishedAt: daysFromNow(-2),
		},
	});

	await Promise.all([
		prisma.examAnswer.create({
			data: {
				submissionId: examSubA_Alice.id,
				questionId: eAq1Full.id,
				selectedOptionId: correctOption(eAq1Full).id,
				isCorrect: true,
				pointsEarned: 2,
			},
		}),
		prisma.examAnswer.create({
			data: {
				submissionId: examSubA_Alice.id,
				questionId: eAq2Full.id,
				selectedOptionId: correctOption(eAq2Full).id,
				isCorrect: true,
				pointsEarned: 2,
			},
		}),
		prisma.examAnswer.create({
			data: {
				submissionId: examSubA_Alice.id,
				questionId: eAq3Full.id,
				selectedOptionId: correctOption(eAq3Full).id,
				isCorrect: true,
				pointsEarned: 2,
			},
		}),
	]);

	// Bob — Exam A — failed (2 wrong)
	const examSubA_Bob = await prisma.examSubmission.create({
		data: {
			examId: examA.id,
			studentId: student2.id,
			status: "GRADED",
			submittedAt: daysFromNow(-3),
			completedAt: daysFromNow(-3),
			score: 33,
			totalPoints: 6,
			earnedPoints: 2,
			totalQuestions: 3,
			correctAnswers: 1,
			isPassed: false,
			timeSpent: 1100,
			reviewedAt: daysFromNow(-2),
			reviewedById: teacher1.id,
			teacherFeedback:
				"Review systems of equations and inequalities before your retake.",
		},
	});

	await Promise.all([
		prisma.examAnswer.create({
			data: {
				submissionId: examSubA_Bob.id,
				questionId: eAq1Full.id,
				selectedOptionId: correctOption(eAq1Full).id,
				isCorrect: true,
				pointsEarned: 2,
			},
		}),
		prisma.examAnswer.create({
			data: {
				submissionId: examSubA_Bob.id,
				questionId: eAq2Full.id,
				selectedOptionId: wrongOption(eAq2Full).id,
				isCorrect: false,
				pointsEarned: 0,
			},
		}),
		prisma.examAnswer.create({
			data: {
				submissionId: examSubA_Bob.id,
				questionId: eAq3Full.id,
				selectedOptionId: wrongOption(eAq3Full).id,
				isCorrect: false,
				pointsEarned: 0,
			},
		}),
	]);

	// Bob — Exam B (LMS reading quiz) — passed
	const examSubB_Bob = await prisma.examSubmission.create({
		data: {
			examId: examB.id,
			studentId: student2.id,
			status: "PUBLISHED",
			submittedAt: daysFromNow(-1),
			completedAt: daysFromNow(-1),
			score: 100,
			totalPoints: 2,
			earnedPoints: 2,
			totalQuestions: 2,
			correctAnswers: 2,
			isPassed: true,
			timeSpent: 420,
			publishedAt: daysFromNow(-1),
		},
	});

	await Promise.all([
		prisma.examAnswer.create({
			data: {
				submissionId: examSubB_Bob.id,
				questionId: eBq1Full.id,
				selectedOptionId: correctOption(eBq1Full).id,
				isCorrect: true,
				pointsEarned: 1,
			},
		}),
		prisma.examAnswer.create({
			data: {
				submissionId: examSubB_Bob.id,
				questionId: eBq2Full.id,
				selectedOptionId: correctOption(eBq2Full).id,
				isCorrect: true,
				pointsEarned: 1,
			},
		}),
	]);

	logger.info("  ✔ Exam submissions and answers created");

	// ══════════════════════════════════════════════════════════════════
	// 18. LESSON PROGRESS + COURSE PROGRESS
	// ══════════════════════════════════════════════════════════════════

	// Alice — coaching course progress
	const cpAlice = await prisma.courseProgress.upsert({
		where: {
			courseId_studentId: {
				courseId: coachingCourse.id,
				studentId: student1.id,
			},
		},
		update: {},
		create: {
			courseId: coachingCourse.id,
			studentId: student1.id,
			progressPercent: 40,
			startedAt: daysFromNow(-5),
			completedLessons: 2,
			totalLessons: 5,
			completedModules: 0,
			totalModules: 2,
			averageExamScore: 100,
			averageAssignmentScore: 88,
			lastActivityAt: daysFromNow(-1),
			lastLessonId: lesson_c1_assign.id,
		},
	});

	await prisma.lessonProgress.upsert({
		where: {
			lessonId_studentId: {
				lessonId: lesson_c1_live.id,
				studentId: student1.id,
			},
		},
		update: {},
		create: {
			lessonId: lesson_c1_live.id,
			studentId: student1.id,
			courseProgressId: cpAlice.id,
			isCompleted: true,
			completedAt: daysFromNow(-4),
			liveClassWatched: true,
			liveClassWatchTime: 5400,
		},
	});

	await prisma.lessonProgress.upsert({
		where: {
			lessonId_studentId: {
				lessonId: lesson_c1_assign.id,
				studentId: student1.id,
			},
		},
		update: {},
		create: {
			lessonId: lesson_c1_assign.id,
			studentId: student1.id,
			courseProgressId: cpAlice.id,
			isCompleted: true,
			completedAt: daysFromNow(-2),
			assignmentCompleted: true,
			assignmentScore: 88,
			assignmentPassed: true,
		},
	});

	logger.info("  ✔ Course & lesson progress created");

	// ══════════════════════════════════════════════════════════════════
	// 19. ONE-TO-ONE SESSIONS
	// ══════════════════════════════════════════════════════════════════

	// Session 1: COMPLETED — Alice with Teacher 1 (past)
	const session1 = await prisma.oneToOneSession.create({
		data: {
			teacherAvailabilityId: avail1.id,
			studentId: student1.id,
			status: "COMPLETED",
			scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
			duration: 60,
			timezone: "America/New_York",
			topic: "SAT Math — Linear Equations deep dive",
			notes:
				"I want to go over systems of equations and word problems involving rates.",
			jitsiRoomId: "prepexc-alice-sarah-001",
			jitsiRoomToken: "eyJhbGciOiJIUzI1NiJ9.test_token_alice_sarah",
			actualStartTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
			actualEndTime: new Date(
				Date.now() - 7 * 24 * 60 * 60 * 1000 + 65 * 60 * 1000,
			),
			actualDuration: 65,
		},
	});

	// Session 2: SCHEDULED — Bob with Teacher 2 (upcoming)
	await prisma.oneToOneSession.create({
		data: {
			teacherAvailabilityId: avail5.id,
			studentId: student2.id,
			status: "SCHEDULED",
			scheduledAt: daysFromNow(5),
			duration: 60,
			timezone: "America/Chicago",
			topic: "SAT Writing — Punctuation and transition words",
			notes:
				"Struggling with comma usage and semicolons in the writing section.",
			jitsiRoomId: "prepexc-bob-david-001",
			jitsiRoomToken: "eyJhbGciOiJIUzI1NiJ9.test_token_bob_david",
		},
	});

	logger.info("  ✔ OneToOne sessions created");

	// ══════════════════════════════════════════════════════════════════
	// 20. SESSION RECORDING (for completed session)
	// ══════════════════════════════════════════════════════════════════
	await prisma.sessionRecording.create({
		data: {
			sessionId: session1.id,
			status: "ready",
			masterPlaylistUrl:
				"https://cdn.example.com/recordings/prepexc-alice-sarah-001/master.m3u8",
			thumbnailUrl:
				"https://cdn.example.com/recordings/prepexc-alice-sarah-001/thumb.jpg",
			duration: 3900,
			fileSize: 980000000,
			isDownloadEnabled: true,
			downloadCount: 2,
			lastDownloadAt: daysFromNow(-5),
			expiresAt: daysFromNow(0), // expires today (7 days after session)
		},
	});

	logger.info("  ✔ Session recording created");

	// ══════════════════════════════════════════════════════════════════
	// 21. ONE-TO-ONE REVIEWS
	// ══════════════════════════════════════════════════════════════════
	await prisma.oneToOneReview.create({
		data: {
			sessionId: session1.id,
			teacherProfileId: teacherProfile1.id,
			studentId: student1.id,
			rating: 5,
			comment:
				"Sarah was fantastic! She explained systems of equations in a completely new way that finally clicked for me. Highly recommend for anyone struggling with SAT Math.",
			isPublic: true,
			response:
				"Thank you Alice! It was a pleasure working with you. Your problem-solving instinct is already excellent — keep practicing the word problems and you'll be unstoppable!",
			respondedAt: daysFromNow(-6),
		},
	});

	logger.info("  ✔ OneToOne review created");

	// ══════════════════════════════════════════════════════════════════
	// 22. COURSE REVIEWS (LMS)
	// ══════════════════════════════════════════════════════════════════
	await prisma.review.upsert({
		where: {
			courseId_studentId: { courseId: lmsCourse.id, studentId: student2.id },
		},
		update: {},
		create: {
			courseId: lmsCourse.id,
			studentId: student2.id,
			rating: 5,
			comment:
				"Extremely well-structured course. The paired passage strategy alone raised my score by 40 points. The video quality is excellent.",
		},
	});

	await prisma.review.upsert({
		where: {
			courseId_studentId: { courseId: lmsCourse.id, studentId: student4.id },
		},
		update: {},
		create: {
			courseId: lmsCourse.id,
			studentId: student4.id,
			rating: 4,
			comment:
				"Very helpful content. I wish there were more practice passages included, but the instruction is clear and the quizzes are spot-on.",
		},
	});

	logger.info("  ✔ Course reviews created");

	// ══════════════════════════════════════════════════════════════════
	// DONE
	// ══════════════════════════════════════════════════════════════════
	logger.info("");
	logger.info("✅  Test data seeding complete!");
	logger.info("");
	logger.info("  Test accounts (password: Test@1234):");
	logger.info("    Teacher  → sarah.johnson@test.com");
	logger.info("    Teacher  → david.kim@test.com");
	logger.info("    Student  → alice.smith@test.com");
	logger.info("    Student  → bob.jones@test.com");
	logger.info("    Student  → charlie.brown@test.com");
	logger.info("    Student  → diana.prince@test.com");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		logger.error("Seeding failed:", e);
		await prisma.$disconnect();
		process.exit(1);
	});
