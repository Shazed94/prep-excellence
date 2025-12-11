import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TCcollegeEssayReviewSchema,
	ZCCollecgeEssayReviewSchema,
} from "@prepexcellence/shared-validators";
import { useForm } from "react-hook-form";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Subtitle } from "../SectionSubtitle";
import { SectionTitle } from "../SectionTitle";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function EssayReviewRegistrationForm() {
	const form = useForm<TCcollegeEssayReviewSchema>({
		resolver: zodResolver(ZCCollecgeEssayReviewSchema),
		defaultValues: {
			studentName: "",
			parentName: "",
			email: "",
			phone: "",
			grade: "",
			studentEmail: "",
			studentSchool: "",
			studentPhone: "",
			address: "",
			collegeTarget: "",
			satExamDate: "",
			targetScore: "",
			lastSatScore: "",
			referral: "",
			parentQuestion: "",
			accommodationRequest: "",
			paymentDate: "",
			fullName: "",
			agreedToTerms: false,
		},
	});

	const onSubmit = (data: TCcollegeEssayReviewSchema) => {
		console.log("Form submitted:", data);
	};

	const inputClassName =
		"bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]";
	const textareaClassName =
		"bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-2xl text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]";

	return (
		<section className="bg-[#D9E6ED]/40">
			<div className="container mx-auto py-12 md:py-24 px-4">
				<div className="">
					<div className="text-center">
						<SectionTitle accentClassName="left-1/2 -translate-x-1/2">
							Register for College Essay Review
						</SectionTitle>
						<Subtitle>
							Take the first step toward transforming your academic journey by
							securing your spot in our expertly designed programs today.
							Registering now ensures you get early access to structured
							lessons.
						</Subtitle>
					</div>
					<div className="space-y-6">
						<Form {...form}>
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Student Name */}
									<FormField
										control={form.control}
										name="studentName"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">Student Name*</FormLabel>
												<FormControl>
													<Input
														className={inputClassName}
														placeholder="Enter student's name here"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Parent Name */}
									<FormField
										control={form.control}
										name="parentName"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">Parent Name*</FormLabel>
												<FormControl>
													<Input
														className={inputClassName}
														placeholder="Enter parent's name here"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Email */}
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">Email*</FormLabel>
												<FormControl>
													<Input
														type="email"
														className={inputClassName}
														placeholder="Enter your email here"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Phone */}
									<FormField
										control={form.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">Phone*</FormLabel>
												<FormControl>
													<Input
														className={inputClassName}
														placeholder="Enter your phone number here"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Grade */}
									<FormField
										control={form.control}
										name="grade"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">Grade*</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className={inputClassName}>
															<SelectValue placeholder="Choose" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="9">9th Grade</SelectItem>
														<SelectItem value="10">10th Grade</SelectItem>
														<SelectItem value="11">11th Grade</SelectItem>
														<SelectItem value="12">12th Grade</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Student's Email */}
									<FormField
										control={form.control}
										name="studentEmail"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">Student's Email*</FormLabel>
												<FormControl>
													<Input
														type="email"
														className={inputClassName}
														placeholder="Enter student's email"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Student's School */}
									<FormField
										control={form.control}
										name="studentSchool"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">
													Student's School (2025-26)*
												</FormLabel>
												<FormControl>
													<Input
														className={inputClassName}
														placeholder="Enter student's school"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Student's Phone */}
									<FormField
										control={form.control}
										name="studentPhone"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">Student's Phone</FormLabel>
												<FormControl>
													<Input
														className={inputClassName}
														placeholder="Enter student's phone"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Address */}
									<FormField
										control={form.control}
										name="address"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">
													Address, City, and ZIP Code*
												</FormLabel>
												<FormControl>
													<Input
														className={inputClassName}
														placeholder="Enter your address, city and ZIP code"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* College Target */}
									<FormField
										control={form.control}
										name="collegeTarget"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">
													Where will the child apply to college?*
												</FormLabel>
												<FormControl>
													<Input
														className={inputClassName}
														placeholder="Enter student's target college"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* SAT Exam Date */}
									<FormField
										control={form.control}
										name="satExamDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">
													When is the student taking the SAT (if registering for
													SAT course)?
												</FormLabel>
												<FormControl>
													<Input
														className={inputClassName}
														placeholder="Enter student's SAT exam date"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Target SAT Score */}
									<FormField
										control={form.control}
										name="targetScore"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">
													What is the target SAT score (if registering for an
													SAT course)?
												</FormLabel>
												<FormControl>
													<Input
														className={inputClassName}
														placeholder="Enter student's target SAT score"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Last SAT Score */}
								<FormField
									control={form.control}
									name="lastSatScore"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="mb-2">
												What is the last SAT score and the date of the test (if
												the student took the SAT)? (N/A if the student has not
												taken the SAT yet)*
											</FormLabel>
											<FormControl>
												<Input
													className={inputClassName}
													placeholder="Student's last SAT score"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Referral */}
								<FormField
									control={form.control}
									name="referral"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="mb-2">
												If anyone referred you, please enter his/her name,
												phone, and email (N/A if not applicable)*
											</FormLabel>
											<FormControl>
												<Input
													className={inputClassName}
													placeholder="Enter referral's name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Parent Question */}
									<FormField
										control={form.control}
										name="parentQuestion"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">
													Do you have any question or request for the teacher?
													(N/A if no questions)*
												</FormLabel>
												<FormControl>
													<Textarea
														className={textareaClassName}
														placeholder="Your message here"
														rows={4}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Accommodation Request */}
									<FormField
										control={form.control}
										name="accommodationRequest"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="mb-2">
													If your child needs any accommodation (ex: being
													excused from camera ON policy, discrete reminders
													during class, etc.)
												</FormLabel>
												<FormControl>
													<Textarea
														className={textareaClassName}
														placeholder="Your message here"
														rows={4}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Payment Date */}
								<FormField
									control={form.control}
									name="paymentDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="mb-2">
												PAYMENT CONFIRMATION: Please enter approximate date when
												you will pay.*
											</FormLabel>
											<FormControl>
												<Input
													type="date"
													className={inputClassName}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Full Name Signature */}
								<FormField
									control={form.control}
									name="fullName"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="mb-2">
												Please enter your full name below. (Your signature
												indicates that you agreed with the above terms and
												conditions.)
											</FormLabel>
											<FormControl>
												<Input
													className={inputClassName}
													placeholder="Enter your full name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Terms and Conditions */}
								<FormField
									control={form.control}
									name="agreedToTerms"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel className="mb-2">
													I agree with the{" "}
													<span className="text-blue-600 hover:underline cursor-pointer">
														terms and conditions
													</span>{" "}
													including the{" "}
													<span className="text-blue-600 hover:underline cursor-pointer">
														video policy
													</span>
													*
												</FormLabel>
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>

								<Button
									type="button"
									onClick={form.handleSubmit(onSubmit)}
									className="w-full md:w-auto bg-primary-dark px-8 py-3 rounded font-semibold text-white hover:scale-105 transition-all duration-200 cursor-pointer"
								>
									Register
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</section>
	);
}
