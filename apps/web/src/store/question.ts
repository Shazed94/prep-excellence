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
	layout: "simple" | "split";
}

export const SECTION_1_QUESTIONS: Question[] = [
	{
		id: "q1",
		questionNumber: 1,
		text: "Each student that enrolls at a school is assigned a unique ID number, which is stored as a binary number. The ID numbers increase sequentially by 1 with each newly enrolled student. If the ID number assigned to the last student who enrolled was the binary number 1001_0011, what binary number will be assigned to the next student who enrolls?",
		layout: "simple",
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
		layout: "split",
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
		layout: "simple",
		options: [
			{ id: "a", label: "A", text: "I only" },
			{ id: "b", label: "B", text: "II only" },
			{ id: "c", label: "C", text: "I and II" },
			{ id: "d", label: "D", text: "Neither" },
		],
	},
];
