import { FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import RichTextEditor from "../jodit-editor";

interface DirectionEditorDialogProps {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	triggerClassName?: string;
}

export function DirectionEditorDialog({
	value,
	onChange,
	label = "Edit Direction",
	triggerClassName = "",
}: DirectionEditorDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [tempValue, setTempValue] = useState(value || "");

	const handleOpen = () => {
		setTempValue(value || "");
		setIsOpen(true);
	};

	const handleSave = () => {
		onChange(tempValue);
		setIsOpen(false);
	};

	const handleCancel = () => {
		setTempValue(value || "");
		setIsOpen(false);
	};

	const hasContent = value && value.trim().length > 0;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					type="button"
					variant={hasContent ? "default" : "outline"}
					size="sm"
					className={triggerClassName}
					onClick={handleOpen}
				>
					<FileText className="w-3.5 h-3.5 mr-1.5" />
					{label}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>{label}</DialogTitle>
					<DialogDescription>
						Use the rich text editor below to add instructions or directions.
					</DialogDescription>
				</DialogHeader>
				<div className="flex-1 overflow-hidden">
					<RichTextEditor
						value={tempValue}
						onChange={(newContent) => setTempValue(newContent)}
						minHeight={400}
						height={400}
					/>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={handleCancel}>
						Cancel
					</Button>
					<Button type="button" onClick={handleSave}>
						Save Direction
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
