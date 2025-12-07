
import z from "zod";

export const ZAddQuestion = z.object({
    testType: z.string().min(1, "Test type is required"),
    subject: z.string().min(1, "Subject is required"),
    section: z.string().min(1, "Section is required"),
    difficultyLevel: z.string().min(1, "Difficulty level is required"),
    domain: z.string().min(1, "Domain is required"),
    skill: z.string().min(1, "Skill is required"),
    questionType: z.string().min(1, "Question type is required"),
    question: z.string().min(10, "Question must be at least 10 characters"),
    answer: z.string().min(1, "Answer is required"),
    optionA: z.string().min(1, "Option A is required"),
    optionB: z.string().min(1, "Option B is required"),
    optionC: z.string().min(1, "Option C is required"),
    optionD: z.string().min(1, "Option D is required"),
    correctOption: z.enum(["A", "B", "C", "D"], {
        error: "Please select the correct option",
    }),
    time: z.string().optional(),
    date: z.string().optional(),
});

export const ZEditQuestion = z.object({
    testType: z.string().min(1, "Test type is required"),
    subject: z.string().min(1, "Subject is required"),
    section: z.string().min(1, "Section is required"),
    difficultyLevel: z.string().min(1, "Difficulty level is required"),
    domain: z.string().min(1, "Domain is required"),
    skill: z.string().min(1, "Skill is required"),
    questionType: z.string().min(1, "Question type is required"),
    question: z.string().min(10, "Question must be at least 10 characters"),
    answer: z.string().min(1, "Answer is required"),
    optionA: z.string().min(1, "Option A is required"),
    optionB: z.string().min(1, "Option B is required"),
    optionC: z.string().min(1, "Option C is required"),
    optionD: z.string().min(1, "Option D is required"),
    correctOption: z.enum(["A", "B", "C", "D"], {
        error: "Please select the correct option",
    }),
    time: z.string().optional(),
    date: z.string().optional(),
});


export type TAddQuestion = z.infer<typeof ZAddQuestion>;
export type TEditQuestion = z.infer<typeof ZEditQuestion>;
