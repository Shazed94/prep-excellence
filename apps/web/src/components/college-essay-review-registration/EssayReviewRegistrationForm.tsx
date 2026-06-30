import { useId } from "react";

export default function EssayReviewRegistrationForm() {
	const id = useId();
	return (
		<section className="py-6">
			<div className="container mx-auto px-4">
				<form className="space-y-4">
					<div>
						<label htmlFor={`${id}-name`} className="block text-sm font-medium">
							Full name
						</label>
						<input
							id={`${id}-name`}
							className="mt-1 block w-full border rounded p-2"
						/>
					</div>
					<div>
						<label
							htmlFor={`${id}-email`}
							className="block text-sm font-medium"
						>
							Email
						</label>
						<input
							id={`${id}-email`}
							className="mt-1 block w-full border rounded p-2"
						/>
					</div>
					<button
						type="submit"
						className="px-4 py-2 bg-primary text-white rounded"
					>
						Submit
					</button>
				</form>
			</div>
		</section>
	);
}
