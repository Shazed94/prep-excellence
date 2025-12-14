import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TCFreeSeminarForm,
	type TCFreeSeminarFormInput,
	ZCFreeSeminarFormInput,
} from "@prepexcellence/shared-validators";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { usePostFreeSeminar } from "@/hooks/content-management";
import { Subtitle } from "../SectionSubtitle";
import { SectionTitle } from "../SectionTitle";

export default function FreeSeminarRegistrationForm() {
	const addMutation = usePostFreeSeminar();
	const form = useForm<TCFreeSeminarFormInput>({
		resolver: zodResolver(ZCFreeSeminarFormInput),
		defaultValues: {
			parentName: "",
			parentPhone: "",
			parentCity: "",
			studentName: "",
			studentEmail: "",
			studentGrade: undefined,
			studentSchool: "",
			targetScore: "",
			dreamColleges: "",
			seminarGoals: "",
			questions: "",
		},
	});

	const handleFormSubmit = (data: TCFreeSeminarFormInput) => {
		const formattedData: TCFreeSeminarForm = {
			...data,
			studentGrade:
				`G${data.studentGrade}` as TCFreeSeminarForm["studentGrade"], // e.g., "8" becomes "G8"
		};
		addMutation.mutate(formattedData, {
			onSuccess: (response) => {
				toast.success(response.message || "Registration successful!");
				form.reset();
			},
			onError: () => {
				toast.error(
					"There was an error submitting your registration. Please try again later.",
				);
			},
		});
	};
	return (
		<section className="py-20 bg-[#D9E6ED]/40">
			<div className="container mx-auto max-w-7xl">
				{/* Header */}
				<div className="text-center mb-8">
					<SectionTitle accentClassName="left-1/2 -translate-x-1/2">
						Register for Our Free Seminar
					</SectionTitle>
					<Subtitle>
						Secure your spot today and gain expert tips, proven strategies, and
						actionable advice to boost your exam performance and college
						readiness.
					</Subtitle>
				</div>

				{/* Form */}
				<Form {...form}>
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8">
							{/* Parent Name */}
							<FormField
								control={form.control}
								name="parentName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Parent Name*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.parentName
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Enter your full name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Student Email */}
							<FormField
								control={form.control}
								name="studentEmail"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Student Email Address (NOT the School Email)*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.studentEmail
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Enter student's email address"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Parent Phone */}
							<FormField
								control={form.control}
								name="parentPhone"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Parent Phone Number*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.parentPhone
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Enter your phone number"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Target Score */}
							<FormField
								control={form.control}
								name="targetScore"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											What is the target SAT/ACT score?*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.targetScore
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Your answer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Parent City and ZIP */}
							<FormField
								control={form.control}
								name="parentCity"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Parent City and ZIP Code*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.parentCity
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Your answer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Dream Colleges */}
							<FormField
								control={form.control}
								name="dreamColleges"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Which colleges is your child applying to? Please start
											with the dream college.*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.dreamColleges
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Your answer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Student Name - Full Width */}
							<FormField
								control={form.control}
								name="studentName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Student Name*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.studentName
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Enter student's full name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Seminar Goals - Textarea */}
							<FormField
								control={form.control}
								name="seminarGoals"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											What do you want to accomplish by attending this seminar?
											(Reply N/A if none.)*
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Your answer"
												className={`bg-white min-h-[100px] resize-none border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-[10px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.seminarGoals
														? "border-red-300"
														: "border-gray-200"
												}`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Student Grade - Radio Buttons */}
							<FormField
								control={form.control}
								name="studentGrade"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Student Grade*
										</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="grid grid-cols-2 gap-4"
											>
												{["7", "8", "9", "10", "11", "12"].map((grade) => (
													<div
														key={grade}
														className="flex items-center space-x-2"
													>
														<RadioGroupItem
															value={grade}
															id={`grade-${grade}`}
															className="bg-white"
														/>
														<label
															htmlFor={`grade-${grade}`}
															className="text-sm font-medium leading-none cursor-pointer"
														>
															{grade}
														</label>
													</div>
												))}
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Questions - Optional Textarea */}
							<FormField
								control={form.control}
								name="questions"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Please submit your questions for the presenter(s)? (Reply
											N/A if none.)*
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Your answer"
												className={`bg-white min-h-[100px] resize-none border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-[10px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.questions
														? "border-red-300"
														: "border-gray-200"
												}`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Student School */}
							<FormField
								control={form.control}
								name="studentSchool"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Student School*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.studentSchool
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Your answer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Submit Button */}
						<div className="flex justify-center pt-4">
							<Button
								onClick={form.handleSubmit(handleFormSubmit)}
								className="bg-primary-dark text-white px-12 py-6 text-lg font-medium"
							>
								Submit
							</Button>
						</div>
					</div>
				</Form>
			</div>
		</section>
	);
}
