import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface RichTextEditorProps {
	value: string;
	onChange: (val: string) => void;
	className?: string;
	height?: number | string;
	minHeight?: number | string;
}

// Type for the dynamically loaded JoditEditor component
type JoditEditorProps = {
	value: string;
	config: any;
	tabIndex?: number;
	onBlur?: (value: string) => void;
	className?: string;
};

// Jodit exports a component that forwards refs; type it accordingly so `ref` is allowed
type JoditEditorType = React.ForwardRefExoticComponent<
	React.PropsWithoutRef<JoditEditorProps> & React.RefAttributes<any>
>;

export default function RichTextEditor({
	value,
	onChange,
	className = "",
	height = "600px",
	minHeight = "200px",
}: RichTextEditorProps) {
	const editorRef = useRef<unknown>(null);
	const [JoditEditor, setJoditEditor] = useState<JoditEditorType | null>(null);

	// Client-only dynamic import (avoids `window` issues during SSR)
	useEffect(() => {
		let mounted = true;

		if (typeof window !== "undefined") {
			import("jodit-react")
				.then((mod) => {
					if (mounted) {
						setJoditEditor(() => mod.default as JoditEditorType);
					}
				})
				.catch((err) => {
					console.error("Failed to load JoditEditor:", err);
				});
		}

		return () => {
			mounted = false;
		};
	}, []);

	// Jodit configuration
	const config = useMemo(
		() => ({
			spellcheck: true,
			height,
			minHeight,
			toolbarAdaptive: false,
			buttons: [
				"bold",
				"italic",
				"underline",
				"|",
				"ul",
				"ol",
				"|",
				"font",
				"fontsize",
				"paragraph",
				"|",
				"image",
				"video",
				"table",
				"|",
				"undo",
				"redo",
				"|",
				"fullsize",
				"source",
			],
			style: {
				fontFamily: "Arial, sans-serif",
			},
			events: {
				afterInit: (jodit: any) => {
					// Ensure spellcheck is enabled on the editable area
					jodit.editor?.setAttribute?.("spellcheck", "true");
				},
			},
		}),
		[height, minHeight],
	);

	// While Jodit is loading on the client
	if (!JoditEditor) {
		return <div className={`jodit-custom ${className}`}>Loading editor...</div>;
	}

	return (
		<JoditEditor
			ref={editorRef as any}
			value={value}
			config={config}
			// tabIndex={80}
			onBlur={onChange}
			className={`jodit-custom ${className}`}
		/>
	);
}
