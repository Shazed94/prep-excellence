export function PasswordStrengthBar({ password }: { password: string }) {
	const strength =
		password.length === 0
			? 0
			: password.length < 6
				? 1
				: password.length < 10
					? 2
					: 3;
	const colors = ["bg-gray-200", "bg-red-400", "bg-yellow-400", "bg-green-500"];
	return (
		<div className="mt-1.5">
			<div className="flex gap-1.5 mb-1">
				{[1, 2, 3].map((level) => (
					<div
						key={level}
						className={`flex-1 h-1 rounded-full transition-colors ${
							strength >= level ? colors[strength] : "bg-gray-200"
						}`}
					/>
				))}
			</div>
			<p className="text-xs text-gray-400">
				At least 1 number, 8 characters, 1 symbol
			</p>
		</div>
	);
}
