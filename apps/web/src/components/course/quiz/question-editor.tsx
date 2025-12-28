// components/course/quiz/question-editor.tsx
"use client";

import { Copy, Hash, Plus, Trash2, X } from "lucide-react";
import RichTextEditor from "@/components/jodit-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type QuestionType =
	| "MCQ_SINGLE"
	| "MCQ_MULTIPLE"
	| "TRUE_FALSE"
	| "SHORT"
	| "LONG";

interface QuestionOption {
	text: string;
	isCorrect: boolean;
	orderIndex: number;
}

interface Question {
	id?: string;
	question: string;
	type: QuestionType;
	orderIndex: number;
	points: number;
	explanation?: string;
	options?: QuestionOption[];
}

interface QuestionEditorProps {
	question: Question;
	totalQuestions: number;
	currentIndex: number;
	onUpdate: (field: keyof Question, value: any) => void;
	onDuplicate: () => void;
	onRemove: () => void;
	canRemove: boolean;
}

export function QuestionEditor({
	question,
	totalQuestions,
	currentIndex,
	onUpdate,
	onDuplicate,
	onRemove,
	canRemove,
}: QuestionEditorProps) {
	const updateOption = (optionIndex: number, value: string) => {
		const newOptions = [...(question.options || [])];
		newOptions[optionIndex] = { ...newOptions[optionIndex], text: value };
		onUpdate("options", newOptions);
	};

	const toggleOptionCorrect = (optionIndex: number) => {
		const newOptions = [...(question.options || [])];
		if (question.type === "MCQ_SINGLE" || question.type === "TRUE_FALSE") {
			// Only one correct answer
			newOptions.forEach((opt, idx) => {
				opt.isCorrect = idx === optionIndex;
			});
		} else {
			// Multiple correct answers
			newOptions[optionIndex].isCorrect = !newOptions[optionIndex].isCorrect;
		}
		onUpdate("options", newOptions);
	};

	const addOption = () => {
		const newOptions = [...(question.options || [])];
		newOptions.push({
			text: "",
			isCorrect: false,
			orderIndex: newOptions.length,
		});
		onUpdate("options", newOptions);
	};

	const removeOption = (optionIndex: number) => {
		const newOptions = [...(question.options || [])];
		if (newOptions.length > 2) {
			newOptions.splice(optionIndex, 1);
			// Reorder indices
			newOptions.forEach((opt, idx) => {
				opt.orderIndex = idx;
			});
			onUpdate("options", newOptions);
		}
	};

	return (
		<div className="space-y-4">
			{/* Question Header */}
			<div className="flex items-center justify-between  border-b">
				<div className="space-y-1">
					<h3 className="text-lg font-semibold">
						Question {currentIndex + 1} of {totalQuestions}
					</h3>
					<p className="text-sm text-slate-500">Edit the question below</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline" className="gap-1">
						<Hash className="w-3 h-3" />
						{question.points} point{question.points !== 1 ? "s" : ""}
					</Badge>
				</div>
			</div>

			{/* Question Actions */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Select
						value={question.type}
						onValueChange={(value: QuestionType) => onUpdate("type", value)}
					>
						<SelectTrigger className="w-[200px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="MCQ_SINGLE">
								Multiple Choice (Single)
							</SelectItem>
							<SelectItem value="MCQ_MULTIPLE">
								Multiple Choice (Multiple)
							</SelectItem>
							<SelectItem value="TRUE_FALSE">True/False</SelectItem>
							<SelectItem value="SHORT">Short Answer</SelectItem>
							<SelectItem value="LONG">Long Answer</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onDuplicate}
						className="gap-2"
					>
						<Copy className="w-4 h-4" />
						Duplicate
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onRemove}
						disabled={!canRemove}
						className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
					>
						<Trash2 className="w-4 h-4" />
						Remove
					</Button>
				</div>
			</div>

			{/* Question Content */}
			<div className="space-y-4">
				<div>
					<Label className="text-sm font-medium mb-2 block">
						Question Content *
					</Label>
					<RichTextEditor
						value={question.question}
						onChange={(value) => onUpdate("question", value)}
						minHeight="100px"
					/>
				</div>

				{/* Points Input */}
				<div className="max-w-xs">
					<Label className="text-sm font-medium mb-2 block">Points</Label>
					<Input
						type="number"
						min={1}
						value={question.points}
						onChange={(e) =>
							onUpdate("points", parseInt(e.target.value, 10) || 1)
						}
						placeholder="Points"
					/>
				</div>

				{/* Question Type Specific Fields */}
				{(question.type === "MCQ_SINGLE" ||
					question.type === "MCQ_MULTIPLE" ||
					question.type === "TRUE_FALSE") && (
					<div className="space-y-4">
						<div className="space-y-3">
							<Label className="text-sm font-medium">Options</Label>
							{question.options?.map((option, index) => (
								<div key={index} className="flex items-center gap-3 group">
									<button
										type="button"
										className={`flex items-center justify-center w-8 h-8 rounded-lg font-medium shrink-0 cursor-pointer transition-colors ${
											option.isCorrect
												? "bg-emerald-100 text-emerald-700"
												: "bg-slate-100 text-slate-700 hover:bg-slate-200"
										}`}
										onClick={() => toggleOptionCorrect(index)}
										title="Click to mark as correct"
									>
										{String.fromCharCode(65 + index)}
									</button>
									<Input
										placeholder={`Option ${String.fromCharCode(65 + index)}`}
										value={option.text}
										onChange={(e) => updateOption(index, e.target.value)}
										className="flex-1"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => removeOption(index)}
										disabled={(question.options?.length || 0) <= 2}
										className="opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<X className="w-4 h-4" />
									</Button>
								</div>
							))}
							{(question.options?.length || 0) < 10 && (
								<Button
									type="button"
									variant="outline"
									onClick={addOption}
									className="w-full mt-2"
								>
									<Plus className="w-4 h-4 mr-2" />
									Add Option
								</Button>
							)}
						</div>
					</div>
				)}

				{question.type === "SHORT" && (
					<div className="space-y-3">
						<Label className="text-sm font-medium">
							Expected Answer (Key Words)
						</Label>
						<Textarea
							placeholder="Enter expected answer or key points for grading..."
							value={question.options?.[0]?.text || ""}
							onChange={(e) => {
								const newOptions = [
									{
										text: e.target.value,
										isCorrect: true,
										orderIndex: 0,
									},
								];
								onUpdate("options", newOptions);
							}}
							className="min-h-20"
						/>
					</div>
				)}

				{question.type === "LONG" && (
					<div className="space-y-3">
						<Label className="text-sm font-medium">
							Grading Rubric (Optional)
						</Label>
						<Textarea
							placeholder="Provide grading criteria and key points students should cover..."
							value={question.options?.[0]?.text || ""}
							onChange={(e) => {
								const newOptions = [
									{
										text: e.target.value,
										isCorrect: true,
										orderIndex: 0,
									},
								];
								onUpdate("options", newOptions);
							}}
							className="min-h-[100px]"
						/>
					</div>
				)}

				{/* Explanation */}
				<div>
					<Label className="text-sm font-medium mb-2 block">
						Explanation (Optional)
					</Label>
					<Textarea
						placeholder="Add explanation for the correct answer..."
						value={question.explanation || ""}
						onChange={(e) => onUpdate("explanation", e.target.value)}
						className="min-h-[60px]"
					/>
					<p className="text-xs text-slate-500 mt-1">
						This will be shown to students after they answer the question
					</p>
				</div>
			</div>
		</div>
	);
}
