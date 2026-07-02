export const currentUser = {
	id: "user-1",
	name: "Aryan Khandelwal",
	email: "aryan@example.com",
	avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan",
	bio: "Full-stack developer passionate about learning and building amazing products.",
	joinDate: new Date("2023-01-15"),
	totalHours: 245,
	certificatesEarned: 8,
	currentStreak: 12,
	totalPoints: 3850,
	rank: 47,
};

export const mockCourses = [
	{
		id: "course-1",
		title: "Complete Web Development Bootcamp",
		instructor: "Sarah Johnson",
		instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
		description:
			"Master the fundamentals of web development with HTML, CSS, JavaScript, and modern frameworks like React and Node.js.",
		category: "Web Development",
		thumbnail:
			"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
		rating: 4.8,
		totalRatings: 2543,
		students: 45890,
		duration: 65,
		level: "Beginner",
		progress: 75,
		status: "In Progress",
		lastAccessed: new Date("2024-06-28"),
		enrolledDate: new Date("2024-01-10"),
		modules: [
			{
				id: "mod-1-1",
				title: "Getting Started with HTML",
				duration: 45,
				completed: true,
				lessons: [
					{
						id: "les-1-1-1",
						title: "Introduction to HTML",
						duration: 12,
						type: "video",
						completed: true,
						watched: 720,
					},
					{
						id: "les-1-1-2",
						title: "HTML Tags and Elements",
						duration: 18,
						type: "video",
						completed: true,
						watched: 1080,
					},
					{
						id: "les-1-1-3",
						title: "HTML Quiz",
						duration: 15,
						type: "quiz",
						completed: true,
					},
				],
			},
			{
				id: "mod-1-2",
				title: "CSS Fundamentals",
				duration: 52,
				completed: true,
				lessons: [
					{
						id: "les-1-2-1",
						title: "Introduction to CSS",
						duration: 20,
						type: "video",
						completed: true,
						watched: 1200,
					},
					{
						id: "les-1-2-2",
						title: "Selectors and Styling",
						duration: 22,
						type: "video",
						completed: true,
						watched: 1320,
					},
					{
						id: "les-1-2-3",
						title: "CSS Project",
						duration: 10,
						type: "assignment",
						completed: true,
					},
				],
			},
			{
				id: "mod-1-3",
				title: "JavaScript Basics",
				duration: 68,
				completed: false,
				lessons: [
					{
						id: "les-1-3-1",
						title: "Variables and Data Types",
						duration: 25,
						type: "video",
						completed: true,
						watched: 1500,
					},
					{
						id: "les-1-3-2",
						title: "Functions and Scope",
						duration: 28,
						type: "video",
						completed: false,
					},
					{
						id: "les-1-3-3",
						title: "DOM Manipulation",
						duration: 15,
						type: "video",
						completed: false,
					},
				],
			},
		],
	},
	{
		id: "course-2",
		title: "React Advanced Patterns & Performance",
		instructor: "Alex Chen",
		instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
		description:
			"Deep dive into advanced React patterns, hooks, performance optimization, and state management techniques.",
		category: "Web Development",
		thumbnail:
			"https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
		rating: 4.9,
		totalRatings: 1892,
		students: 28934,
		duration: 54,
		level: "Advanced",
		progress: 100,
		status: "Completed",
		enrolledDate: new Date("2023-11-22"),
		modules: [
			{
				id: "mod-2-1",
				title: "Custom Hooks",
				duration: 42,
				completed: true,
				lessons: [
					{
						id: "les-2-1-1",
						title: "Creating Custom Hooks",
						duration: 20,
						type: "video",
						completed: true,
						watched: 1200,
					},
					{
						id: "les-2-1-2",
						title: "Hook Patterns",
						duration: 22,
						type: "video",
						completed: true,
						watched: 1320,
					},
				],
			},
			{
				id: "mod-2-2",
				title: "Performance Optimization",
				duration: 50,
				completed: true,
				lessons: [
					{
						id: "les-2-2-1",
						title: "Memoization",
						duration: 22,
						type: "video",
						completed: true,
						watched: 1320,
					},
					{
						id: "les-2-2-2",
						title: "Code Splitting",
						duration: 28,
						type: "video",
						completed: true,
						watched: 1680,
					},
				],
			},
		],
	},
	{
		id: "course-3",
		title: "Mobile App Development with React Native",
		instructor: "Maria Rodriguez",
		instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
		description:
			"Build cross-platform mobile applications using React Native for iOS and Android platforms.",
		category: "Mobile Development",
		thumbnail:
			"https://images.unsplash.com/photo-1512941691920-25bde682a18a?w=500&h=300&fit=crop",
		rating: 4.7,
		totalRatings: 1456,
		students: 19203,
		duration: 72,
		level: "Intermediate",
		progress: 45,
		status: "In Progress",
		lastAccessed: new Date("2024-06-27"),
		enrolledDate: new Date("2024-02-05"),
		modules: [
			{
				id: "mod-3-1",
				title: "React Native Setup",
				duration: 35,
				completed: true,
				lessons: [
					{
						id: "les-3-1-1",
						title: "Environment Setup",
						duration: 25,
						type: "video",
						completed: true,
						watched: 1500,
					},
					{
						id: "les-3-1-2",
						title: "First App",
						duration: 10,
						type: "video",
						completed: true,
						watched: 600,
					},
				],
			},
		],
	},
	{
		id: "course-4",
		title: "Backend Development with Node.js & Express",
		instructor: "David Kim",
		instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
		description:
			"Learn server-side programming with Node.js, build RESTful APIs, and work with databases.",
		category: "Backend Development",
		thumbnail:
			"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
		rating: 4.8,
		totalRatings: 3021,
		students: 52134,
		duration: 58,
		level: "Beginner",
		progress: 30,
		status: "In Progress",
		lastAccessed: new Date("2024-06-25"),
		enrolledDate: new Date("2024-03-20"),
		modules: [],
	},
	{
		id: "course-5",
		title: "Data Science with Python",
		instructor: "Prof. Emily Watson",
		instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
		description:
			"Master data analysis, visualization, and machine learning with Python and popular libraries.",
		category: "Data Science",
		thumbnail:
			"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
		rating: 4.9,
		totalRatings: 2876,
		students: 38456,
		duration: 85,
		level: "Intermediate",
		progress: 60,
		status: "In Progress",
		lastAccessed: new Date("2024-06-28"),
		enrolledDate: new Date("2024-01-08"),
		modules: [],
	},
];

