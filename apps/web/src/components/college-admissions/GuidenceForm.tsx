import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TCollegeAdmissionsGuidanceForm,
	ZCollegeAdmissionsGuidanceForm,
} from "@prepexcellence/shared-validators";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitCollegeAdmissions } from "@/hooks/college-admissions";
import { Subtitle } from "../SectionSubtitle";
import { SectionTitle } from "../SectionTitle";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";

export default function GuidanceForm() {
	const collegeAdmissionMutation = useSubmitCollegeAdmissions();

	const form = useForm<TCollegeAdmissionsGuidanceForm>({
		resolver: zodResolver(ZCollegeAdmissionsGuidanceForm),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			stateRegion: "",
			country: "",
			studentGrade: "",
			gpa: "",
			takenSATACT: "",
			satActScore: "",
			extracurricular: "",
			targetColleges: "",
			questions: "",
			childDescription: "",
		},
	});

	const onSubmit = (data: TCollegeAdmissionsGuidanceForm) => {
		collegeAdmissionMutation.mutate(data, {
			onSuccess: (response) => {
				toast.success(response?.message || "Form submitted successfully!");
			},
			onError: (error) => {
				toast.error(
					error?.message || "An error occurred while submitting the form.",
				);
			},
		});
	};

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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-6">
							{/* Row 1: First Name & Last Name */}
							<div className="grid md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												First Name<span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your first name here"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
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
											<FormLabel className="text-sm font-medium text-gray-900">
												Last Name
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your last name here"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Row 2: Email & Phone */}
							<div className="grid md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												Email<span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="Enter your email here"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												Phone<span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input
													type="tel"
													placeholder="Enter your phone number here"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Row 3: State/Region & Country */}
							<div className="grid md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="stateRegion"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												State/Region<span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your state/region here"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="country"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												Country<span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your country here"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Row 4: Student Grade & GPA */}
							<div className="grid md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="studentGrade"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												Student Grade (2020-21){" "}
												<span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your grade"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="gpa"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												GPA <span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your GPA"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Row 5: SAT/ACT Dropdown & Score */}
							<div className="grid md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="takenSATACT"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												Has the student taken the SAT/ACT{" "}
												<span className="text-red-500">*</span>
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px]">
														<SelectValue placeholder="Select an option" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="yes">Yes</SelectItem>
													<SelectItem value="no">No</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="satActScore"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												SAT/ACT Score (if not taken, enter N/A){" "}
												<span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your SAT score if taken"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Row 6: Extracurricular Activities & Target Colleges */}
							<div className="grid md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="extracurricular"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												What are the extracurricular activities of the student?
												Please let us know if the student is highly ranked
												and/or has won awards.{" "}
												<span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Your extracurricular activities here"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-2xl min-h-[100px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] resize-none"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="targetColleges"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												Which universities would you like your child to be
												admitted into? Please start with the dream college.{" "}
												<span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Your targeted college name"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-2xl min-h-[100px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] resize-none"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Row 7: Questions & Child Description */}
							<div className="grid md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="questions"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												What are your questions about College Admissions?{" "}
												<span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Ask any question"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-2xl min-h-[100px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] resize-none"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="childDescription"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm font-medium text-gray-900">
												Briefly tell us about your child (including strengths,
												interests, etc.) <span className="text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Write about your child"
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-2xl min-h-[100px] text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F] resize-none"
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
									className="bg-blue-600 hover:bg-blue-700 text-white px-12 h-12 rounded-md text-base font-medium"
								>
									Submit
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</div>
		</section>
	);
}
