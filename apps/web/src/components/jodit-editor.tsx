// 'use client';
// import type React from "react";
// import {
// 	forwardRef,
// 	useEffect,
// 	useImperativeHandle,
// 	useMemo,
// 	useRef,
// 	useState,
// } from "react";

// export interface RichTextEditorProps {
// 	value: string;
// 	onChange: (val: string) => void;
// 	className?: string;
// 	height?: number | string;
// 	minHeight?: number | string;
// }

// export interface RichTextEditorRef {
// 	insertHTML: (html: string) => void;
// }

// // Type for the dynamically loaded JoditEditor component
// type JoditEditorProps = {
// 	value: string;
// 	config: any;
// 	tabIndex?: number;
// 	onBlur?: (value: string) => void;
// 	className?: string;
// };

// // Jodit exports a component that forwards refs; type it accordingly so `ref` is allowed
// type JoditEditorType = React.ForwardRefExoticComponent<
// 	React.PropsWithoutRef<JoditEditorProps> & React.RefAttributes<any>
// >;

// const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
// 	(
// 		{ value, onChange, className = "", height = "400px", minHeight = "200px" },
// 		ref,
// 	) => {
// 		const editorRef = useRef<any>(null);
// 		const [JoditEditor, setJoditEditor] = useState<JoditEditorType | null>(
// 			null,
// 		);

// 		// *** এটা সবচেয়ে গুরুত্বপূর্ণ: unmount-এ editor destroy করো ***
// 		useEffect(() => {
// 			return () => {
// 				if (editorRef.current) {
// 					try {
// 						editorRef.current.destruct(); // Jodit-এর official destroy method
// 					} catch (e) {
// 						console.warn("Jodit destruct failed:", e);
// 					}
// 					editorRef.current = null;
// 				}
// 			};
// 		}, []); // empty dependency → শুধু unmount-এ রান হবে

// 		// insertHTML expose
// 		useImperativeHandle(ref, () => ({
// 			insertHTML: (html: string) => {
// 				if (editorRef.current?.selection) {
// 					editorRef.current.selection.insertHTML(html);
// 				}
// 			},
// 		}));

// 		// dynamic import
// 		useEffect(() => {
// 			let mounted = true;
// 			if (typeof window !== "undefined") {
// 				import("jodit-react")
// 					.then((mod) => {
// 						if (mounted) {
// 							setJoditEditor(() => mod.default as JoditEditorType);
// 						}
// 					})
// 					.catch((err) => console.error("Failed to load JoditEditor:", err));
// 			}
// 			return () => {
// 				mounted = false;
// 			};
// 		}, []);

// 		const config = useMemo(
// 			() => ({
// 				spellcheck: true,
// 				iframe: false, // চেষ্টা করো iframe: true করতে – অনেক DOM issue solve করে
// 				height,
// 				minHeight,
// 				toolbarAdaptive: false,
// 				buttons: [
// 					/* তোমার buttons */
// 				],
// 				style: { fontFamily: "Arial, sans-serif" },
// 				events: {
// 					afterInit: (jodit: any) => {
// 						jodit.editor?.setAttribute?.("spellcheck", "true");
// 					},
// 				},
// 			}),
// 			[height, minHeight],
// 		);

// 		if (!JoditEditor) {
// 			return (
// 				<div className={`jodit-custom ${className}`}>Loading editor...</div>
// 			);
// 		}

// 		return (
// 			<JoditEditor
// 				ref={editorRef}
// 				value={value}
// 				config={config}
// 				onBlur={onChange} // onChange-এর পরিবর্তে onBlur ব্যবহার করো যদি possible হয় (অনেক stable)
// 				className={`jodit-custom ${className}`}
// 			/>
// 		);
// 	},
// );

// RichTextEditor.displayName = "RichTextEditor";

// export default RichTextEditor;

"use client";

import type React from "react";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";

export interface RichTextEditorProps {
	value: string;
	onChange: (val: string) => void;
	className?: string;
	height?: number | string;
	minHeight?: number | string;
}

export interface RichTextEditorRef {
	insertHTML: (html: string) => void;
}

type JoditEditorProps = {
	value: string;
	config: any;
	tabIndex?: number;
	onBlur?: (value: string) => void;
	className?: string;
};

type JoditEditorType = React.ForwardRefExoticComponent<
	React.PropsWithoutRef<JoditEditorProps> & React.RefAttributes<any>
>;

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
	(
		{ value, onChange, className = "", height = "400px", minHeight = "200px" },
		ref,
	) => {
		const editorRef = useRef<any>(null);
		const [JoditEditor, setJoditEditor] = useState<JoditEditorType | null>(
			null,
		);

		// Expose insertHTML method to parent components
		useImperativeHandle(ref, () => ({
			insertHTML: (html: string) => {
				if (editorRef.current) {
					const jodit = editorRef.current;
					if (jodit.selection) {
						jodit.selection.insertHTML(html);
					}
				}
			},
		}));

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
			return (
				<div className={`jodit-custom ${className}`}>Loading editor...</div>
			);
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
	},
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
