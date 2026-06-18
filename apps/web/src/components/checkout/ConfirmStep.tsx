import { useNavigate } from "@tanstack/react-router";

export function ConfirmStep({
	name,
	email,
	total,
}: {
	name: string;
	email: string;
	total: number;
}) {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] px-6 pb-12 text-center">
			<img src="/order-complete.png" alt="" className="size-32 mb-5" />
			<h1 className="text-[32px] md:text-[48px] leading-[38px] md:leading-14 -tracking-[2px] text-[#141B34] font-semibold mb-4">
				Thank you {name}, your order
				<br />
				has been placed successfully
			</h1>
			<p className="p text-[#676764]! mb-2">
				Total paid:{" "}
				<strong className="text-[#141511]">${total.toFixed(2)}</strong>
			</p>
			<p className="p text-[#676764]! mb-8">
				We will send the latest information and updates about your order to
				<br />
				<strong className="text-[#141511]">{email}</strong>
			</p>
			<button
				type="button"
				onClick={() => navigate({ to: "/dashboard/student/my-course" })}
				className="px-8 py-3.5 gradient text-white font-semibold rounded-lg transition-colors text-sm"
			>
				Continue to Dashboard
			</button>
		</div>
	);
}