export const mockCertificates = [
	{
		id: "cert-1",
		courseId: "course-2",
		courseName: "React Advanced Patterns & Performance",
		issuedDate: new Date("2024-05-15"),
		certificateUrl: "https://example.com/certs/react-advanced.pdf",
		skillsVerified: [
			"React",
			"Performance Optimization",
			"Hooks",
			"State Management",
		],
	},
	{
		id: "cert-2",
		courseId: "course-1",
		courseName: "Complete Web Development Bootcamp",
		issuedDate: new Date("2024-04-22"),
		certificateUrl: "https://example.com/certs/web-dev.pdf",
		skillsVerified: ["HTML", "CSS", "JavaScript", "DOM Manipulation"],
	},
	{
		id: "cert-3",
		courseId: "course-5",
		courseName: "Data Science with Python",
		issuedDate: new Date("2024-03-10"),
		certificateUrl: "https://example.com/certs/data-science.pdf",
		skillsVerified: ["Python", "Data Analysis", "Pandas", "Matplotlib"],
	},
	{
		id: "cert-4",
		courseId: "course-3",
		courseName: "Mobile App Development with React Native",
		issuedDate: new Date("2024-02-28"),
		certificateUrl: "https://example.com/certs/react-native.pdf",
		skillsVerified: ["React Native", "iOS Development", "Android Development"],
	},
	{
		id: "cert-5",
		courseId: "course-4",
		courseName: "Backend Development with Node.js & Express",
		issuedDate: new Date("2024-01-15"),
		certificateUrl: "https://example.com/certs/nodejs.pdf",
		skillsVerified: ["Node.js", "Express", "REST APIs", "Database Design"],
	},
	{
		id: "cert-6",
		courseId: "course-1",
		courseName: "TypeScript Mastery",
		issuedDate: new Date("2023-12-05"),
		certificateUrl: "https://example.com/certs/typescript.pdf",
		skillsVerified: ["TypeScript", "Type Safety", "Advanced Types", "Generics"],
	},
	{
		id: "cert-7",
		courseId: "course-2",
		courseName: "AWS Cloud Fundamentals",
		issuedDate: new Date("2023-11-20"),
		certificateUrl: "https://example.com/certs/aws.pdf",
		skillsVerified: ["AWS", "EC2", "S3", "Lambda"],
	},
	{
		id: "cert-8",
		courseId: "course-5",
		courseName: "Machine Learning Essentials",
		issuedDate: new Date("2023-10-12"),
		certificateUrl: "https://example.com/certs/ml.pdf",
		skillsVerified: [
			"Machine Learning",
			"Scikit-learn",
			"Neural Networks",
			"TensorFlow",
		],
	},
];

