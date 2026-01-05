import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "../ui/popover";

export function DirectionsPopover({ activeModule }: { activeModule: any }) {
	const [open, setOpen] = useState(true);

	console.log("activeModule", activeModule);

	return (
		<Popover open={open} onOpenChange={setOpen} modal={true}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="text-slate-800 group flex items-center gap-1 text-sm font-medium"
				>
					Directions
					<ChevronDown
						className="
          w-4 h-4
          transition-transform duration-200
          group-data-[state=open]:rotate-180
        "
					/>
				</button>
			</PopoverTrigger>

			{open && (
				<button
					type="button"
					className="fixed inset-0 top-20 bg-black/30 z-40"
					onClick={() => setOpen(false)}
				/>
			)}

			<PopoverContent
				side="bottom"
				align="start"
				sideOffset={20}
				className="z-50 w-[520px] max-h-[70vh] bg-white shadow-xl overflow-hidden flex flex-col"
			>
				<span
					className="absolute -top-4 left-6
                      w-0 h-0
                      border-l-[19px] border-l-transparent
                      border-r-[19px] border-r-transparent
                      border-b-[19px] border-b-white
  "
				/>

				{/* Content */}
				<div className="overflow-y-auto px-6 py-4 space-y-4 text-sm text-gray-700">
					{parse(DOMPurify.sanitize(activeModule?.module?.direction || ""))}
				</div>

				{/* Footer */}
				<div className="border-t px-6 py-3 flex justify-center">
					<PopoverClose asChild>
						<button
							type="button"
							className="px-6 py-2 bg-yellow-400 rounded-full font-bold hover:bg-yellow-500"
						>
							Close
						</button>
					</PopoverClose>
				</div>
			</PopoverContent>
		</Popover>
	);
}
