import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

export function CheckoutHeader() {
	return (
		<div className="container mx-auto px-4 md:px-0 py-4">
			<div className="flex justify-between items-center">
				<Link to="/" className="flex items-center gap-2">
					<img src="logo.png" alt="" />
				</Link>
				<div className="flex items-center gap-3.5">
					<div className="flex items-center gap-2.5 bg-[#EEFCF5] px-4 md:px-7 py-3.5 rounded-sm">
						<img src="/icons/security-check.png" alt="" />
						<span className="text-[#1BA75C] text-sm md:text-base">
							100% Secure Payment
						</span>
					</div>
					<button
						type="button"
						className="p-1.5 md:p-2.5 border border-[#EBEBEB] rounded-sm cursor-pointer"
					>
						<X />
					</button>
				</div>
			</div>
		</div>
	);
}
