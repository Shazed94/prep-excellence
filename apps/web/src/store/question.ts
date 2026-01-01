export interface Question {
	id: string;
	questionNumber: number;
	text: string;
	options: {
		id: string;
		label: string;
		text: string;
	}[];
	passage?: string;
	moduleId?: string;
}

// Updated types to match API response structure

export interface QuestionOption {
	id: string;
	orderIndex: number;
	content: string;
	isCorrect: boolean;
	questionBankId: string;
}

export interface QuestionBank {
	id: string;
	questionID: string;
	orderIndex: number;
	content: string;
	answerDescription: string;
	points: number;
	difficulty: "EASY" | "MEDIUM" | "HARD";
	optionType: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
	options: QuestionOption[];
}

export interface Module {
	id: string;
	name: string;
	threshold: number;
	orderIndex: number;
	sectionId: string;
	questionsSetOne: QuestionBank[];
	questionsSetTwo: QuestionBank[];
}

export interface ModuleProgress {
	id: string;
	moduleId: string;
	status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
	startedAt: string | null;
	completedAt: string | null;
	usedQuestionSet: "SET_ONE" | "SET_TWO" | null;
	score: number | null;
	module: Module;
}

export interface Section {
	id: string;
	name: string;
	duration: number;
	orderIndex: number;
	modules: Module[];
}

export interface SectionProgress {
	id: string;
	sectionId: string;
	status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
	startedAt: string | null;
	completedAt: string | null;
	section: Section;
	moduleProgress: ModuleProgress[];
}

export interface AttemptResponse {
	success: boolean;
	data: {
		id: string;
		status: "IN_PROGRESS" | "COMPLETED";
		startedAt: string;
		completedAt: string | null;
		sectionProgress: SectionProgress[];
	};
	message: string;
}

export const SECTION_1_QUESTIONS: Question[] = [
	{
		id: "q1",
		questionNumber: 1,
		text: "Each student that enrolls at a school is assigned a unique ID number, which is stored as a binary number. The ID numbers increase sequentially by 1 with each newly enrolled student. If the ID number assigned to the last student who enrolled was the binary number 1001_0011, what binary number will be assigned to the next student who enrolls?",
		options: [
			{ id: "a", label: "A", text: "1001_0100" },
			{ id: "b", label: "B", text: "1001_0111" },
			{ id: "c", label: "C", text: "1101_0100" },
			{ id: "d", label: "D", text: "1101_0111" },
		],
	},
	{
		id: "q2",
		questionNumber: 2,
		text: "Which of the following questions about a particular animal could NOT be answered using only the data collected from the tracking collars?",
		passage:
			"Biologists often attach tracking collars to wild animals. For each animal, the following geolocation data are collected at frequent intervals.\n• The time\n• The date\n• The location of the animal",
		options: [
			{
				id: "a",
				label: "A",
				text: "Approximately how many miles did the animal travel in one week?",
			},
			{
				id: "b",
				label: "B",
				text: "Does the animal travel in groups with other tracked animals?",
			},
			{
				id: "c",
				label: "C",
				text: "Do the movement patterns of the animal vary according to the weather?",
			},
			{
				id: "d",
				label: "D",
				text: "In what geographic locations does the animal typically travel?",
			},
		],
	},
	{
		id: "q3",
		questionNumber: 3,
		text: "Which of the following are true statements about digital certificates in web browsers?",
		options: [
			{ id: "a", label: "A", text: "I only" },
			{ id: "b", label: "B", text: "II only" },
			{ id: "c", label: "C", text: "I and II" },
			{ id: "d", label: "D", text: "Neither" },
		],
	},
];
