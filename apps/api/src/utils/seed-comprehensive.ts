/**
 * COMPREHENSIVE TEST DATA SEED
 * Run: pnpm seed:full   (or: npx tsx src/utils/seed-comprehensive.ts)
 *
 * Creates:
 *   • 5 Teachers  (Dr. Kaiser Alam is the primary — owns all courses/sessions)
 *   • 5 Students
 *   • 2 Categories  (SAT Preparation, College Prep)
 *   • 5 LMS Courses        — all created by Dr. Kaiser Alam
 *   • 5 Coaching Courses   — all created by Dr. Kaiser Alam
 *   • Each course gets 2 modules × 2 lessons (VIDEO + EXAM for LMS; LIVE_CLASS + ASSIGNMENT for Coaching)
 *   • 5 OneToOne sessions  — Dr. Kaiser Alam ↔ students
 *   • 5 Blogs              — authored by Dr. Kaiser Alam
 *   • Enrollments, reviews, session recordings
 *
 * Requires seed.ts to have been run first (roles must exist).
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

function daysFrom(base: Date, n: number) {
	const d = new Date(base);
	d.setDate(d.getDate() + n);
	return d;
}

const now = new Date();
const past = (n: number) => daysFrom(now, -n);
const future = (n: number) => daysFrom(now, n);

function atHour(date: Date, h: number, m = 0) {
	const d = new Date(date);
	d.setHours(h, m, 0, 0);
	return d;
}

function slug(s: string) {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-");
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN
// ═════════════════════════════════════════════════════════════════════════════

async function main() {
	logger.info("🌱  Starting comprehensive seed...\n");

	// ══════════════════════════════════════════════════════════════════
	// 1.  ROLES
	// ══════════════════════════════════════════════════════════════════
	const [studentRole, teacherRole] = await Promise.all([
		prisma.role.findUniqueOrThrow({ where: { name: "Student" } }),
		prisma.role.findUniqueOrThrow({ where: { name: "Teacher" } }),
		prisma.role.findUniqueOrThrow({ where: { name: "SuperAdmin" } }), // fetched to verify role exists
	]);

	const pw = await hash("Test@1234");

	// ══════════════════════════════════════════════════════════════════
	// 2.  TEACHER USERS  (5 total — Dr. Kaiser Alam is [0])
	// ══════════════════════════════════════════════════════════════════
	const teacherDefs = [
		{
			email: "kaiser.alam@preptest.com",
			name: "Dr. Kaiser Alam",
			phone: "+18005550001",
			bio: "PhD in Mathematics from MIT with 15+ years of SAT and college-prep tutoring experience. Author of 'Mastering SAT Math' and three-time College Board recognized educator. Expert in turning struggling students into 1500+ scorers.",
			qualifications: "Ph.D. Mathematics – MIT, B.Sc. Applied Math – Harvard",
			experienceYears: 15,
			subjects: [
				"SAT Math",
				"Calculus",
				"Algebra",
				"Statistics",
				"College Counseling",
			],
			certifications: [
				"College Board Recognized Educator",
				"Khan Academy Partner",
				"AP Calculus Certified",
			],
			onlineRate: 120,
			offlineRate: 150,
			rating: 4.9,
			totalSessions: 412,
			totalReviews: 98,
		},
		{
			email: "priya.sharma@preptest.com",
			name: "Ms. Priya Sharma",
			phone: "+18005550002",
			bio: "Bilingual SAT Reading & Writing coach. Expert in helping non-native English speakers boost their verbal scores.",
			qualifications: "M.A. English Linguistics – UCLA",
			experienceYears: 7,
			subjects: ["SAT Reading", "SAT Writing", "ESL", "Vocabulary"],
			certifications: ["TESOL Certified", "Princeton Review Senior Tutor"],
			onlineRate: 75,
			offlineRate: 90,
			rating: 4.7,
			totalSessions: 187,
			totalReviews: 45,
		},
		{
			email: "james.wilson@preptest.com",
			name: "Mr. James Wilson",
			phone: "+18005550003",
			bio: "Former SAT item writer at ETS. Knows exactly what the test-makers look for in every question.",
			qualifications: "M.Ed. Education Assessment – Stanford",
			experienceYears: 12,
			subjects: ["SAT Math", "SAT Reading", "Test Strategy", "Time Management"],
			certifications: ["ETS Certified Question Writer", "NBCT Certified"],
			onlineRate: 100,
			offlineRate: 120,
			rating: 4.8,
			totalSessions: 310,
			totalReviews: 72,
		},
		{
			email: "fatima.hassan@preptest.com",
			name: "Dr. Fatima Hassan",
			phone: "+18005550004",
			bio: "Specialist in advanced math and science college prep. Helped 200+ students gain admission to top-20 universities.",
			qualifications: "Ph.D. Physics – Caltech",
			experienceYears: 9,
			subjects: ["SAT Math", "AP Physics", "AP Chemistry", "College Essays"],
			certifications: ["AP Physics Certified", "College Counseling Certified"],
			onlineRate: 95,
			offlineRate: 110,
			rating: 4.6,
			totalSessions: 244,
			totalReviews: 57,
		},
		{
			email: "lucas.chen@preptest.com",
			name: "Mr. Lucas Chen",
			phone: "+18005550005",
			bio: "Data scientist turned SAT tutor. Makes statistics and data analysis the easiest part of your SAT.",
			qualifications: "M.S. Data Science – Carnegie Mellon",
			experienceYears: 5,
			subjects: [
				"SAT Data Analysis",
				"Statistics",
				"SAT Math",
				"Python for Students",
			],
			certifications: ["Kaplan Elite Tutor", "ACT/SAT Dual Certified"],
			onlineRate: 70,
			offlineRate: 85,
			rating: 4.5,
			totalSessions: 98,
			totalReviews: 22,
		},
	];

	const teacherUsers = await Promise.all(
		teacherDefs.map((t) =>
			prisma.user.upsert({
				where: { email: t.email },
				update: {},
				create: {
					email: t.email,
					name: t.name,
					phone: t.phone,
					password: pw,
					isActive: true,
					isVerified: true,
					roleId: teacherRole.id,
				},
			}),
		),
	);

	const teachers = await Promise.all(
		teacherDefs.map((t, i) =>
			prisma.teacher.upsert({
				where: { userId: teacherUsers[i].id },
				update: {},
				create: {
					userId: teacherUsers[i].id,
					bio: t.bio,
					qualifications: t.qualifications,
					experienceYears: t.experienceYears,
					subjects: t.subjects,
					certifications: t.certifications,
				},
			}),
		),
	);

	// Dr. Kaiser Alam convenience references
	const kaiser = teachers[0];
	const kaiserUser = teacherUsers[0];

	const teacherProfiles = await Promise.all(
		teacherDefs.map((t, i) =>
			prisma.teacherProfile.upsert({
				where: { teacherId: teachers[i].id },
				update: {},
				create: {
					teacherId: teachers[i].id,
					onlineHourlyRate: t.onlineRate,
					offlineHourlyRate: t.offlineRate,
					timezone:
						i < 2
							? "America/New_York"
							: i < 4
								? "America/Chicago"
								: "America/Los_Angeles",
					rating: t.rating,
					totalSessions: t.totalSessions,
					totalReviews: t.totalReviews,
					isAvailable: true,
					responseTime: i + 1,
					specializations: {
						create: t.subjects.slice(0, 2).map((subject, j) => ({
							subject,
							level:
								j === 0 ? ("ADVANCED" as const) : ("INTERMEDIATE" as const),
							yearsExp: t.experienceYears - j,
							description: `${t.name} specializes in ${subject} with proven results.`,
						})),
					},
				},
			}),
		),
	);

	const kaiserProfile = teacherProfiles[0];

	logger.info("  ✔ 5 teachers created");

	// ══════════════════════════════════════════════════════════════════
	// 3.  STUDENT USERS  (5 total)
	// ══════════════════════════════════════════════════════════════════
	const studentDefs = [
		{
			email: "aiden.martinez@preptest.com",
			name: "Aiden Martinez",
			phone: "+18005550101",
			grade: "11",
			gpa: 3.7,
			currentLevel: "Intermediate",
			guardianName: "Carlos Martinez",
			guardianPhone: "+18005550201",
			guardianEmail: "carlos.martinez@preptest.com",
		},
		{
			email: "sophia.lee@preptest.com",
			name: "Sophia Lee",
			phone: "+18005550102",
			grade: "12",
			gpa: 3.9,
			currentLevel: "Advanced",
			guardianName: "Jenny Lee",
			guardianPhone: "+18005550202",
			guardianEmail: "jenny.lee@preptest.com",
		},
		{
			email: "noah.thompson@preptest.com",
			name: "Noah Thompson",
			phone: "+18005550103",
			grade: "10",
			gpa: 3.2,
			currentLevel: "Beginner",
			guardianName: "Mark Thompson",
			guardianPhone: "+18005550203",
			guardianEmail: "mark.thompson@preptest.com",
		},
		{
			email: "olivia.garcia@preptest.com",
			name: "Olivia Garcia",
			phone: "+18005550104",
			grade: "11",
			gpa: 3.8,
			currentLevel: "Intermediate",
			guardianName: "Rosa Garcia",
			guardianPhone: "+18005550204",
			guardianEmail: "rosa.garcia@preptest.com",
		},
		{
			email: "ethan.wright@preptest.com",
			name: "Ethan Wright",
			phone: "+18005550105",
			grade: "12",
			gpa: 3.5,
			currentLevel: "Intermediate",
			guardianName: "David Wright",
			guardianPhone: "+18005550205",
			guardianEmail: "david.wright@preptest.com",
		},
	];

	const studentUsers = await Promise.all(
		studentDefs.map((s) =>
			prisma.user.upsert({
				where: { email: s.email },
				update: {},
				create: {
					email: s.email,
					name: s.name,
					phone: s.phone,
					password: pw,
					isActive: true,
					isVerified: true,
					roleId: studentRole.id,
				},
			}),
		),
	);

	const students = await Promise.all(
		studentDefs.map((s, i) =>
			prisma.student.upsert({
				where: { userId: studentUsers[i].id },
				update: {},
				create: {
					userId: studentUsers[i].id,
					grade: s.grade,
					class: String.fromCharCode(65 + i), // A, B, C, D, E
					section: "SAT Prep",
					academicStatus: "ACTIVE",
					currentLevel: s.currentLevel,
					gpa: s.gpa,
					guardianName: s.guardianName,
					guardianPhone: s.guardianPhone,
					guardianEmail: s.guardianEmail,
				},
			}),
		),
	);

	logger.info("  ✔ 5 students created");

	// ══════════════════════════════════════════════════════════════════
	// 4.  CATEGORIES
	// ══════════════════════════════════════════════════════════════════
	const [catSAT, catCollege] = await Promise.all([
		prisma.category.upsert({
			where: { name: "SAT Preparation" },
			update: {},
			create: {
				name: "SAT Preparation",
				description: "All SAT test prep courses",
			},
		}),
		prisma.category.upsert({
			where: { name: "College Prep" },
			update: {},
			create: {
				name: "College Prep",
				description: "College application and readiness programs",
			},
		}),
	]);

	logger.info("  ✔ Categories created");

	// ══════════════════════════════════════════════════════════════════
	// 5.  5 LMS COURSES  (Dr. Kaiser Alam)
	// ══════════════════════════════════════════════════════════════════
	const lmsCourseDefs = [
		{
			title: "SAT Math: Complete Mastery",
			slug: "sat-math-complete-mastery-lms",
			shortDescription:
				"The most comprehensive self-paced SAT Math course available. Score 750+ guaranteed.",
			longDescription:
				"Dr. Kaiser Alam's flagship LMS course covers every SAT Math topic in depth: Heart of Algebra, Problem Solving & Data Analysis, Passport to Advanced Math, and Additional Topics. Over 80 video lessons, 500+ practice questions, and 10 full-length practice tests.",
			level: "ADVANCED" as const,
			tags: [
				"SAT Math",
				"Algebra",
				"Advanced Math",
				"Data Analysis",
				"Full Course",
			],
			price: 399,
			requirements: [
				"Basic algebra knowledge",
				"Access to a graphing calculator",
			],
			whatYouLearn: [
				"Solve any Heart of Algebra problem in under 90 seconds",
				"Master all Advanced Math question types",
				"Interpret tables, graphs, and statistics confidently",
				"Score 750+ on SAT Math",
			],
			categoryId: catSAT.id,
		},
		{
			title: "SAT Evidence-Based Reading & Writing",
			slug: "sat-ebrw-mastery-lms",
			shortDescription:
				"Master all Reading and Writing question types with Dr. Kaiser Alam's proven method.",
			longDescription:
				"A comprehensive self-paced course targeting the SAT Evidence-Based Reading and Writing section. Covers command of evidence, words in context, expression of ideas, and standard English conventions through 60 video lessons and annotated passage walkthroughs.",
			level: "INTERMEDIATE" as const,
			tags: ["SAT Reading", "SAT Writing", "Grammar", "Vocabulary", "Passages"],
			price: 349,
			requirements: ["High school English level reading ability"],
			whatYouLearn: [
				"Identify evidence and inference in complex passages",
				"Master all grammar and punctuation rules tested on the SAT",
				"Build a targeted SAT vocabulary",
				"Score 720+ on Evidence-Based Reading & Writing",
			],
			categoryId: catSAT.id,
		},
		{
			title: "Algebra & Pre-Calculus Foundations",
			slug: "algebra-precalculus-foundations-lms",
			shortDescription:
				"Build rock-solid algebra and pre-calculus skills that power your SAT Math score.",
			longDescription:
				"Designed for students who need to strengthen their foundational math before tackling advanced SAT prep. Dr. Kaiser Alam walks through every algebra and pre-calculus concept with crystal-clear explanations and hundreds of practice problems.",
			level: "BEGINNER" as const,
			tags: [
				"Algebra",
				"Pre-Calculus",
				"Foundations",
				"Functions",
				"Trigonometry",
			],
			price: 249,
			requirements: ["Basic arithmetic and fractions"],
			whatYouLearn: [
				"Solve linear, quadratic, and exponential equations fluently",
				"Graph functions and interpret transformations",
				"Master trigonometry basics",
				"Build the math foundation for SAT 700+",
			],
			categoryId: catSAT.id,
		},
		{
			title: "Statistics & Data Analysis for SAT",
			slug: "statistics-data-analysis-sat-lms",
			shortDescription:
				"Turn the most dreaded SAT section into your biggest point-getter.",
			longDescription:
				"Many students lose 50+ points on data analysis questions. This focused LMS course teaches every statistics and data interpretation concept on the SAT: tables, scatterplots, histograms, probability, sampling, and experimental design.",
			level: "INTERMEDIATE" as const,
			tags: [
				"Statistics",
				"Data Analysis",
				"Probability",
				"SAT Math",
				"Graphs",
			],
			price: 199,
			requirements: ["Basic algebra", "SAT Math fundamentals"],
			whatYouLearn: [
				"Read and interpret any SAT data display",
				"Solve all probability and statistics question types",
				"Never lose points on sampling or experimental design questions",
				"Add 60–80 points to your SAT Math score",
			],
			categoryId: catSAT.id,
		},
		{
			title: "Digital SAT Full Prep Program",
			slug: "digital-sat-full-prep-lms",
			shortDescription:
				"The definitive course for the new Digital SAT — adaptive format, new question types, full simulations.",
			longDescription:
				"The Digital SAT is different. This course covers everything new: the adaptive module system, the integrated Desmos calculator, new question formats, and the Bluebook interface. Includes 5 full-length computer-adaptive practice tests and a personalized score improvement roadmap.",
			level: "INTERMEDIATE" as const,
			tags: [
				"Digital SAT",
				"Adaptive Testing",
				"Full Prep",
				"Bluebook",
				"Practice Tests",
			],
			price: 449,
			requirements: [
				"Access to a laptop or tablet",
				"Basic math and reading skills",
			],
			whatYouLearn: [
				"Navigate the Bluebook digital testing platform confidently",
				"Use the built-in Desmos calculator effectively",
				"Understand and beat the adaptive module system",
				"Score 1400+ on the Digital SAT",
			],
			categoryId: catCollege.id,
		},
	];

	const lmsCourses = await Promise.all(
		lmsCourseDefs.map((c) =>
			prisma.course.upsert({
				where: { slug: c.slug },
				update: {},
				create: {
					courseType: "LMS",
					title: c.title,
					slug: c.slug,
					shortDescription: c.shortDescription,
					longDescription: c.longDescription,
					level: c.level,
					tags: c.tags,
					isPublished: true,
					publishedAt: past(30),
					price: c.price,
					discount: 0,
					requirements: c.requirements,
					whatYouLearn: c.whatYouLearn,
					averageRating: 4.5 + Math.random() * 0.5,
					totalReviews: Math.floor(Math.random() * 60) + 10,
					categoryId: c.categoryId,
					teacherId: kaiser.id,
					createdById: kaiserUser.id,
				},
			}),
		),
	);

	logger.info("  ✔ 5 LMS courses created");

	// ══════════════════════════════════════════════════════════════════
	// 6.  5 COACHING COURSES  (Dr. Kaiser Alam)
	// ══════════════════════════════════════════════════════════════════
	const coachingCourseDefs = [
		{
			title: "SAT Math Elite Coaching Program",
			slug: "sat-math-elite-coaching",
			shortDescription:
				"12-week live coaching cohort. Small groups (max 8). Guaranteed 150-point improvement.",
			longDescription:
				"Dr. Kaiser Alam's signature live coaching program. Twice-weekly Jitsi sessions, weekly assignments graded by Dr. Alam personally, module-end exams, and a private Discord community. Limited to 8 students per cohort for maximum personalization.",
			level: "ADVANCED" as const,
			tags: [
				"SAT Math",
				"Live Coaching",
				"Small Group",
				"Elite",
				"Guaranteed Results",
			],
			price: 2400,
			capacity: 8,
			startDate: future(14),
			endDate: future(98),
		},
		{
			title: "Academic Excellence Bootcamp",
			slug: "academic-excellence-bootcamp-coaching",
			shortDescription:
				"8-week intensive multi-subject bootcamp combining SAT prep with academic skill building.",
			longDescription:
				"A holistic academic program that runs alongside school. Covers SAT Math & Reading, time management, study techniques, and academic writing. Students attend 3 live sessions per week and complete structured weekly assignments.",
			level: "INTERMEDIATE" as const,
			tags: [
				"Bootcamp",
				"Multi-Subject",
				"Academic Skills",
				"Study Techniques",
				"Intensive",
			],
			price: 1800,
			capacity: 12,
			startDate: future(7),
			endDate: future(63),
		},
		{
			title: "College Entrance Prep Intensive",
			slug: "college-entrance-prep-intensive-coaching",
			shortDescription:
				"10-week complete college prep: SAT + college essays + application strategy.",
			longDescription:
				"The ultimate senior-year program. Dr. Kaiser Alam guides students through final SAT prep, college essay writing, school selection strategy, and application review. Includes one-on-one essay feedback sessions within the group program.",
			level: "INTERMEDIATE" as const,
			tags: [
				"College Prep",
				"SAT",
				"College Essays",
				"Applications",
				"Senior Year",
			],
			price: 3200,
			capacity: 10,
			startDate: future(21),
			endDate: future(91),
		},
		{
			title: "Advanced Problem Solving Workshop",
			slug: "advanced-problem-solving-workshop-coaching",
			shortDescription:
				"6-week workshop for top students targeting 780–800 on SAT Math.",
			longDescription:
				"Designed for students already scoring 700+ who want to push to a perfect score. Dr. Kaiser Alam's most elite coaching offering — weekly 3-hour deep-dive sessions focusing on the hardest SAT Math problem types, error analysis, and test-taking psychology.",
			level: "ADVANCED" as const,
			tags: [
				"Perfect Score",
				"780+",
				"Advanced",
				"Hard Problems",
				"Error Analysis",
			],
			price: 1600,
			capacity: 6,
			startDate: future(10),
			endDate: future(52),
		},
		{
			title: "Foundation Building Program",
			slug: "foundation-building-program-coaching",
			shortDescription:
				"16-week foundation program for students starting below 500 on SAT Math.",
			longDescription:
				"Dr. Kaiser Alam's most patient and structured program, built for students who need to rebuild from the ground up. Starts with arithmetic and pre-algebra, works through to SAT-level problem solving. Includes parent progress updates every two weeks.",
			level: "BEGINNER" as const,
			tags: [
				"Foundation",
				"Beginners",
				"SAT Math",
				"Parent Updates",
				"Long Term",
			],
			price: 3800,
			capacity: 15,
			startDate: future(3),
			endDate: future(115),
		},
	];

	const coachingCourses = await Promise.all(
		coachingCourseDefs.map((c) =>
			prisma.course.upsert({
				where: { slug: c.slug },
				update: {},
				create: {
					courseType: "COACHING",
					title: c.title,
					slug: c.slug,
					shortDescription: c.shortDescription,
					longDescription: c.longDescription,
					level: c.level,
					tags: c.tags,
					isPublished: true,
					publishedAt: past(10),
					price: c.price,
					discount: 0,
					capacity: c.capacity,
					startDate: c.startDate,
					endDate: c.endDate,
					categoryId: catSAT.id,
					teacherId: kaiser.id,
					createdById: kaiserUser.id,
				},
			}),
		),
	);

	logger.info("  ✔ 5 coaching courses created");

	// ══════════════════════════════════════════════════════════════════
	// 7.  MODULES + LESSONS for each course  (2 modules × 2 lessons)
	// ══════════════════════════════════════════════════════════════════

	// Wipe existing modules so re-runs don't hit the (courseId, orderIndex) unique constraint.
	// Cascades to Lesson → VideoContent / Exam / Assignment / LiveClass.
	await prisma.courseModule.deleteMany({
		where: {
			courseId: { in: [...lmsCourses, ...coachingCourses].map((c) => c.id) },
		},
	});

	// LMS courses: VIDEO_CONTENT + EXAM per module
	for (let ci = 0; ci < lmsCourses.length; ci++) {
		const course = lmsCourses[ci];
		for (let mi = 0; mi < 2; mi++) {
			const mod = await prisma.courseModule.create({
				data: {
					courseId: course.id,
					title: `Module ${mi + 1} — ${mi === 0 ? "Core Concepts" : "Advanced Application"}`,
					description: `Part ${mi + 1} of ${course.title}`,
					orderIndex: mi + 1,
					unlockAtPercent: mi === 0 ? 0 : 0,
					duration: 120 + mi * 60,
				},
			});

			// Lesson 1: Video
			const videoLesson = await prisma.lesson.create({
				data: {
					courseModuleId: mod.id,
					title: `Video ${mi + 1}.1 — ${mi === 0 ? "Introduction & Key Concepts" : "Advanced Techniques & Shortcuts"}`,
					description: `Core video lesson for Module ${mi + 1}`,
					orderIndex: 1,
					lessonType: "VIDEO_CONTENT",
					isPublished: true,
					publishedAt: past(20),
				},
			});

			await prisma.videoContent.create({
				data: {
					lessonId: videoLesson.id,
					title: videoLesson.title,
					status: "ready",
					masterPlaylistUrl: `https://cdn.prepexcellence.com/videos/${slug(course.title)}/mod${mi + 1}/master.m3u8`,
					thumbnailUrl: `https://cdn.prepexcellence.com/thumbs/${slug(course.title)}-mod${mi + 1}.jpg`,
					duration: 1800 + mi * 600, // 30–40 min
					width: 1920,
					height: 1080,
					codec: "h264",
					bitrate: 2500000,
					fps: 30,
					fileSize: 450000000 + mi * 100000000,
					processedAt: past(20),
				},
			});

			// Lesson 2: Exam
			const examLesson = await prisma.lesson.create({
				data: {
					courseModuleId: mod.id,
					title: `Quiz ${mi + 1}.2 — Module ${mi + 1} Assessment`,
					description: `Knowledge check for Module ${mi + 1}`,
					orderIndex: 2,
					lessonType: "EXAM",
					isPublished: true,
					publishedAt: past(20),
				},
			});

			const exam = await prisma.exam.create({
				data: {
					lessonId: examLesson.id,
					title: `Module ${mi + 1} Quiz`,
					description: "Test your understanding before moving on.",
					passingScore: 70,
					timeLimit: 15,
					maxAttempts: 3,
					shuffleQuestions: true,
					showResults: true,
				},
			});

			// Add 3 questions per exam
			for (let qi = 0; qi < 3; qi++) {
				await prisma.examQuestion.create({
					data: {
						examId: exam.id,
						question: `Sample question ${qi + 1} for Module ${mi + 1} of ${course.title}?`,
						type: "MCQ_SINGLE",
						orderIndex: qi + 1,
						points: 2,
						options: {
							create: [
								{
									text: "Option A — Correct Answer",
									isCorrect: true,
									orderIndex: 1,
								},
								{
									text: "Option B — Incorrect",
									isCorrect: false,
									orderIndex: 2,
								},
								{
									text: "Option C — Incorrect",
									isCorrect: false,
									orderIndex: 3,
								},
								{
									text: "Option D — Incorrect",
									isCorrect: false,
									orderIndex: 4,
								},
							],
						},
					},
				});
			}
		}
	}

	logger.info("  ✔ LMS course modules, lessons, videos, and exams created");

	// Coaching courses: LIVE_CLASS + ASSIGNMENT per module
	for (let ci = 0; ci < coachingCourses.length; ci++) {
		const course = coachingCourses[ci];
		for (let mi = 0; mi < 2; mi++) {
			const mod = await prisma.courseModule.create({
				data: {
					courseId: course.id,
					title: `Module ${mi + 1} — ${mi === 0 ? "Fundamentals" : "Advanced Practice"}`,
					description: `Module ${mi + 1} of ${course.title}`,
					orderIndex: mi + 1,
					unlockAtPercent: mi === 0 ? 0 : 50,
					teacherId: kaiser.id,
				},
			});

			// Lesson 1: Live Class
			const liveLesson = await prisma.lesson.create({
				data: {
					courseModuleId: mod.id,
					title: `Live Session ${mi + 1}.1 — ${mi === 0 ? "Kickoff & Core Strategy" : "Deep Dive & Problem Sets"}`,
					description: `Live Jitsi session for Module ${mi + 1}`,
					orderIndex: 1,
					lessonType: "LIVE_CLASS",
					isPublished: true,
					publishedAt: past(5),
				},
			});

			await prisma.liveClass.create({
				data: {
					lessonId: liveLesson.id,
					teacherId: kaiser.id,
					provider: "JITSI",
					status: mi === 0 ? "SCHEDULED" : "DRAFT",
					meetingId: `kaiser-${slug(course.title)}-m${mi + 1}`,
					meetingUrl: `https://meet.jit.si/kaiser-${slug(course.title)}-m${mi + 1}`,
					hostUrl: `https://meet.jit.si/kaiser-${slug(course.title)}-m${mi + 1}#userInfo.displayName=Dr.%20Kaiser%20Alam`,
					scheduledStartAt: future(14 + mi * 7),
					scheduledEndAt: new Date(
						future(14 + mi * 7).getTime() + 90 * 60 * 1000,
					),
					durationMinutes: 90,
					maxParticipants: coachingCourseDefs[ci].capacity,
					isRecorded: true,
				},
			});

			// Lesson 2: Assignment
			const assignLesson = await prisma.lesson.create({
				data: {
					courseModuleId: mod.id,
					title: `Assignment ${mi + 1}.2 — ${mi === 0 ? "Practice Problem Set" : "Challenge Problems"}`,
					description: `Graded assignment for Module ${mi + 1}`,
					orderIndex: 2,
					lessonType: "ASSIGNMENT",
					isPublished: true,
					publishedAt: past(5),
				},
			});

			await prisma.assignment.create({
				data: {
					lessonId: assignLesson.id,
					title: `Module ${mi + 1} ${mi === 0 ? "Foundation" : "Advanced"} Assignment`,
					description: `${mi === 0 ? "20-question" : "15-question"} problem set for Module ${mi + 1}`,
					instructions:
						"Work through each problem showing all steps. Submit as typed text. Late submissions accepted with a 10% penalty.",
					totalPoints: 100,
					dueDate: future(21 + mi * 7),
					allowLateSubmission: true,
					lateSubmissionPenalty: 10,
				},
			});
		}
	}

	logger.info(
		"  ✔ Coaching course modules, lessons, live classes, and assignments created",
	);

	// ══════════════════════════════════════════════════════════════════
	// 8.  ENROLLMENTS  (all 5 students in first 3 LMS + first 2 coaching)
	// ══════════════════════════════════════════════════════════════════
	for (const student of students) {
		for (const course of lmsCourses.slice(0, 3)) {
			await prisma.enrollment.upsert({
				where: {
					courseId_studentId: { courseId: course.id, studentId: student.id },
				},
				update: {},
				create: {
					courseId: course.id,
					studentId: student.id,
					status: "ACTIVE",
				},
			});
		}
		for (const course of coachingCourses.slice(0, 2)) {
			await prisma.enrollment.upsert({
				where: {
					courseId_studentId: { courseId: course.id, studentId: student.id },
				},
				update: {},
				create: {
					courseId: course.id,
					studentId: student.id,
					status: "ACTIVE",
				},
			});
		}
	}

	logger.info("  ✔ Enrollments created");

	// ══════════════════════════════════════════════════════════════════
	// 9.  DR. KAISER ALAM — ONE-TO-ONE AVAILABILITIES
	// ══════════════════════════════════════════════════════════════════

	// Wipe existing sessions + availabilities for Kaiser so re-runs are clean.
	await prisma.oneToOneSession.deleteMany({
		where: { teacherAvailability: { profileId: kaiserProfile.id } },
	});
	await prisma.teacherAvailability.deleteMany({
		where: { profileId: kaiserProfile.id },
	});

	const sessionSlots = [
		{ date: past(10), hour: 10, status: "COMPLETED" as const, isBooked: true },
		{ date: past(5), hour: 14, status: "COMPLETED" as const, isBooked: true },
		{ date: future(3), hour: 10, status: "SCHEDULED" as const, isBooked: true },
		{ date: future(6), hour: 15, status: "SCHEDULED" as const, isBooked: true },
		{ date: future(9), hour: 11, status: "SCHEDULED" as const, isBooked: true },
	];

	const availabilities = await Promise.all(
		sessionSlots.map((slot, _i) => {
			const start = atHour(slot.date, slot.hour);
			const end = new Date(start.getTime() + 60 * 60 * 1000);
			return prisma.teacherAvailability.create({
				data: {
					profileId: kaiserProfile.id,
					availabilityType: "ONLINE",
					category: "AVAILABLE",
					sessionDuration: 60,
					hourlyRate: 120,
					title: "SAT Math One-to-One Session",
					specificDate: slot.date,
					specificStartTime: start,
					specificEndTime: end,
					isBooked: slot.isBooked,
				},
			});
		}),
	);

	logger.info("  ✔ Kaiser Alam availabilities created");

	// ══════════════════════════════════════════════════════════════════
	// 10. 5 ONE-TO-ONE SESSIONS  (Kaiser Alam ↔ each student)
	// ══════════════════════════════════════════════════════════════════
	const sessionDefs = [
		{
			student: students[0],
			avail: availabilities[0],
			status: "COMPLETED" as const,
			scheduledAt: atHour(past(10), 10),
			actualDuration: 62,
			topic: "Heart of Algebra — Linear equations and word problems",
			notes:
				"I need help with rate/distance/time problems and interpreting slope.",
		},
		{
			student: students[1],
			avail: availabilities[1],
			status: "COMPLETED" as const,
			scheduledAt: atHour(past(5), 14),
			actualDuration: 58,
			topic: "Problem Solving & Data Analysis — Statistics and probability",
			notes: "Struggling with scatterplot questions and sampling bias.",
		},
		{
			student: students[2],
			avail: availabilities[2],
			status: "SCHEDULED" as const,
			scheduledAt: atHour(future(3), 10),
			actualDuration: null,
			topic: "Foundation Review — Arithmetic and basic algebra",
			notes:
				"Need to review fractions, percentages, and linear equations from scratch.",
		},
		{
			student: students[3],
			avail: availabilities[3],
			status: "SCHEDULED" as const,
			scheduledAt: atHour(future(6), 15),
			actualDuration: null,
			topic: "Passport to Advanced Math — Quadratics and functions",
			notes:
				"Want to master quadratic formula, vertex form, and function transformations.",
		},
		{
			student: students[4],
			avail: availabilities[4],
			status: "SCHEDULED" as const,
			scheduledAt: atHour(future(9), 11),
			actualDuration: null,
			topic: "Test Strategy & Timing — Section management and pacing",
			notes:
				"Always running out of time. Need a reliable section-by-section pacing strategy.",
		},
	];

	const createdSessions = await Promise.all(
		sessionDefs.map((s, i) =>
			prisma.oneToOneSession.create({
				data: {
					teacherAvailabilityId: s.avail.id,
					studentId: s.student.id,
					status: s.status,
					scheduledAt: s.scheduledAt,
					duration: 60,
					timezone: "America/New_York",
					topic: s.topic,
					notes: s.notes,
					jitsiRoomId: `kaiser-session-${i + 1}-${Date.now()}`,
					jitsiRoomToken: `eyJhbGciOiJIUzI1NiJ9.kaiser_session_${i + 1}`,
					jitsiStartUrl: `https://meet.jit.si/kaiser-session-${i + 1}`,
					...(s.status === "COMPLETED"
						? {
								actualStartTime: s.scheduledAt,
								actualEndTime: new Date(
									s.scheduledAt.getTime() +
										(s.actualDuration ?? 60) * 60 * 1000,
								),
								actualDuration: s.actualDuration ?? 60,
							}
						: {}),
				},
			}),
		),
	);

	logger.info("  ✔ 5 OneToOne sessions created");

	// ══════════════════════════════════════════════════════════════════
	// 11. SESSION RECORDINGS (for completed sessions)
	// ══════════════════════════════════════════════════════════════════
	for (let i = 0; i < 2; i++) {
		const session = createdSessions[i];
		await prisma.sessionRecording.create({
			data: {
				sessionId: session.id,
				status: "ready",
				masterPlaylistUrl: `https://cdn.prepexcellence.com/recordings/${session.jitsiRoomId}/master.m3u8`,
				thumbnailUrl: `https://cdn.prepexcellence.com/recordings/${session.jitsiRoomId}/thumb.jpg`,
				duration: (sessionDefs[i].actualDuration ?? 60) * 60,
				fileSize: 900000000 + i * 50000000,
				isDownloadEnabled: true,
				downloadCount: i + 1,
				expiresAt: future(7 - (10 - i * 5)), // expires based on session date
			},
		});
	}

	logger.info("  ✔ Session recordings created");

	// ══════════════════════════════════════════════════════════════════
	// 12. ONE-TO-ONE REVIEWS (for completed sessions)
	// ══════════════════════════════════════════════════════════════════
	const reviewData = [
		{
			rating: 5,
			comment:
				"Dr. Alam is truly exceptional. In one session he completely changed how I approach word problems. I went from dreading rate problems to actually enjoying them. His energy and patience are unmatched.",
			response:
				"Thank you Aiden! Your growth mindset made all the difference. Keep practicing those rate problems — you are closer to that 750 than you think!",
		},
		{
			rating: 5,
			comment:
				"The best 60 minutes I have ever spent studying. Dr. Alam identified exactly what was holding my stats score back and gave me a three-step framework I can apply to every scatterplot question. Booked my next session immediately.",
			response:
				"Sophia, your analytical instincts are razor-sharp. The framework will serve you well. Looking forward to our next session — bring those practice test errors!",
		},
	];

	for (let i = 0; i < 2; i++) {
		await prisma.oneToOneReview.create({
			data: {
				sessionId: createdSessions[i].id,
				teacherProfileId: kaiserProfile.id,
				studentId: sessionDefs[i].student.id,
				rating: reviewData[i].rating,
				comment: reviewData[i].comment,
				isPublic: true,
				response: reviewData[i].response,
				respondedAt: past(
					sessionDefs[i].status === "COMPLETED" ? 9 - i * 4 : 0,
				),
			},
		});
	}

	logger.info("  ✔ OneToOne reviews created");

	// ══════════════════════════════════════════════════════════════════
	// 13. BLOG CATEGORIES + 5 BLOGS (Dr. Kaiser Alam)
	// ══════════════════════════════════════════════════════════════════
	const [blogCatSAT, blogCatStrategy, blogCatCollege] = await Promise.all([
		prisma.blogCategory.upsert({
			where: { name: "SAT Tips & Tricks" },
			update: {},
			create: { name: "SAT Tips & Tricks", slug: "sat-tips-tricks" },
		}),
		prisma.blogCategory.upsert({
			where: { name: "Study Strategy" },
			update: {},
			create: { name: "Study Strategy", slug: "study-strategy" },
		}),
		prisma.blogCategory.upsert({
			where: { name: "College Prep" },
			update: {},
			create: { name: "College Prep", slug: "college-prep" },
		}),
	]);

	const blogDefs = [
		{
			title: "10 Proven Strategies to Score 800 on SAT Math",
			slug: "10-proven-strategies-score-800-sat-math",
			image: "https://cdn.prepexcellence.com/blog/sat-math-800.jpg",
			description: `
# 10 Proven Strategies to Score 800 on SAT Math

After 15 years and thousands of students, I have identified the exact habits and strategies that separate 780–800 scorers from everyone else. Here are the ten that matter most.

## 1. Never Skip a Step on Paper
Even if you can solve a problem mentally, write every step. The SAT is designed to catch mental shortcuts.

## 2. Master the Calculator — but Don't Depend on It
Know when the calculator slows you down. For linear equations and simple algebra, working by hand is almost always faster.

## 3. Read Every Answer Choice Before Selecting
On multiple-choice math, wrong answers are engineered to trap you. Always read all four choices.

## 4. Plug In Numbers for Abstract Problems
When a question uses variables, substitute real numbers. It turns an abstract question into an arithmetic problem.

## 5. Know Your Quadratic Forms Cold
Standard form, vertex form, and factored form. You need to move between them instantly.

## 6. Learn the 7 Most Common SAT Word Problem Setups
Rate/distance/time, mixture, work/rate, percent change, geometric modeling, statistics, and linear growth.

## 7. Practice Data Analysis Last
Most students lose the most points here. Dedicate dedicated practice to tables, scatterplots, and experimental design questions.

## 8. Time Yourself on Every Practice Session
Never practice without a timer. SAT Math is as much a timing test as a math test.

## 9. Review Every Missed Problem Twice
Once to find the error, once to redo it from scratch 24 hours later.

## 10. Simulate Test Conditions Weekly
One full-length math section, timed, with the calculator on/off as specified. No exceptions.

With these 10 strategies applied consistently over 8–12 weeks, a 750+ score is within reach for almost any motivated student.
      `.trim(),
			categoryId: blogCatSAT.id,
			tags: ["SAT Math", "800 Score", "Strategy", "Tips", "Perfect Score"],
		},
		{
			title: "How to Approach SAT Evidence-Based Reading Passages",
			slug: "how-to-approach-sat-evidence-based-reading-passages",
			image: "https://cdn.prepexcellence.com/blog/sat-reading-passages.jpg",
			description: `
# How to Approach SAT Evidence-Based Reading Passages

The SAT Reading section intimidates students not because the questions are hard — but because most students don't have a consistent approach. Here is the exact method I teach in every coaching session.

## The Three-Pass System

**Pass 1 — Skim for Structure (90 seconds)**
Identify: What type of passage is this? (Literary, Historical, Science, Social Science) What is the author's main point? Where does the argument shift?

**Pass 2 — Read Actively**
Underline claims. Circle evidence. Put a "?" next to anything confusing. You are building a mental map, not memorizing.

**Pass 3 — Answer Questions**
Start with specific line-reference questions. Finish with main purpose/central claim questions.

## The Evidence Chain Rule
Every SAT Reading answer can be traced to specific lines in the passage. If you cannot point to the words that support your answer, it is wrong.

## Paired Passage Tip
Read Passage 1 → answer Passage 1 questions → Read Passage 2 → answer Passage 2 questions → answer relationship questions last.

## Common Traps
- **Too extreme answers**: Watch for "always", "never", "only". The SAT prefers nuance.
- **True but unrelated**: An answer can be factually accurate but not supported by the passage.
- **Paraphrase traps**: Wrong answers often use synonyms of correct words to sound right.

Consistency is everything. Apply this system to every practice passage and your score will improve within two weeks.
      `.trim(),
			categoryId: blogCatSAT.id,
			tags: [
				"SAT Reading",
				"Passages",
				"Evidence",
				"Strategy",
				"Comprehension",
			],
		},
		{
			title: "Building a 12-Week SAT Study Plan That Actually Works",
			slug: "building-12-week-sat-study-plan",
			image: "https://cdn.prepexcellence.com/blog/12-week-study-plan.jpg",
			description: `
# Building a 12-Week SAT Study Plan That Actually Works

Most SAT study plans fail because they are too vague ("study math three times a week") or too rigid (they fall apart the moment life intervenes). Here is how to build one that lasts.

## Week 1–2: Diagnostic Phase
Take one full official practice test under real conditions. Score it. Build a personal error log sorted by question type.

## Week 3–5: Foundation Building
Address your lowest-scoring categories first. Use targeted lessons and practice sets — not full tests. Review every mistake the same day.

## Week 6–8: Skill Development
Move to section-level practice (one full Math section, one full Reading & Writing section per day). Maintain your error log.

## Week 9–10: Full Test Practice
Two full timed tests. Score them immediately. Your focus shifts from "learning new skills" to "executing skills under pressure".

## Week 11: Mixed Drills & Weak Spots
Return to your error log. If the same mistake types are still appearing, run a targeted 3-day blitz on them.

## Week 12: Confidence & Logistics
One final practice test on Wednesday. Light review Thursday. Rest Friday. Test Saturday.

## Keys to Success
- **Log every mistake** — not just wrong answers, but almost-wrong answers too.
- **Review before you practice** — spend 15 minutes reviewing yesterday's errors before starting new practice.
- **Protect your weekends** — do your heaviest practice during the week. Rest on test day.

Follow this framework and you will walk into the test room having done exactly what you need to do.
      `.trim(),
			categoryId: blogCatStrategy.id,
			tags: ["Study Plan", "12 Weeks", "SAT Prep", "Planning", "Schedule"],
		},
		{
			title: "The Digital SAT: Everything You Need to Know in 2025",
			slug: "digital-sat-everything-you-need-to-know-2025",
			image: "https://cdn.prepexcellence.com/blog/digital-sat-2025.jpg",
			description: `
# The Digital SAT: Everything You Need to Know in 2025

The SAT went fully digital in 2024. If you are preparing now, here is exactly what changed, what stayed the same, and what you need to focus on.

## What Changed

**Format**
- 2 modules per section (Reading & Writing, then Math)
- Module 2 difficulty adapts based on Module 1 performance
- Total test time: ~2 hours 14 minutes (down from 3 hours)

**Technology**
- Bluebook app (official College Board testing platform)
- Built-in Desmos graphing calculator for all Math questions
- Cross-off tool, mark-for-review, and annotation tools built in

**Question Types**
- Reading & Writing questions are now shorter (single passages vs. long multi-passage)
- Math section has more word problems embedded in real-world contexts

## What Stayed the Same
- Scoring scale: 400–1600
- Question types (MCQ and Student-Produced Response)
- Content tested (same math standards, same reading/writing skills)

## Key Strategies for Digital SAT

**Master the Desmos Calculator**
Many students underuse it. Practice solving quadratics, systems, and graphing functions in Desmos before test day.

**Understand the Adaptive System**
If Module 1 goes well, Module 2 will be harder — and the max possible score goes up. Do not slow down trying to be perfect in Module 1.

**Practice in Bluebook**
Your scores on paper tests will not reflect digital performance. Do at least 3 full tests in the Bluebook app.

The Digital SAT is different enough that preparation strategy must change. Students who adapt early have a significant advantage.
      `.trim(),
			categoryId: blogCatSAT.id,
			tags: ["Digital SAT", "2025", "Bluebook", "Adaptive Testing", "Format"],
		},
		{
			title: "How to Choose the Right SAT Prep Program for Your Student",
			slug: "how-to-choose-right-sat-prep-program",
			image: "https://cdn.prepexcellence.com/blog/choose-sat-prep-program.jpg",
			description: `
# How to Choose the Right SAT Prep Program for Your Student

With dozens of SAT prep options available — from $15 books to $5,000 coaching packages — how do you know what is right for your student? Here is the honest framework I give every parent who asks.

## Step 1: Diagnose Before You Invest
Take one full official practice test first. Without a baseline score, you are buying blindly.

## Step 2: Match the Program to the Gap

**Self-paced LMS courses** work best for:
- Students who are disciplined and self-motivated
- Targeting a 50–100 point improvement
- Budget-conscious families

**Live group coaching** works best for:
- Students who need accountability and live interaction
- Targeting a 100–200 point improvement
- Students who learn best through discussion

**One-to-One tutoring** works best for:
- Students with specific, persistent weaknesses
- Students targeting 750+ in a particular section
- Students who have tried group prep and plateaued

## Step 3: Evaluate the Instructor
The program matters less than the person teaching it. Look for:
- Verified score history or industry certification
- A clear, repeatable methodology
- References from parents or students with similar starting scores

## Step 4: Commit to the Timeline
No program works in two weeks. Minimum 8 weeks for meaningful score improvement. 12 weeks is the sweet spot.

## What to Avoid
- Programs that guarantee a specific score without a baseline assessment
- Tutors who have no teaching methodology beyond "working through practice tests"
- Any program that does not include regular progress tracking

Choosing the right program is one of the highest-leverage decisions a family makes in the college prep process. Take the time to do it well.
      `.trim(),
			categoryId: blogCatCollege.id,
			tags: [
				"SAT Prep",
				"Parents",
				"Choosing Programs",
				"Tutoring",
				"College Prep",
			],
		},
	];

	for (const b of blogDefs) {
		await prisma.blog.upsert({
			where: { slug: b.slug },
			update: {},
			create: {
				title: b.title,
				slug: b.slug,
				image: b.image,
				description: b.description,
				status: "PUBLISHED",
				publishedAt: past(Math.floor(Math.random() * 20) + 1),
				tags: b.tags,
				categoryId: b.categoryId,
				authorId: kaiserUser.id,
			},
		});
	}

	logger.info("  ✔ Blog categories and 5 blogs created");

	// ══════════════════════════════════════════════════════════════════
	// 14. COURSE REVIEWS  (students reviewing LMS courses)
	// ══════════════════════════════════════════════════════════════════
	const reviewTexts = [
		"Dr. Alam's explanations are unlike anything I found on YouTube. My practice test score jumped 120 points after completing this course.",
		"The video quality is excellent and the pacing is perfect. I especially loved the end-of-module quizzes — they caught gaps I didn't know I had.",
		"Comprehensive and well-organized. Dr. Alam has a gift for making hard concepts feel obvious in hindsight.",
		"Worth every penny. The course structure is logical and builds confidence step by step.",
		"I went from a 640 to a 760 after working through this material. The practice questions are remarkably similar to real SAT questions.",
	];

	for (let si = 0; si < students.length; si++) {
		await prisma.review.upsert({
			where: {
				courseId_studentId: {
					courseId: lmsCourses[0].id,
					studentId: students[si].id,
				},
			},
			update: {},
			create: {
				courseId: lmsCourses[0].id,
				studentId: students[si].id,
				rating: 4 + (si % 2),
				comment: reviewTexts[si],
			},
		});
	}

	logger.info("  ✔ Course reviews created");

	// ══════════════════════════════════════════════════════════════════
	// 15. SAT PRACTICE — TestTypes, Subjects, Domains, Skills, Questions, Tests
	// ══════════════════════════════════════════════════════════════════

	// Test Types
	const satTestType = await prisma.testType.upsert({
		where: { id: "seed-testtype-sat" },
		update: {},
		create: {
			id: "seed-testtype-sat",
			name: "SAT",
			description: "College Board Digital SAT",
			order: 1,
		},
	});
	const psat10TestType = await prisma.testType.upsert({
		where: { id: "seed-testtype-psat10" },
		update: {},
		create: {
			id: "seed-testtype-psat10",
			name: "PSAT 10",
			description: "Preliminary SAT for 10th graders",
			order: 2,
		},
	});
	logger.info("  ✔ Test types created");

	// Subjects
	const mathSubject = await prisma.subject.upsert({
		where: { id: "seed-subject-math" },
		update: {},
		create: {
			id: "seed-subject-math",
			name: "Math",
			description: "Mathematics section of the SAT",
			order: 1,
			testType: {
				connect: [{ id: satTestType.id }, { id: psat10TestType.id }],
			},
		},
	});
	const rwSubject = await prisma.subject.upsert({
		where: { id: "seed-subject-rw" },
		update: {},
		create: {
			id: "seed-subject-rw",
			name: "Reading & Writing",
			description: "Evidence-based reading and writing",
			order: 2,
			testType: {
				connect: [{ id: satTestType.id }, { id: psat10TestType.id }],
			},
		},
	});
	logger.info("  ✔ Subjects created");

	// Domains
	const algebraDomain = await prisma.domain.upsert({
		where: { id: "seed-domain-algebra" },
		update: {},
		create: {
			id: "seed-domain-algebra",
			name: "Algebra",
			description: "Linear equations, functions, and systems",
			order: 1,
			domain: { connect: [{ id: mathSubject.id }] },
		},
	});
	const advMathDomain = await prisma.domain.upsert({
		where: { id: "seed-domain-advmath" },
		update: {},
		create: {
			id: "seed-domain-advmath",
			name: "Advanced Math",
			description: "Quadratics, polynomials, and exponential functions",
			order: 2,
			domain: { connect: [{ id: mathSubject.id }] },
		},
	});
	const dataAnalysisDomain = await prisma.domain.upsert({
		where: { id: "seed-domain-data" },
		update: {},
		create: {
			id: "seed-domain-data",
			name: "Problem Solving & Data Analysis",
			description: "Ratios, statistics, and data interpretation",
			order: 3,
			domain: { connect: [{ id: mathSubject.id }] },
		},
	});
	const craftStructureDomain = await prisma.domain.upsert({
		where: { id: "seed-domain-craft" },
		update: {},
		create: {
			id: "seed-domain-craft",
			name: "Craft & Structure",
			description: "Vocabulary, text structure, and author's purpose",
			order: 1,
			domain: { connect: [{ id: rwSubject.id }] },
		},
	});
	const infoIdeasDomain = await prisma.domain.upsert({
		where: { id: "seed-domain-info" },
		update: {},
		create: {
			id: "seed-domain-info",
			name: "Information & Ideas",
			description: "Reading comprehension and evidence-based analysis",
			order: 2,
			domain: { connect: [{ id: rwSubject.id }] },
		},
	});
	logger.info("  ✔ Domains created");

	// Skills
	const linearEqSkill = await prisma.skill.upsert({
		where: { id: "seed-skill-lineareq" },
		update: {},
		create: {
			id: "seed-skill-lineareq",
			name: "Linear Equations in One Variable",
			description: "Solve and interpret linear equations",
			order: 1,
			domain: { connect: [{ id: algebraDomain.id }] },
		},
	});
	const systemsSkill = await prisma.skill.upsert({
		where: { id: "seed-skill-systems" },
		update: {},
		create: {
			id: "seed-skill-systems",
			name: "Systems of Linear Equations",
			description: "Solve systems with two variables",
			order: 2,
			domain: { connect: [{ id: algebraDomain.id }] },
		},
	});
	const quadraticsSkill = await prisma.skill.upsert({
		where: { id: "seed-skill-quadratics" },
		update: {},
		create: {
			id: "seed-skill-quadratics",
			name: "Quadratic Equations",
			description: "Factor, solve, and analyze quadratics",
			order: 1,
			domain: { connect: [{ id: advMathDomain.id }] },
		},
	});
	const ratiosSkill = await prisma.skill.upsert({
		where: { id: "seed-skill-ratios" },
		update: {},
		create: {
			id: "seed-skill-ratios",
			name: "Ratios, Rates & Proportional Reasoning",
			description: "Apply ratio and proportion concepts",
			order: 1,
			domain: { connect: [{ id: dataAnalysisDomain.id }] },
		},
	});
	const vocabularySkill = await prisma.skill.upsert({
		where: { id: "seed-skill-vocab" },
		update: {},
		create: {
			id: "seed-skill-vocab",
			name: "Words in Context",
			description: "Determine meaning from context",
			order: 1,
			domain: { connect: [{ id: craftStructureDomain.id }] },
		},
	});
	const evidenceSkill = await prisma.skill.upsert({
		where: { id: "seed-skill-evidence" },
		update: {},
		create: {
			id: "seed-skill-evidence",
			name: "Command of Evidence",
			description: "Identify and use textual evidence",
			order: 1,
			domain: { connect: [{ id: infoIdeasDomain.id }] },
		},
	});
	logger.info("  ✔ Skills created");

	// Questions — Math (Algebra/Linear)
	const mathQDefs = [
		{
			id: "seed-q-math-1",
			content: "If 3x + 7 = 22, what is the value of x?",
			answerDescription:
				"Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5.",
			difficulty: "EASY" as const,
			testTypeId: satTestType.id,
			subjectId: mathSubject.id,
			domainId: algebraDomain.id,
			skillId: linearEqSkill.id,
			options: [
				{ content: "3", isCorrect: false },
				{ content: "5", isCorrect: true },
				{ content: "7", isCorrect: false },
				{ content: "9", isCorrect: false },
			],
		},
		{
			id: "seed-q-math-2",
			content:
				"A line passes through (0, 4) and (2, 10). What is the slope of the line?",
			answerDescription: "Slope = (10 - 4) / (2 - 0) = 6 / 2 = 3.",
			difficulty: "EASY" as const,
			testTypeId: satTestType.id,
			subjectId: mathSubject.id,
			domainId: algebraDomain.id,
			skillId: linearEqSkill.id,
			options: [
				{ content: "2", isCorrect: false },
				{ content: "3", isCorrect: true },
				{ content: "4", isCorrect: false },
				{ content: "6", isCorrect: false },
			],
		},
		{
			id: "seed-q-math-3",
			content:
				"Solve for x and y: x + y = 10 and x − y = 4. What is the value of x?",
			answerDescription: "Adding both equations: 2x = 14, so x = 7.",
			difficulty: "MEDIUM" as const,
			testTypeId: satTestType.id,
			subjectId: mathSubject.id,
			domainId: algebraDomain.id,
			skillId: systemsSkill.id,
			options: [
				{ content: "3", isCorrect: false },
				{ content: "5", isCorrect: false },
				{ content: "7", isCorrect: true },
				{ content: "9", isCorrect: false },
			],
		},
		{
			id: "seed-q-math-4",
			content: "Which of the following is a factor of x² − 5x + 6?",
			answerDescription:
				"x² − 5x + 6 = (x − 2)(x − 3). So (x − 2) is a factor.",
			difficulty: "MEDIUM" as const,
			testTypeId: satTestType.id,
			subjectId: mathSubject.id,
			domainId: advMathDomain.id,
			skillId: quadraticsSkill.id,
			options: [
				{ content: "(x + 2)", isCorrect: false },
				{ content: "(x − 2)", isCorrect: true },
				{ content: "(x + 3)", isCorrect: false },
				{ content: "(x − 1)", isCorrect: false },
			],
		},
		{
			id: "seed-q-math-5",
			content:
				"A store sells apples at $1.20 each and oranges at $0.80 each. If Maria buys 5 apples and some oranges and spends exactly $10, how many oranges does she buy?",
			answerDescription:
				"5 apples = $6.00. Remaining = $4.00. $4.00 ÷ $0.80 = 5 oranges.",
			difficulty: "MEDIUM" as const,
			testTypeId: satTestType.id,
			subjectId: mathSubject.id,
			domainId: dataAnalysisDomain.id,
			skillId: ratiosSkill.id,
			options: [
				{ content: "4", isCorrect: false },
				{ content: "5", isCorrect: true },
				{ content: "6", isCorrect: false },
				{ content: "8", isCorrect: false },
			],
		},
		{
			id: "seed-q-math-6",
			content:
				"The equation y = 2x² − 8x + 6 has a minimum value. At what value of x does the minimum occur?",
			answerDescription:
				"For y = ax² + bx + c, minimum is at x = −b/(2a) = −(−8)/(2·2) = 8/4 = 2.",
			difficulty: "HARD" as const,
			testTypeId: satTestType.id,
			subjectId: mathSubject.id,
			domainId: advMathDomain.id,
			skillId: quadraticsSkill.id,
			options: [
				{ content: "1", isCorrect: false },
				{ content: "2", isCorrect: true },
				{ content: "3", isCorrect: false },
				{ content: "4", isCorrect: false },
			],
		},
	];

	// Questions — Reading & Writing
	const rwQDefs = [
		{
			id: "seed-q-rw-1",
			content:
				'In the following sentence, what does the word "meticulous" most nearly mean?\n\n"The scientist was meticulous in recording her observations, noting every detail no matter how small."',
			answerDescription:
				'"Meticulous" means very careful and precise. Context clues: "noting every detail no matter how small."',
			difficulty: "EASY" as const,
			testTypeId: satTestType.id,
			subjectId: rwSubject.id,
			domainId: craftStructureDomain.id,
			skillId: vocabularySkill.id,
			options: [
				{ content: "Careless", isCorrect: false },
				{ content: "Thorough and precise", isCorrect: true },
				{ content: "Rushed", isCorrect: false },
				{ content: "Confused", isCorrect: false },
			],
		},
		{
			id: "seed-q-rw-2",
			content:
				'The passage states: "By 1900, more than 40% of Americans lived in cities, compared with just 6% in 1800." Which claim is best supported by this data?',
			answerDescription:
				"The data shows a dramatic increase in urban population, supporting urbanization as the major 19th-century demographic shift.",
			difficulty: "EASY" as const,
			testTypeId: satTestType.id,
			subjectId: rwSubject.id,
			domainId: infoIdeasDomain.id,
			skillId: evidenceSkill.id,
			options: [
				{
					content: "Rural life became more popular during the 19th century",
					isCorrect: false,
				},
				{
					content:
						"American urbanization accelerated dramatically during the 19th century",
					isCorrect: true,
				},
				{
					content: "The total US population declined between 1800 and 1900",
					isCorrect: false,
				},
				{
					content: "Cities were more common in 1800 than in 1900",
					isCorrect: false,
				},
			],
		},
		{
			id: "seed-q-rw-3",
			content:
				'Choose the word that best completes the sentence:\n\n"Although the treaty was signed, tensions between the two nations _______ for decades."',
			answerDescription:
				'"Persisted" correctly indicates the tensions continued after the treaty. "Resolved" is opposite; "intensified" is possible but too strong for "although."',
			difficulty: "MEDIUM" as const,
			testTypeId: satTestType.id,
			subjectId: rwSubject.id,
			domainId: craftStructureDomain.id,
			skillId: vocabularySkill.id,
			options: [
				{ content: "resolved", isCorrect: false },
				{ content: "persisted", isCorrect: true },
				{ content: "multiplied", isCorrect: false },
				{ content: "vanished", isCorrect: false },
			],
		},
		{
			id: "seed-q-rw-4",
			content:
				"A student argues that renewable energy sources are already sufficient to replace fossil fuels. Which of the following, if true, most weakens this argument?",
			answerDescription:
				"Evidence that storage limitations prevent reliable 24/7 supply directly contradicts the claim of sufficiency.",
			difficulty: "HARD" as const,
			testTypeId: satTestType.id,
			subjectId: rwSubject.id,
			domainId: infoIdeasDomain.id,
			skillId: evidenceSkill.id,
			options: [
				{
					content: "Solar panel costs have fallen by 90% in the last decade",
					isCorrect: false,
				},
				{
					content: "Wind energy can supply power even on cloudy days",
					isCorrect: false,
				},
				{
					content:
						"Battery storage technology cannot yet provide reliable power during periods of low wind and sun",
					isCorrect: true,
				},
				{
					content:
						"Many countries have already committed to net-zero carbon targets",
					isCorrect: false,
				},
			],
		},
	];

	// Create all questions
	const allQDefs = [...mathQDefs, ...rwQDefs];
	const createdQuestions: Record<string, { id: string }> = {};

	for (const qDef of allQDefs) {
		const { options, ...qData } = qDef;
		const existing = await prisma.questionBank.findUnique({
			where: { id: qData.id },
		});
		if (existing) {
			createdQuestions[qData.id] = existing;
		} else {
			const q = await prisma.questionBank.create({
				data: {
					...qData,
					optionType: "SINGLE_CHOICE",
					points: 1,
					options: { create: options.map((o, i) => ({ ...o, orderIndex: i })) },
				},
			});
			createdQuestions[qData.id] = q;
		}
	}
	logger.info("  ✔ Question bank populated (10 questions)");

	// SAT Practice Tests — TEST_PRACTICE (3 tests)
	const practiceTestDefs = [
		{
			id: "seed-sat-practice-1",
			name: "SAT Math Foundations — Module 1",
			difficulty: "EASY" as const,
			subjectId: mathSubject.id,
			qIds: ["seed-q-math-1", "seed-q-math-2"],
		},
		{
			id: "seed-sat-practice-2",
			name: "SAT Algebra & Advanced Math",
			difficulty: "MEDIUM" as const,
			subjectId: mathSubject.id,
			qIds: ["seed-q-math-3", "seed-q-math-4", "seed-q-math-6"],
		},
		{
			id: "seed-sat-practice-3",
			name: "SAT Reading & Writing — Core Skills",
			difficulty: "MEDIUM" as const,
			subjectId: rwSubject.id,
			qIds: ["seed-q-rw-1", "seed-q-rw-2", "seed-q-rw-3"],
		},
	];

	for (const ptDef of practiceTestDefs) {
		const existing = await prisma.sATPractice.findUnique({
			where: { id: ptDef.id },
		});
		if (!existing) {
			const test = await prisma.sATPractice.create({
				data: {
					id: ptDef.id,
					name: ptDef.name,
					status: "PUBLISHED",
					practiceType: "TEST_PRACTICE",
					difficulty: ptDef.difficulty,
					testTypeId: satTestType.id,
					subjectId: ptDef.subjectId,
					createdById: kaiser.id,
				},
			});
			const section = await prisma.section.create({
				data: {
					name: "Section 1",
					duration: 35,
					direction: "For each question, choose the best answer.",
					orderIndex: 1,
					satPracticeId: test.id,
				},
			});
			await prisma.module.create({
				data: {
					name: "Module 1",
					duration: 35,
					direction: "Answer all questions.",
					orderIndex: 1,
					sectionId: section.id,
					questionsSetOne: {
						connect: ptDef.qIds.map((qId) => ({
							id: createdQuestions[qId].id,
						})),
					},
				},
			});
		}
	}
	logger.info("  ✔ SAT practice tests created (3 TEST_PRACTICE)");

	// Full-length Practice Tests (2 tests)
	const fullLengthDefs = [
		{
			id: "seed-sat-full-1",
			name: "Digital SAT Full-Length Practice Test #1",
			difficulty: "MEDIUM" as const,
			sections: [
				{
					name: "Reading & Writing",
					duration: 64,
					qIds: ["seed-q-rw-1", "seed-q-rw-2", "seed-q-rw-3", "seed-q-rw-4"],
				},
				{
					name: "Math",
					duration: 70,
					qIds: [
						"seed-q-math-1",
						"seed-q-math-2",
						"seed-q-math-3",
						"seed-q-math-4",
						"seed-q-math-5",
					],
				},
			],
		},
		{
			id: "seed-sat-full-2",
			name: "Digital SAT Full-Length Practice Test #2",
			difficulty: "HARD" as const,
			sections: [
				{
					name: "Reading & Writing",
					duration: 64,
					qIds: ["seed-q-rw-2", "seed-q-rw-3", "seed-q-rw-4"],
				},
				{
					name: "Math",
					duration: 70,
					qIds: [
						"seed-q-math-3",
						"seed-q-math-4",
						"seed-q-math-5",
						"seed-q-math-6",
					],
				},
			],
		},
	];

	for (const flDef of fullLengthDefs) {
		const existing = await prisma.sATPractice.findUnique({
			where: { id: flDef.id },
		});
		if (!existing) {
			const test = await prisma.sATPractice.create({
				data: {
					id: flDef.id,
					name: flDef.name,
					status: "PUBLISHED",
					practiceType: "FULL_LENGTH",
					difficulty: flDef.difficulty,
					testTypeId: satTestType.id,
					createdById: kaiser.id,
				},
			});
			for (let si = 0; si < flDef.sections.length; si++) {
				const sDef = flDef.sections[si];
				const section = await prisma.section.create({
					data: {
						name: sDef.name,
						duration: sDef.duration,
						direction: "For each question, choose the best answer.",
						orderIndex: si + 1,
						satPracticeId: test.id,
					},
				});
				await prisma.module.create({
					data: {
						name: "Module 1",
						duration: sDef.duration,
						direction: "Answer all questions.",
						orderIndex: 1,
						sectionId: section.id,
						questionsSetOne: {
							connect: sDef.qIds.map((qId) => ({
								id: createdQuestions[qId].id,
							})),
						},
					},
				});
			}
		}
	}
	logger.info("  ✔ Full-length SAT practice tests created (2 FULL_LENGTH)");

	// ══════════════════════════════════════════════════════════════════
	// DONE
	// ══════════════════════════════════════════════════════════════════
	logger.info("\n✅  Comprehensive seed complete!\n");
	logger.info("  See SEED_CREDENTIALS.md for all login details.");
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
