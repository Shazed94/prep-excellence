"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Code,
	Heading2,
	Italic,
	List,
	ListOrdered,
	Quote,
	Redo,
	Undo,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface TiptapEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	minHeight?: number | string;
	height?: number | string;
	editorId?: string;
}

export default function TiptapEditor({
	value,
	onChange,
	placeholder = "Start typing...",
	minHeight = 200,
	height = 300,
}: TiptapEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
		],
		content: value,
		editorProps: {
			attributes: {
				class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
			},
		},
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			onChange(html);
		},
	});

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (editor) {
				editor.destroy();
			}
		};
	}, [editor]);

	// Update editor content when value changes externally
	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value);
		}
	}, [value, editor]);

	if (!editor) {
		return (
			<div className="border rounded-lg p-4 text-muted-foreground text-sm">
				Loading editor...
			</div>
		);
	}

	return (
		<div className="border rounded-lg overflow-hidden bg-background">
			{/* Toolbar */}
			<div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={`h-8 w-8 p-0 ${editor.isActive("bold") ? "bg-muted" : ""}`}
				>
					<Bold className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					className={`h-8 w-8 p-0 ${
						editor.isActive("italic") ? "bg-muted" : ""
					}`}
				>
					<Italic className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleCode().run()}
					disabled={!editor.can().chain().focus().toggleCode().run()}
					className={`h-8 w-8 p-0 ${editor.isActive("code") ? "bg-muted" : ""}`}
				>
					<Code className="h-4 w-4" />
				</Button>
				<div className="w-px h-8 bg-border mx-1" />
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className={`h-8 w-8 p-0 ${
						editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
					}`}
				>
					<Heading2 className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={`h-8 w-8 p-0 ${
						editor.isActive("bulletList") ? "bg-muted" : ""
					}`}
				>
					<List className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={`h-8 w-8 p-0 ${
						editor.isActive("orderedList") ? "bg-muted" : ""
					}`}
				>
					<ListOrdered className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={`h-8 w-8 p-0 ${
						editor.isActive("blockquote") ? "bg-muted" : ""
					}`}
				>
					<Quote className="h-4 w-4" />
				</Button>
				<div className="w-px h-8 bg-border mx-1" />
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
					className="h-8 w-8 p-0"
				>
					<Undo className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
					className="h-8 w-8 p-0"
				>
					<Redo className="h-4 w-4" />
				</Button>
			</div>

			{/* Editor Content */}
			<div
				style={{
					minHeight:
						typeof minHeight === "number" ? `${minHeight}px` : minHeight,
					maxHeight: typeof height === "number" ? `${height}px` : height,
					overflowY: "auto",
				}}
			>
				<EditorContent editor={editor} />
			</div>
		</div>
	);
}
