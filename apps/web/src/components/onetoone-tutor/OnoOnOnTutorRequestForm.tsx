import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TCTutorRequestRegistrationSchema,
	ZCTutorRequestRegistrationSchema,
} from "@prepexcellence/shared-validators";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Subtitle } from "../SectionSubtitle";
import { SectionTitle } from "../SectionTitle";

export default function TutorRegistrationForm() {
	const form = useForm({
		resolver: zodResolver(ZCTutorRequestRegistrationSchema),
		defaultValues: {
			email: "",
			parentName: "",
			phoneNumber: "",
			address: "",
			studentName: "",
			studentSchool: "",
			studentGrade: "",
			studentPhone: "",
			studentEmail: "",
			needHelp: "",
			studentNeed: "",
			tutorType: [],
			callbackTime: "",
			tutoringDays: "",
			referral: "",
			specificRequest: "",
			fullName: "",
			date: "",
			agreeTerms: false,
		},
	});

	const onSubmit = (data: TCTutorRequestRegistrationSchema) => {
		console.log("Form submitted:", data);
		alert("Form submitted successfully! Check console for data.");
	};

	return (
		<div className="py-12 md:py-24 px-4">
			<div className="container mx-auto ">
				<div className="text-center mb-8">
					<SectionTitle accentClassName="left-1/2 -translate-x-1/2">
						Tutor Request Registration
					</SectionTitle>
					<Subtitle className="max-w-[1080px]">
						Your responses allow us to understand academic needs, scheduling
						preferences, and the type of support you're looking for, so we can
						assign the best tutor available.
					</Subtitle>
				</div>

				<Form {...form}>
					<div className="space-y-6 max-w-7xl mx-auto ">
						<div className="grid md:grid-cols-2 items-start gap-6 md:gap-24 ">
							{/* Email */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Email*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Enter your email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Student Need Summary */}
							<FormField
								control={form.control}
								name="studentNeed"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Please summarize the student's need in the subject. Please
											be detailed as much as possible.*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Please summarize the student's need in the subject"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid md:grid-cols-2 items-start gap-6 md:gap-24">
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
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Enter your full name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Tutor Type Checkboxes */}
							<FormField
								control={form.control}
								name="tutorType"
								render={() => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Please indicate if you are requesting any of the following
											at the applicable higher fees. Availability is not
											guaranteed.*
										</FormLabel>
										<div className="space-y-2">
											<FormField
												control={form.control}
												name="tutorType"
												render={({ field }) => (
													<div className="flex items-center space-x-2">
														<Checkbox
															checked={field.value?.includes("senior")}
															onCheckedChange={(checked) => {
																const value = field.value || [];
																if (checked) {
																	field.onChange([...value, "senior"]);
																} else {
																	field.onChange(
																		value.filter((v) => v !== "senior"),
																	);
																}
															}}
														/>
														<label
															htmlFor="senior"
															className="text-sm text-gray-700"
														>
															Senior/certified academic tutor
														</label>
													</div>
												)}
											/>
											<FormField
												control={form.control}
												name="tutorType"
												render={({ field }) => (
													<div className="flex items-center space-x-2">
														<Checkbox
															checked={field.value?.includes("sat")}
															onCheckedChange={(checked) => {
																const value = field.value || [];
																if (checked) {
																	field.onChange([...value, "sat"]);
																} else {
																	field.onChange(
																		value.filter((v) => v !== "sat"),
																	);
																}
															}}
														/>
														<label
															htmlFor="sat"
															className="text-sm text-gray-700"
														>
															Dr. Alam on an SAT tutor
														</label>
													</div>
												)}
											/>
											<FormField
												control={form.control}
												name="tutorType"
												render={({ field }) => (
													<div className="flex items-center space-x-2">
														<Checkbox
															checked={field.value?.includes("tag")}
															onCheckedChange={(checked) => {
																const value = field.value || [];
																if (checked) {
																	field.onChange([...value, "tag"]);
																} else {
																	field.onChange(
																		value.filter((v) => v !== "tag"),
																	);
																}
															}}
														/>
														<label
															htmlFor="tutorType"
															className="text-sm text-gray-700"
														>
															Senior on TAG Tutor
														</label>
													</div>
												)}
											/>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid md:grid-cols-2 items-start gap-6 md:gap-24">
							{/* Phone Number */}
							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Your Phone Number*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Enter your phone number"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Callback Time */}
							<FormField
								control={form.control}
								name="callbackTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Best time for us to call you back (days & time)*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Your answer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid md:grid-cols-2 items-start gap-6 md:gap-24">
							{/* Address */}
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Your Address, City, and ZIP Code*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Your answer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Tutoring Days */}
							<FormField
								control={form.control}
								name="tutoringDays"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Best days for your child to receive Private Tutoring (days
											& time)*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Your answer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid md:grid-cols-2 items-start gap-6 md:gap-24">
							{/* Student Name */}
							<FormField
								control={form.control}
								name="studentName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Student's Name*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Enter student's name"
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
										<FormLabel className="text-[16px] font-medium mb-2">
											If anyone referred you, please enter his/her name, phone,
											and email (N/A if not applicable)*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Your answer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid md:grid-cols-2 items-start gap-6 md:gap-24">
							{/* Student School */}
							<FormField
								control={form.control}
								name="studentSchool"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Student's School (Name, City, State)*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Your answer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Specific Request */}
							<FormField
								control={form.control}
								name="specificRequest"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Do you have any specific question or request? (N/A if
											none)*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Your answer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid md:grid-cols-2 items-start gap-6 md:gap-24">
							{/* Student Grade */}
							<FormField
								control={form.control}
								name="studentGrade"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Student Grade*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Your answer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Full Name for Signature */}
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Please enter your full name below (Your signature
											indicates that you agreed with the above terms and
											conditions.)*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Enter your full name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid md:grid-cols-2 items-start gap-6 md:gap-24">
							{/* Student Phone */}
							<FormField
								control={form.control}
								name="studentPhone"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Student's Phone Number*
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Enter student's phone number"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Date */}
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											Today's Date
										</FormLabel>
										<FormControl>
											<Input
												type="date"
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid md:grid-cols-2 items-start gap-6 md:gap-24">
							<div className="space-y-14">
								{/* Student Email */}
								<FormField
									control={form.control}
									name="studentEmail"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] font-medium mb-2">
												Student Email Address (DO NOT use the School Email)*
											</FormLabel>
											<FormControl>
												<Input
													className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
													placeholder="Your answer"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Terms Agreement */}
								<FormField
									control={form.control}
									name="agreeTerms"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel className="text-sm text-gray-700">
													I agree with the terms and conditions including the
													video policy*
												</FormLabel>
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>
							</div>

							{/* Need Help */}
							<FormField
								control={form.control}
								name="needHelp"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											I need help with (for example: General Mentoring, Algebra
											I, 8th Grade Science, Geometry, Physics, AP Calculus AB,
											SAT, etc.)*
										</FormLabel>
										<FormControl>
											<Textarea
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-3xl min-h-[100px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] resize-none`}
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
								onClick={form.handleSubmit(onSubmit)}
								className="bg-primary-dark text-white font-semibold px-16 py-6 rounded-sm text-[16px] shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
							>
								Submit
							</Button>
						</div>
					</div>
				</Form>
			</div>
		</div>
	);
}
