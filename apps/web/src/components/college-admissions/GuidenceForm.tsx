import { Subtitle } from "../SectionSubtitle";
import { SectionTitle } from "../SectionTitle";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export default function GuidenceForm() {
	return (
		<section className="container mx-auto px-4 py-16">
			<div className="max-w-4xl mx-auto">
				{/* Form Header */}
				<div className="text-center mb-12">
					<SectionTitle accentClassName="left-1/2 -translate-x-1/2">
						Expert Guidance for Your College Journey
					</SectionTitle>
					<Subtitle>
						Get personalized guidance from our experts to plan your SAT prep,
						choose the right courses, and build a winning college admission
						strategy.
					</Subtitle>
				</div>

				{/* Form */}
				<form className="space-y-6">
					{/* Row 1: First Name & Last Name */}
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								First Name<span className="text-red-500">*</span>
							</Label>
							<Input
								placeholder="Enter your first name here"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
							/>
						</div>
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								Last Name
							</Label>
							<Input
								placeholder="Enter your last name here"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
							/>
						</div>
					</div>

					{/* Row 2: Email & Phone */}
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								Email<span className="text-red-500">*</span>
							</Label>
							<Input
								type="email"
								placeholder="Enter your email here"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
							/>
						</div>
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								Phone<span className="text-red-500">*</span>
							</Label>
							<Input
								type="tel"
								placeholder="Enter your phone number here"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
							/>
						</div>
					</div>

					{/* Row 3: State/Region & Country */}
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								State/Region<span className="text-red-500">*</span>
							</Label>
							<Input
								placeholder="Enter your state/region here"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
							/>
						</div>
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								Country<span className="text-red-500">*</span>
							</Label>
							<Input
								placeholder="Enter your country here"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
							/>
						</div>
					</div>

					{/* Row 4: Student Grade & GPA */}
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								Student Grade (2020-21) <span className="text-red-500">*</span>
							</Label>
							<Input
								placeholder="Enter your grade"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
							/>
						</div>
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								GPA <span className="text-red-500">*</span>
							</Label>
							<Input
								placeholder="Enter your GPA"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
							/>
						</div>
					</div>

					{/* Row 5: SAT/ACT Dropdown & Score */}
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								Has the student taken the SAT/ACT{" "}
								<span className="text-red-500">*</span>
							</Label>
							<Select>
								<SelectTrigger className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px]">
									<SelectValue placeholder="Yes" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="yes">Yes</SelectItem>
									<SelectItem value="no">No</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								SAT/ACT Score (if not taken, enter N/A){" "}
								<span className="text-red-500">*</span>
							</Label>
							<Input
								placeholder="Enter your SAT score if taken"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
							/>
						</div>
					</div>

					{/* Row 6: Extracurricular Activities & Target Colleges */}
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								What are the extracurricular activities of the student? Please
								let us know if the student is highly ranked and/or has won
								awards. <span className="text-red-500">*</span>
							</Label>
							<Textarea
								placeholder="Your extracurricular activities here"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-2xl min-h-[100px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] resize-none"
							/>
						</div>
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								Which universities would you like your child to be admitted
								into? Please start with the dream college.{" "}
								<span className="text-red-500">*</span>
							</Label>
							<Textarea
								placeholder="Your targeted college name"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-2xl min-h-[100px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] resize-none"
							/>
						</div>
					</div>

					{/* Row 7: Questions & Child Description */}
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								What are your questions about College Admissions?{" "}
								<span className="text-red-500">*</span>
							</Label>
							<Textarea
								placeholder="Ask any question"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-2xl min-h-[100px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] resize-none"
							/>
						</div>
						<div>
							<Label className="text-sm font-medium text-gray-900 mb-2 block">
								Briefly tell us about your child (including strengths,
								interests, etc.) <span className="text-red-500">*</span>
							</Label>
							<Textarea
								placeholder="Write about your child"
								className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-2xl min-h-[100px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] resize-none"
							/>
						</div>
					</div>

					{/* Submit Button */}
					<div className="flex justify-center pt-4">
						<Button
							type="submit"
							className="bg-primary-dark hover:bg-primary-dark/90 text-white px-12 h-12 rounded-md text-base font-medium cursor-pointer"
						>
							Submit
						</Button>
					</div>
				</form>
			</div>
		</section>
	);
}
