"use client";

import { ChevronsLeftRight } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface SplitPanelProps {
	leftContent: ReactNode;
	rightContent: ReactNode;
}

export function SplitPanel({ leftContent, rightContent }: SplitPanelProps) {
	const [dividerPos, setDividerPos] = useState(50);
	const containerRef = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging.current || !containerRef.current) return;

			const container = containerRef.current;
			const rect = container.getBoundingClientRect();
			const newPos = ((e.clientX - rect.left) / rect.width) * 100;

			if (newPos > 30 && newPos < 70) {
				setDividerPos(newPos);
			}
		};

		const handleMouseUp = () => {
			isDragging.current = false;
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	return (
		<div ref={containerRef} className="flex min-h-full gap-0 bg-white">
			{/* Left Panel */}
			<div
				style={{ width: `${dividerPos}%` }}
				className="overflow-y-auto border-r border-gray-300 p-6"
			>
				{leftContent}
			</div>

			{/* Divider */}
			<button
				type="button"
				onMouseDown={() => {
					isDragging.current = true;
				}}
				className="relative w-1 bg-gray-500 cursor-col-resize hover:bg-gray-400 transition-colors "
			>
				<span className="absolute -left-[5px] top-[30%] rounded-[1px] bg-slate-700 py-2">
					<ChevronsLeftRight size={14} color="white" />
				</span>
			</button>
			{/* Right Panel */}
			<div
				style={{ width: `${100 - dividerPos}%` }}
				className="overflow-y-auto p-6"
			>
				{rightContent}
			</div>
		</div>
	);
}