export const mockQuizzes = [
	{
		id: "quiz-1",
		courseId: "course-1",
		courseName: "Complete Web Development Bootcamp",
		title: "HTML Fundamentals Quiz",
		score: 95,
		maxScore: 100,
		percentage: 95,
		attemptDate: new Date("2024-06-20"),
		timeSpent: 1200,
		status: "Passed",
		canRetake: false,
		questions: [
			{
				id: "q-1",
				question: "What does HTML stand for?",
				userAnswer: "HyperText Markup Language",
				correctAnswer: "HyperText Markup Language",
				isCorrect: true,
			},
			{
				id: "q-2",
				question: "Which tag is used for headings?",
				userAnswer: "<heading>",
				correctAnswer: "<h1> to <h6>",
				isCorrect: false,
			},
		],
	},
	{
		id: "quiz-2",
		courseId: "course-1",
		courseName: "Complete Web Development Bootcamp",
		title: "CSS Selectors Quiz",
		score: 88,
		maxScore: 100,
		percentage: 88,
		attemptDate: new Date("2024-06-18"),
		timeSpent: 1500,
		status: "Passed",
		canRetake: true,
		questions: [],
	},
	{
		id: "quiz-3",
		courseId: "course-5",
		courseName: "Data Science with Python",
		title: "Python Basics Quiz",
		score: 92,
		maxScore: 100,
		percentage: 92,
		attemptDate: new Date("2024-06-22"),
		timeSpent: 1800,
		status: "Passed",
		canRetake: false,
		questions: [],
	},
	{
		id: "quiz-4",
		courseId: "course-3",
		courseName: "Mobile App Development with React Native",
		title: "React Native Components Quiz",
		score: 85,
		maxScore: 100,
		percentage: 85,
		attemptDate: new Date("2024-06-15"),
		timeSpent: 1600,
		status: "Passed",
		canRetake: true,
		questions: [],
	},
	{
		id: "quiz-5",
		courseId: "course-4",
		courseName: "Backend Development with Node.js & Express",
		title: "Express Middleware Quiz",
		score: 78,
		maxScore: 100,
		percentage: 78,
		attemptDate: new Date("2024-06-10"),
		timeSpent: 2100,
		status: "Passed",
		canRetake: true,
		questions: [],
	},
];

export const mockNotifications = [
	{
		id: "notif-1",
		type: "certificate",
		title: "Certificate Earned!",
		message:
			"Congratulations! You&apos;ve earned a certificate for React Advanced Patterns & Performance",
		timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
		read: true,
		actionUrl: "/certificates",
		icon: "award",
	},
	{
		id: "notif-2",
		type: "course-update",
		title: "New Course Content Available",
		message: "Complete Web Development Bootcamp has 3 new lessons added",
		timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
		read: true,
		actionUrl: "/courses/course-1",
	},
	{
		id: "notif-3",
		type: "quiz-result",
		title: "Quiz Results",
		message: "You scored 95% on the HTML Fundamentals Quiz",
		timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
		read: true,
		actionUrl: "/quiz-scores",
	},
	{
		id: "notif-4",
		type: "achievement",
		title: "Achievement Unlocked!",
		message:
			"You&apos;ve completed 5 courses! Unlock the &quot;Fast Learner&quot; badge",
		timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
		read: false,
		actionUrl: "/profile",
	},
	{
		id: "notif-5",
		type: "reminder",
		title: "Keep Your Streak Alive!",
		message:
			"You have 12 days of learning streak. Complete a lesson today to keep it going!",
		timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
		read: false,
		actionUrl: "/courses",
	},
];

