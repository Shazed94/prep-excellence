import type { TCTutorRegistrationSchema } from "@prepexcellence/shared-validators";
import { useForm } from "react-hook-form";
import { Subtitle } from "../SectionSubtitle";
import { SectionTitle } from "../SectionTitle";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";

export default function TutorRegistrationForm() {
	const subjects = [
		"Math",
		"Science",
		"English",
		"History",
		"Foreign Languages",
		"Computer Science",
		"Art",
		"Music",
		"Other",
	];
	const gradeLevels = [
		"Elementary (K-5)",
		"Middle School (6-8)",
		"High School (9-12)",
		"College/University",
		"Adult Education",
	];
	const daysOfWeek = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];

	const form = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phoneNumber: "",
			gender: "male",
			dateOfBirth: "",
			address: "",
			city: "",
			state: "",
			zipCode: "",
			emergencyContact: "",
			emergencyPhone: "",
			highestDegree: "",
			institution: "",
			graduationYear: "",
			major: "",
			subjects: [],
			gradeLevels: [],
			experience: "",
			teachingStyle: "",
			availability: [],
			hoursPerWeek: "",
			references: "",
			backgroundCheck: false,
			certifications: "",
			languages: "",
			whyTutor: "",
			terms: false,
		},
	});

	const onSubmit = (data: TCTutorRegistrationSchema) => {
		console.log(data);
		alert("Form submitted successfully! Check console for data.");
	};

	return (
		<div className="py-12 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-8">
					<SectionTitle accentClassName="left-1/2 transform -translate-x-1/2">
						{" "}
						Tutor Registration{" "}
					</SectionTitle>
					<Subtitle>
						{" "}
						Create your account to access powerful teaching tools, manage
						student sessions, track performance, and build a successful tutoring
						profile—all in one place.{" "}
					</Subtitle>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{/* Personal Information */}
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] font-medium mb-2">
												{" "}
												For which exam you are registering [Please select ALL
												that apply]*{" "}
											</FormLabel>
											<FormControl>
												<Input
													className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
														form.formState.errors.firstName
															? "border-red-300"
															: "border-gray-200"
													}`}
													placeholder="Enter your first name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] font-medium mb-2">
												{" "}
												Last Name*{" "}
											</FormLabel>
											<FormControl>
												<Input
													className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
														form.formState.errors.lastName
															? "border-red-300"
															: "border-gray-200"
													}`}
													placeholder="Enter your last name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Email Address*{" "}
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.email
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Enter your email address"
												type="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Phone Number*{" "}
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.phoneNumber
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
							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Gender*{" "}
										</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="flex gap-4"
											>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="male" />
													<label htmlFor="male" className="text-[14px]">
														{" "}
														Male{" "}
													</label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="female" />
													<label htmlFor="female" className="text-[14px]">
														{" "}
														Female{" "}
													</label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="other" />
													<label htmlFor="other" className="text-[14px]">
														{" "}
														Other{" "}
													</label>
												</div>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dateOfBirth"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Date of Birth*{" "}
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.dateOfBirth
														? "border-red-300"
														: "border-gray-200"
												}`}
												type="date"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* Address Information */}
						<div className="space-y-6">
							<h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
								{" "}
								Address Information{" "}
							</h2>
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Street Address*{" "}
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.address
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Enter your street address"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<FormField
									control={form.control}
									name="city"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] font-medium mb-2">
												{" "}
												City*{" "}
											</FormLabel>
											<FormControl>
												<Input
													className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
														form.formState.errors.city
															? "border-red-300"
															: "border-gray-200"
													}`}
													placeholder="City"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="state"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] font-medium mb-2">
												{" "}
												State*{" "}
											</FormLabel>
											<FormControl>
												<Input
													className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
														form.formState.errors.state
															? "border-red-300"
															: "border-gray-200"
													}`}
													placeholder="State"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="zipCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] font-medium mb-2">
												{" "}
												ZIP Code*{" "}
											</FormLabel>
											<FormControl>
												<Input
													className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
														form.formState.errors.zipCode
															? "border-red-300"
															: "border-gray-200"
													}`}
													placeholder="ZIP"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						{/* Emergency Contact */}
						<div className="space-y-6">
							<h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
								{" "}
								Emergency Contact{" "}
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="emergencyContact"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] font-medium mb-2">
												{" "}
												Contact Name*{" "}
											</FormLabel>
											<FormControl>
												<Input
													className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
														form.formState.errors.emergencyContact
															? "border-red-300"
															: "border-gray-200"
													}`}
													placeholder="Emergency contact name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="emergencyPhone"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] font-medium mb-2">
												{" "}
												Contact Phone*{" "}
											</FormLabel>
											<FormControl>
												<Input
													className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
														form.formState.errors.emergencyPhone
															? "border-red-300"
															: "border-gray-200"
													}`}
													placeholder="Emergency contact phone"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						{/* Educational Background */}
						<div className="space-y-6">
							<h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
								{" "}
								Educational Background{" "}
							</h2>
							<FormField
								control={form.control}
								name="highestDegree"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Highest Degree*{" "}
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.highestDegree
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="e.g., Bachelor's, Master's, PhD"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="institution"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Institution Name*{" "}
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.institution
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Name of university/college"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="graduationYear"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] font-medium mb-2">
												{" "}
												Graduation Year*{" "}
											</FormLabel>
											<FormControl>
												<Input
													className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
														form.formState.errors.graduationYear
															? "border-red-300"
															: "border-gray-200"
													}`}
													placeholder="Year"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="major"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] font-medium mb-2">
												{" "}
												Major/Field of Study*{" "}
											</FormLabel>
											<FormControl>
												<Input
													className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
														form.formState.errors.major
															? "border-red-300"
															: "border-gray-200"
													}`}
													placeholder="Your major"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="certifications"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Certifications (Optional){" "}
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]`}
												placeholder="Teaching certifications, licenses, etc."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* Teaching Qualifications */}
						<div className="space-y-6">
							<h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
								{" "}
								Teaching Qualifications{" "}
							</h2>
							<FormField
								control={form.control}
								name="subjects"
								render={() => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Subjects You Can Teach*{" "}
										</FormLabel>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											{subjects.map((subject) => (
												<FormField
													key={subject}
													control={form.control}
													name="subjects"
													render={({ field }) => {
														return (
															<FormItem
																key={subject}
																className="flex flex-row items-start space-x-3 space-y-0"
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(subject)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						subject,
																					])
																				: field.onChange(
																						field.value?.filter(
																							(value) => value !== subject,
																						),
																					);
																		}}
																	/>
																</FormControl>
																<FormLabel className="font-normal text-[14px]">
																	{" "}
																	{subject}{" "}
																</FormLabel>
															</FormItem>
														);
													}}
												/>
											))}
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="gradeLevels"
								render={() => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Grade Levels*{" "}
										</FormLabel>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{gradeLevels.map((level) => (
												<FormField
													key={level}
													control={form.control}
													name="gradeLevels"
													render={({ field }) => {
														return (
															<FormItem
																key={level}
																className="flex flex-row items-start space-x-3 space-y-0"
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(level)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						level,
																					])
																				: field.onChange(
																						field.value?.filter(
																							(value) => value !== level,
																						),
																					);
																		}}
																	/>
																</FormControl>
																<FormLabel className="font-normal text-[14px]">
																	{" "}
																	{level}{" "}
																</FormLabel>
															</FormItem>
														);
													}}
												/>
											))}
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="experience"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Teaching/Tutoring Experience*{" "}
										</FormLabel>
										<FormControl>
											<Textarea
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-3xl min-h-[120px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.experience
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Describe your teaching or tutoring experience"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="teachingStyle"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Teaching Style*{" "}
										</FormLabel>
										<FormControl>
											<Textarea
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-3xl min-h-[120px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.teachingStyle
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Describe your approach to teaching"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="languages"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Languages Spoken*{" "}
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.languages
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="e.g., English (fluent), Spanish (intermediate)"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* Availability */}
						<div className="space-y-6">
							<h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
								{" "}
								Availability{" "}
							</h2>
							<FormField
								control={form.control}
								name="availability"
								render={() => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Days Available*{" "}
										</FormLabel>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											{daysOfWeek.map((day) => (
												<FormField
													key={day}
													control={form.control}
													name="availability"
													render={({ field }) => {
														return (
															<FormItem
																key={day}
																className="flex flex-row items-start space-x-3 space-y-0"
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(day)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([...field.value, day])
																				: field.onChange(
																						field.value?.filter(
																							(value) => value !== day,
																						),
																					);
																		}}
																	/>
																</FormControl>
																<FormLabel className="font-normal text-[14px]">
																	{day}
																</FormLabel>
															</FormItem>
														);
													}}
												/>
											))}
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="hoursPerWeek"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Hours Available Per Week*{" "}
										</FormLabel>
										<FormControl>
											<Input
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.hoursPerWeek
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="e.g., 10-20"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* Additional Information */}
						<div className="space-y-6">
							<h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
								{" "}
								Additional Information{" "}
							</h2>
							<FormField
								control={form.control}
								name="references"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Professional References*{" "}
										</FormLabel>
										<FormControl>
											<Textarea
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-3xl min-h-[120px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.references
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Provide at least two references with contact info"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="whyTutor"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-[16px] font-medium mb-2">
											{" "}
											Why do you want to tutor?*{" "}
										</FormLabel>
										<FormControl>
											<Textarea
												className={`bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-3xl min-h-[120px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] ${
													form.formState.errors.whyTutor
														? "border-red-300"
														: "border-gray-200"
												}`}
												placeholder="Share your motivation"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="backgroundCheck"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel className="font-normal text-[14px]">
											I consent to a background check*
										</FormLabel>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="terms"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel className="font-normal text-[14px]">
											I agree to the terms and conditions*
										</FormLabel>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* Submit Button */}
						<div className="flex justify-center pt-4">
							<Button
								type="submit"
								className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-3 text-lg font-medium"
							>
								Submit Application
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
