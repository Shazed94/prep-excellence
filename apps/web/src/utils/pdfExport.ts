import type { TGQuestion } from "@prepexcellence/shared-validators";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper to strip HTML tags and decode entities
function stripHtml(html: string): string {
	const tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

// Helper to add wrapped text
function addWrappedText(
	doc: jsPDF,
	text: string,
	x: number,
	y: number,
	maxWidth: number,
	lineHeight = 6,
): number {
	const lines = doc.splitTextToSize(text, maxWidth);
	doc.text(lines, x, y);
	return y + lines.length * lineHeight;
}

export type ExportType =
	| "no-answers"
	| "with-answers"
	| "no-answers-no-headers";

interface ExportOptions {
	questions: TGQuestion[];
	exportType: ExportType;
	includeHeaders?: boolean;
}

export function exportQuestionsToPDF({
	questions,
	exportType,
	includeHeaders = true,
}: ExportOptions) {
	if (!questions || questions.length === 0) {
		alert("No questions selected for export");
		return;
	}

	const doc = new jsPDF({
		orientation: "portrait",
		unit: "mm",
		format: "a4",
	});

	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const margin = 15;
	const contentWidth = pageWidth - 2 * margin;

	let yPosition = margin;

	// Add title based on export type
	if (includeHeaders && exportType !== "no-answers-no-headers") {
		doc.setFontSize(18);
		doc.setFont("helvetica", "bold");
		doc.text("SAT Question Bank Export", margin, yPosition);
		yPosition += 10;

		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");
		doc.text(`Total Questions: ${questions.length}`, margin, yPosition);
		doc.text(
			`Date: ${new Date().toLocaleDateString()}`,
			pageWidth - margin - 40,
			yPosition,
		);
		yPosition += 10;

		// Add a line separator
		doc.setLineWidth(0.5);
		doc.line(margin, yPosition, pageWidth - margin, yPosition);
		yPosition += 8;
	}

	// Process each question
	questions.forEach((question, index) => {
		// Check if we need a new page
		if (yPosition > pageHeight - 50) {
			doc.addPage();
			yPosition = margin;
		}

		// Question number and ID
		doc.setFontSize(12);
		doc.setFont("helvetica", "bold");
		const questionHeader = `Question ${index + 1}${question.questionID ? ` (ID: ${question.questionID})` : ""}`;
		doc.text(questionHeader, margin, yPosition);
		yPosition += 7;

		// Add metadata table if headers are included
		if (
			includeHeaders &&
			exportType !== "no-answers-no-headers" &&
			(question.testType ||
				question.subject ||
				question.domain ||
				question.skill ||
				question.difficulty)
		) {
			const metadataRows: string[][] = [];

			if (question.testType?.name || question.subject?.name) {
				metadataRows.push([
					"Test Type:",
					question.testType?.name || "N/A",
					"Subject:",
					question.subject?.name || "N/A",
				]);
			}

			if (question.domain?.name || question.skill?.name) {
				metadataRows.push([
					"Domain:",
					question.domain?.name || "N/A",
					"Skill:",
					question.skill?.name || "N/A",
				]);
			}

			if (question.difficulty) {
				metadataRows.push([
					"Difficulty:",
					question.difficulty,
					"Option Type:",
					question.optionType?.replace(/_/g, " ") || "N/A",
				]);
			}

			if (metadataRows.length > 0) {
				autoTable(doc, {
					startY: yPosition,
					head: [],
					body: metadataRows,
					theme: "grid",
					styles: { fontSize: 9, cellPadding: 2 },
					columnStyles: {
						0: { fontStyle: "bold", cellWidth: 25 },
						1: { cellWidth: 55 },
						2: { fontStyle: "bold", cellWidth: 25 },
						3: { cellWidth: 55 },
					},
					margin: { left: margin, right: margin },
				});

				yPosition = (doc as any).lastAutoTable.finalY + 5;
			}
		}

		// Question content
		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");
		const questionText = stripHtml(question.content || "");

		if (questionText) {
			yPosition = addWrappedText(
				doc,
				questionText,
				margin,
				yPosition,
				contentWidth,
			);
			yPosition += 5;
		}

		// Answer options
		if (question.options && question.options.length > 0) {
			doc.setFont("helvetica", "bold");
			doc.text("Options:", margin, yPosition);
			yPosition += 6;

			doc.setFont("helvetica", "normal");
			question.options.forEach((option, optIndex) => {
				const optionLabel = String.fromCharCode(65 + optIndex);
				const optionText = `${optionLabel}. ${option.content}`;

				// Check page break
				if (yPosition > pageHeight - 30) {
					doc.addPage();
					yPosition = margin;
				}

				// Highlight correct answer if with-answers
				if (exportType === "with-answers" && option.isCorrect) {
					doc.setFont("helvetica", "bold");
					doc.setTextColor(0, 128, 0); // Green
				}

				yPosition = addWrappedText(
					doc,
					optionText,
					margin + 5,
					yPosition,
					contentWidth - 5,
				);

				// Reset formatting
				doc.setFont("helvetica", "normal");
				doc.setTextColor(0, 0, 0);
				yPosition += 2;
			});

			yPosition += 3;
		}

		// Fill in the blanks
		if (question.fillBlanks && question.fillBlanks.length > 0) {
			doc.setFont("helvetica", "bold");
			doc.text("Fill in the Blanks:", margin, yPosition);
			yPosition += 6;

			doc.setFont("helvetica", "normal");
			question.fillBlanks.forEach((blank, blankIdx) => {
				if (yPosition > pageHeight - 30) {
					doc.addPage();
					yPosition = margin;
				}

				const blankText =
					exportType === "with-answers"
						? `Blank ${blankIdx + 1}: ${blank.answer}`
						: `Blank ${blankIdx + 1}: __________`;

				yPosition = addWrappedText(
					doc,
					blankText,
					margin + 5,
					yPosition,
					contentWidth - 5,
				);
				yPosition += 2;
			});

			yPosition += 3;
		}

		// Short answer
		if (
			question.optionType === "SHORT_ANSWER" &&
			exportType === "with-answers" &&
			question.correctAnswer
		) {
			doc.setFont("helvetica", "bold");
			doc.text("Correct Answer:", margin, yPosition);
			yPosition += 6;

			doc.setFont("helvetica", "normal");
			doc.setTextColor(0, 128, 0);
			const answerText = Array.isArray(question.correctAnswer)
				? question.correctAnswer.join(", ")
				: question.correctAnswer;
			yPosition = addWrappedText(
				doc,
				answerText,
				margin + 5,
				yPosition,
				contentWidth - 5,
			);
			doc.setTextColor(0, 0, 0);
			yPosition += 3;
		}

		// Rationale/Explanation (only for with-answers)
		if (exportType === "with-answers" && question.answerDescription) {
			if (yPosition > pageHeight - 40) {
				doc.addPage();
				yPosition = margin;
			}

			doc.setFont("helvetica", "bold");
			doc.text("Rationale:", margin, yPosition);
			yPosition += 6;

			doc.setFont("helvetica", "normal");
			const rationaleText = stripHtml(question.answerDescription);
			yPosition = addWrappedText(
				doc,
				rationaleText,
				margin + 5,
				yPosition,
				contentWidth - 5,
			);
			yPosition += 5;
		}

		// Add spacing between questions
		yPosition += 5;

		// Add separator line between questions
		if (index < questions.length - 1) {
			doc.setLineWidth(0.3);
			doc.setDrawColor(200, 200, 200);
			doc.line(margin, yPosition, pageWidth - margin, yPosition);
			yPosition += 8;
		}
	});

	// Add footer on each page
	const pageCount = doc.getNumberOfPages();
	for (let i = 1; i <= pageCount; i++) {
		doc.setPage(i);
		doc.setFontSize(8);
		doc.setTextColor(128, 128, 128);
		doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
			align: "center",
		});
		doc.text("© PrepExcellence", pageWidth - margin, pageHeight - 10, {
			align: "right",
		});
	}

	// Generate filename
	const timestamp = new Date().toISOString().split("T")[0];
	const typeLabel =
		exportType === "with-answers"
			? "with-answers"
			: exportType === "no-answers-no-headers"
				? "clean"
				: "no-answers";
	const filename = `SAT_Questions_${typeLabel}_${timestamp}.pdf`;

	// Save the PDF
	doc.save(filename);
}