export const mockLeaderboard = [
	{
		rank: 1,
		userId: "user-2",
		username: "Priya Sharma",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
		points: 5240,
		coursesCompleted: 12,
		streak: 45,
		badges: ["Fast Learner", "Quiz Master", "Consistent"],
	},
	{
		rank: 2,
		userId: "user-3",
		username: "Vikram Patel",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
		points: 4890,
		coursesCompleted: 10,
		streak: 38,
		badges: ["Quiz Master", "Dedicated"],
	},
	{
		rank: 3,
		userId: "user-4",
		username: "Neha Gupta",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
		points: 4650,
		coursesCompleted: 9,
		streak: 32,
		badges: ["Fast Learner", "Consistent"],
	},
	{
		rank: 4,
		userId: "user-1",
		username: "Aryan Khandelwal",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan",
		points: 3850,
		coursesCompleted: 8,
		streak: 12,
		badges: ["Rising Star"],
	},
	{
		rank: 5,
		userId: "user-5",
		username: "Rajesh Kumar",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
		points: 3420,
		coursesCompleted: 7,
		streak: 21,
		badges: [],
	},
	...Array.from({ length: 15 }, (_, i) => ({
		rank: 6 + i,
		userId: `user-${6 + i}`,
		username: `Student ${6 + i}`,
		avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Student${6 + i}`,
		points: 3000 - i * 150,
		coursesCompleted: Math.max(5, 6 - Math.floor(i / 3)),
		streak: Math.max(5, 20 - i),
		badges: i % 3 === 0 ? ["Active"] : [],
	})),
];

export const mockProgressStats = {
	totalCoursesEnrolled: 5,
	coursesCompleted: 2,
	coursesInProgress: 3,
	totalHours: 245,
	averageScore: 88.4,
	currentStreak: 12,
	longestStreak: 45,
	totalPoints: 3850,
};

export const mockDashboardStats = {
	coursesEnrolled: 5,
	totalHours: 245,
	certificatesEarned: 8,
	currentStreak: 12,
};

export const mockEnrollments = [
	{
		id: "course-1",
		course: mockCourses[0],
		progress: 75,
		status: "ACTIVE",
		enrolledAt: new Date("2024-01-10"),
	},
	{
		id: "course-2",
		course: mockCourses[1],
		progress: 100,
		status: "COMPLETED",
		enrolledAt: new Date("2023-11-22"),
	},
	{
		id: "course-3",
		course: mockCourses[2],
		progress: 45,
		status: "ACTIVE",
		enrolledAt: new Date("2024-02-05"),
	},
	{
		id: "course-4",
		course: mockCourses[3],
		progress: 30,
		status: "ACTIVE",
		enrolledAt: new Date("2024-03-20"),
	},
	{
		id: "course-5",
		course: mockCourses[4],
		progress: 60,
		status: "ACTIVE",
		enrolledAt: new Date("2024-01-08"),
	},
];

export const mockAttendance = Array.from({ length: 30 }, (_, i) => {
	const date = new Date();
	date.setDate(date.getDate() - (29 - i));
	const statuses = ["Present", "Present", "Present", "Absent", "Late"];
	return {
		date,
		status: statuses[Math.floor(Math.random() * statuses.length)] as
			| "Present"
			| "Absent"
			| "Late",
	};
});

// Course-specific data structures
export const getCourseProgress = (courseId: string) => {
	const courseProgressMap: Record<string, any> = {
		"course-1": {
			courseId: "course-1",
			courseName: "Complete Web Development Bootcamp",
			totalLessons: 9,
			completedLessons: 7,
			totalModules: 3,
			completedModules: 2,
			averageScore: 88.5,
			estimatedTimeRemaining: 18,
			recentActivity: [
				{
					date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
					type: "lesson_completed",
					title: "Variables and Data Types",
				},
				{
					date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
					type: "quiz_completed",
					title: "CSS Selectors Quiz",
					score: 88,
				},
				{
					date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
					type: "lesson_completed",
					title: "DOM Manipulation",
				},
			],
		},
		"course-2": {
			courseId: "course-2",
			courseName: "React Advanced Patterns & Performance",
			totalLessons: 4,
			completedLessons: 4,
			totalModules: 2,
			completedModules: 2,
			averageScore: 95.0,
			estimatedTimeRemaining: 0,
			recentActivity: [
				{
					date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
					type: "course_completed",
					title: "Course Completed!",
				},
			],
		},
		"course-3": {
			courseId: "course-3",
			courseName: "Mobile App Development with React Native",
			totalLessons: 2,
			completedLessons: 1,
			totalModules: 1,
			completedModules: 0,
			averageScore: 85.0,
			estimatedTimeRemaining: 45,
			recentActivity: [
				{
					date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
					type: "lesson_completed",
					title: "First App",
				},
			],
		},
		"course-4": {
			courseId: "course-4",
			courseName: "Backend Development with Node.js & Express",
			totalLessons: 8,
			completedLessons: 2,
			totalModules: 4,
			completedModules: 0,
			averageScore: 82.0,
			estimatedTimeRemaining: 58,
			recentActivity: [],
		},
		"course-5": {
			courseId: "course-5",
			courseName: "Data Science with Python",
			totalLessons: 12,
			completedLessons: 7,
			totalModules: 3,
			completedModules: 1,
			averageScore: 89.5,
			estimatedTimeRemaining: 32,
			recentActivity: [
				{
					date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
					type: "quiz_completed",
					title: "Python Basics Quiz",
					score: 92,
				},
			],
		},
	};
	return courseProgressMap[courseId] || courseProgressMap["course-1"];
};

export const getCourseAttendance = (courseId: string) => {
	return Array.from({ length: 30 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (29 - i));
		const statuses = [
			"Present",
			"Present",
			"Present",
			"Present",
			"Absent",
			"Late",
		];
		return {
			date,
			status: statuses[Math.floor(Math.random() * statuses.length)] as
				| "Present"
				| "Absent"
				| "Late",
		};
	});
};

export const getCourseCertificate = (courseId: string) => {
	const certificateMap: Record<string, any> = {
		"course-1": null,
		"course-2": {
			id: "cert-1",
			courseId: "course-2",
			courseName: "React Advanced Patterns & Performance",
			certificateNumber: "CERT-2024-00152",
			issuedDate: new Date("2024-05-15"),
			certificateUrl: "https://example.com/certs/react-advanced.pdf",
			score: 95,
			skillsVerified: [
				"React",
				"Performance Optimization",
				"Hooks",
				"State Management",
				"Custom Components",
			],
			instructorName: "Alex Chen",
			instructorSignature: "Alex Chen",
		},
		"course-3": null,
		"course-4": null,
		"course-5": {
			id: "cert-data",
			courseId: "course-5",
			courseName: "Data Science with Python",
			certificateNumber: "CERT-2024-00298",
			issuedDate: new Date("2024-03-10"),
			certificateUrl: "https://example.com/certs/data-science.pdf",
			score: 92,
			skillsVerified: [
				"Python",
				"Data Analysis",
				"Pandas",
				"Matplotlib",
				"NumPy",
			],
			instructorName: "Prof. Emily Watson",
			instructorSignature: "Prof. Emily Watson",
		},
	};
	return certificateMap[courseId] || null;
};

export const getCourseQuizzes = (courseId: string) => {
	const quizzesMap = {
		"course-1": [
			{
				id: "quiz-1",
				courseId: "course-1",
				courseName: "Complete Web Development Bootcamp",
				title: "HTML Fundamentals Quiz",
				score: 95,
				maxScore: 100,
				percentage: 95,
				attemptDate: new Date("2024-06-20"),
				timeSpent: 1200,
				status: "Passed",
				canRetake: false,
				questions: [
					{
						id: "q-1",
						question: "What does HTML stand for?",
						userAnswer: "HyperText Markup Language",
						correctAnswer: "HyperText Markup Language",
						isCorrect: true,
					},
					{
						id: "q-2",
						question: "Which tag is used for headings?",
						userAnswer: "<heading>",
						correctAnswer: "<h1> to <h6>",
						isCorrect: false,
					},
				],
			},
			{
				id: "quiz-2",
				courseId: "course-1",
				courseName: "Complete Web Development Bootcamp",
				title: "CSS Selectors Quiz",
				score: 88,
				maxScore: 100,
				percentage: 88,
				attemptDate: new Date("2024-06-18"),
				timeSpent: 1500,
				status: "Passed",
				canRetake: true,
				questions: [],
			},
		],
		"course-2": [
			{
				id: "quiz-react-1",
				courseId: "course-2",
				courseName: "React Advanced Patterns & Performance",
				title: "React Hooks Quiz",
				score: 98,
				maxScore: 100,
				percentage: 98,
				attemptDate: new Date("2024-05-20"),
				timeSpent: 900,
				status: "Passed",
				canRetake: false,
				questions: [],
			},
		],
		"course-3": [
			{
				id: "quiz-4",
				courseId: "course-3",
				courseName: "Mobile App Development with React Native",
				title: "React Native Components Quiz",
				score: 85,
				maxScore: 100,
				percentage: 85,
				attemptDate: new Date("2024-06-15"),
				timeSpent: 1600,
				status: "Passed",
				canRetake: true,
				questions: [],
			},
		],
		"course-4": [
			{
				id: "quiz-5",
				courseId: "course-4",
				courseName: "Backend Development with Node.js & Express",
				title: "Express Middleware Quiz",
				score: 78,
				maxScore: 100,
				percentage: 78,
				attemptDate: new Date("2024-06-10"),
				timeSpent: 2100,
				status: "Passed",
				canRetake: true,
				questions: [],
			},
		],
		"course-5": [
			{
				id: "quiz-3",
				courseId: "course-5",
				courseName: "Data Science with Python",
				title: "Python Basics Quiz",
				score: 92,
				maxScore: 100,
				percentage: 92,
				attemptDate: new Date("2024-06-22"),
				timeSpent: 1800,
				status: "Passed",
				canRetake: false,
				questions: [],
			},
		],
	};
	return quizzesMap[courseId] || [];
};

export const getCourseLeaderboard = (courseId: string) => {
	const courseNames: Record<string, string> = {
		"course-1": "Complete Web Development Bootcamp",
		"course-2": "React Advanced Patterns & Performance",
		"course-3": "Mobile App Development with React Native",
		"course-4": "Backend Development with Node.js & Express",
		"course-5": "Data Science with Python",
	};

	const baseLeaderboard = [
		{
			rank: 1,
			userId: "user-2",
			username: "Priya Sharma",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
			points: 980,
			coursesCompleted: 1,
			streak: 45,
			badges: ["Quiz Master", "Top Performer"],
		},
		{
			rank: 2,
			userId: "user-3",
			username: "Vikram Patel",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
			points: 850,
			coursesCompleted: 1,
			streak: 38,
			badges: ["Quiz Master"],
		},
		{
			rank: 3,
			userId: "user-1",
			username: "Aryan Khandelwal (You)",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan",
			points: 750,
			coursesCompleted: 1,
			streak: 12,
			badges: ["Rising Star"],
		},
		{
			rank: 4,
			userId: "user-4",
			username: "Neha Gupta",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
			points: 720,
			coursesCompleted: 1,
			streak: 32,
			badges: ["Consistent"],
		},
		{
			rank: 5,
			userId: "user-5",
			username: "Rajesh Kumar",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
			points: 680,
			coursesCompleted: 1,
			streak: 21,
			badges: [],
		},
	];

	return baseLeaderboard;
};
