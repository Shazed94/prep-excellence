import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

type CustomPhoneInputProps = InputHTMLAttributes<HTMLInputElement> & {
	value?: string;
	onChange?: (value: string) => void;
};

export function CustomPhoneInput({
	value,
	onChange,
	...props
}: CustomPhoneInputProps) {
	return (
		<div className="bg-white w-full">
			<Input
				{...props}
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				className="border-none min-w-full focus-visible::outline-none"
			/>
		</div>
	);
}
