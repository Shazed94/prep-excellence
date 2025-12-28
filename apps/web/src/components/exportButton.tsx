import type { TGQuestion } from "@prepexcellence/shared-validators";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type ExportType, exportQuestionsToPDF } from "@/utils/pdfExport";

interface ExportButtonProps {
	questions: TGQuestion[];
}

export const ExportButton = ({ questions }: ExportButtonProps) => {
	const [exportType, setExportType] = useState<ExportType>("no-answers");
	const [isOpen, setIsOpen] = useState(false);

	const handleExport = () => {
		if (!questions || questions.length === 0) {
			toast.error("No questions to export", {
				description: "Please select at least one question before exporting.",
			});
			return;
		}

		try {
			const includeHeaders = exportType !== "no-answers-no-headers";

			exportQuestionsToPDF({
				questions,
				exportType,
				includeHeaders,
			});

			toast.success("PDF exported successfully!", {
				description: `Downloaded ${questions.length} question${questions.length > 1 ? "s" : ""}.`,
			});

			setIsOpen(false);
		} catch (error) {
			console.error("Export error:", error);
			toast.error("Export failed", {
				description: "An error occurred while generating the PDF.",
			});
		}
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					className="bg-primary-dark hover:bg-primary-dark/90 text-white"
					disabled={!questions || questions.length === 0}
				>
					<Download className="w-4 h-4 mr-2" />
					Export ({questions?.length || 0})
				</Button>
			</PopoverTrigger>

			<PopoverContent align="end" className="w-80 space-y-4">
				<div className="space-y-1">
					<h4 className="font-semibold text-sm">Export Options</h4>
					<p className="text-xs text-muted-foreground">
						Choose how you want to export the questions
					</p>
				</div>

				<RadioGroup
					value={exportType}
					onValueChange={setExportType as any}
					className="space-y-3"
				>
					<div className="flex items-start space-x-2">
						<RadioGroupItem value="no-answers" id={"no-answers"} />
						<Label htmlFor="no-answers" className="leading-snug">
							No correct answers or explanations
						</Label>
					</div>

					<div className="flex items-start space-x-2">
						<RadioGroupItem value="with-answers" id={"with-answers"} />
						<Label htmlFor="with-answers" className="leading-snug">
							With correct answers and explanations
						</Label>
					</div>

					<div className="flex items-start space-x-2">
						<RadioGroupItem value="no-answers-no-headers" id={"no-headers"} />
						<Label htmlFor="no-headers" className="leading-snug">
							Without answers or headers
						</Label>
					</div>
				</RadioGroup>

				<div className="flex justify-end gap-2 pt-2">
					<Button
						size="sm"
						variant="outline"
						onClick={() => setExportType("no-answers")}
					>
						Reset
					</Button>
					<Button size="sm" onClick={handleExport}>
						Export
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};
