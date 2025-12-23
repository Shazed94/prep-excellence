"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TCContactUsSchema,
	ZCContactUsSchema,
} from "@prepexcellence/shared-validators";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { toast } from "sonner";
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
import { usePostContactUs } from "@/hooks/content-management";
import { CustomPhoneInput } from "@/utils/CustomPhoneInput";
import { FacebookSVG, LinkedInSVG, TwitterSVG } from "../SvgComponents";

export default function ContactSection() {
	const postContactUs = usePostContactUs();

	const form = useForm<TCContactUsSchema>({
		resolver: zodResolver(ZCContactUsSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			state: "",
			country: "",
			studentGrade: "",
			bestTime: "",
			helpWith: [],
			other: "",
			query: "",
		},
	});

	const onSubmit = (data: TCContactUsSchema) => {
		postContactUs.mutate(data, {
			onSuccess: (res) => {
				toast.success(res.message || "Contact form submitted successfully!");
				form.reset();
			},
			onError: (error: any) => {
				toast.error(
					error.message || "Failed to submit form. Please try again.",
				);
			},
		});
	};

	return (
		<section className="bg-[#FaFAFA] py-10 md:py-16 px-4 mt-5 relative">
			<span className="size-32 rounded-full bg-[#6965EB] blur-[120px] absolute right-3 top-0 z-0" />
			<div className="container mx-auto">
				<div className="flex flex-col md:flex-row gap-5">
					<div className="md:w-[70%] p-2 md:p-12">
						<div className="mb-10">
							<h2 className="text-[20px] md:text-[28px] font-bold mb-2">
								Reach Out to Us
							</h2>
							<p className="text-muted text-[17px]">
								Contact Our Expert Team for Support or Enrollment
							</p>
						</div>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								{/* First Name & Last Name */}
								<div className="grid grid-cols-1  md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-[16px] text-black mb-2 block">
													First Name <span className="text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter your first name here"
														{...field}
														className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
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
												<FormLabel className="text-[16px] text-black mb-2 block">
													Last Name <span className="text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter your last name here"
														{...field}
														className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Email & Phone */}
								<div className="grid grid-cols-1  md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-[16px] text-black mb-2 block">
													Email <span className="text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="Enter your email address here"
														{...field}
														className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
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
												<FormLabel className="text-[16px] text-black mb-2 block">
													Phone <span className="text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<div className="bg-white">
														<PhoneInput
															countrySelectProps={{ unicodeFlags: true }}
															international
															defaultCountry="BD"
															placeholder="Enter phone number"
															value={field.value}
															onChange={field.onChange}
															inputComponent={CustomPhoneInput}
															className="bg-white w-full shadow-none"
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* State & Country */}
								<div className="grid grid-cols-1  md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="state"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-[16px] text-black mb-2 block">
													State/Region{" "}
													<span className="text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter your state or region here"
														{...field}
														className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
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
												<FormLabel className="text-[16px] text-black mb-2 block">
													Country <span className="text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter your country here"
														{...field}
														className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Student Grade & Best Time */}
								<div className="grid grid-cols-1  md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="studentGrade"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-[16px] text-black mb-2 block">
													Student Grade (2020-21){" "}
													<span className="text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter your grade here"
														{...field}
														className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="bestTime"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-[16px] text-black mb-2 block">
													The Best Days and Time to Call You{" "}
													<span className="text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter days and time"
														{...field}
														className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Help With Checkboxes */}
								<FormField
									control={form.control}
									name="helpWith"
									render={() => (
										<FormItem>
											<FormLabel className="text-[16px] text-black mb-3 block">
												What Do You Need Help With?
											</FormLabel>
											<div className="grid grid-cols-2 gap-x-8 gap-y-3">
												{[
													{ id: "sat", label: "SAT/ACT/Test Prep" },
													{ id: "tutoring", label: "Tutoring" },
													{ id: "coding", label: "Coding class" },
													{ id: "college", label: "College Application" },
												].map((item) => (
													<FormField
														key={item.id}
														control={form.control}
														name="helpWith"
														render={({ field }) => {
															return (
																<FormItem className="flex items-center space-x-3 space-y-0">
																	<FormControl>
																		<Checkbox
																			checked={field.value?.includes(
																				item.label,
																			)}
																			onCheckedChange={(checked) => {
																				return checked
																					? field.onChange([
																							...(field.value ?? ""),
																							item.label,
																						])
																					: field.onChange(
																							field.value?.filter(
																								(value) => value !== item.label,
																							),
																						);
																			}}
																			className="border-[#ccc]"
																		/>
																	</FormControl>
																	<FormLabel className="text-[14px] font-normal cursor-pointer text-[#333]">
																		{item.label}
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

								{/* Other */}
								<FormField
									control={form.control}
									name="other"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] text-black mb-2 block">
												Other
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Query */}
								<FormField
									control={form.control}
									name="query"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[16px] text-black mb-2 block">
												How May We Help You?{" "}
												<span className="text-destructive">*</span>
											</FormLabel>
											<FormControl>
												{/* <Textarea
													placeholder="Enter your query"
													{...field}
													className="min-h-[120px] bg-white border-[#e0e0e0] rounded-md px-4 py-3 text-[14px] placeholder:text-[#999] resize-none"
												/> */}
												<Input
													placeholder="Enter days and time"
													{...field}
													className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-full h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex justify-center md:justify-start">
									<Button
										type="submit"
										className="bg-[#0891b2] hover:bg-[#0e7490] text-white h-11 px-8 rounded-md text-[15px] font-medium"
										disabled={postContactUs.isPending}
									>
										{postContactUs.isPending ? "Submitting..." : "Submit"}
									</Button>
								</div>
							</form>
						</Form>
					</div>

					{/* Contact Info Sidebar - unchanged */}
					<div className="flex-1 bg-primary-dark text-white p-10 flex flex-col">
						<div className="max-w-6xl mx-auto ">
							<div className="mb-12">
								<h2 className="text-[21px] md:text-[28px] font-semibold mb-4">
									Contact Info
								</h2>
								<p className="text-[12px] md:text-[17px] mb-8 ">
									Contact us using the information below to speak with an
									enrollment specialist or support team member.
								</p>

								<div className="space-y-5">
									<div className="flex items-start">
										<MapPin className="w-5 h-5 mr-4 mt-0.5 " />
										<div className="text-sm">
											645 Broad St, Suite 18, Clifton, NJ 07013
										</div>
									</div>

									<div className="flex items-start">
										<Phone className="w-5 h-5 mr-4 mt-0.5 " />
										<div className="text-sm">
											+1 (214) 503-2254
											<br />
											or +1 (848) 448-3331
										</div>
									</div>

									<div className="flex items-start">
										<Mail className="w-5 h-5 mr-4 mt-0.5 " />
										<div className="text-sm">info@prepexcellence.com</div>
									</div>
								</div>

								<div className="mt-10">
									<h3 className="text-lg font-semibold mb-4">Follow Us</h3>
									<div className="flex gap-3">
										<a
											href="/"
											className="w-9 h-9 bg-white text-blue-600 rounded-full flex items-center justify-center hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
											aria-label="Instagram"
										>
											<Instagram className="w-4 h-4" />
										</a>
										<a
											href="/"
											className="w-9 h-9 bg-white text-blue-600 rounded-full flex items-center justify-center hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
											aria-label="Facebook"
										>
											<FacebookSVG />
										</a>
										<a
											href="/"
											className="w-9 h-9 bg-white text-blue-600 rounded-full flex items-center justify-center hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
											aria-label="Twitter"
										>
											<TwitterSVG />
										</a>
										<a
											href="/"
											className="w-9 h-9 bg-white text-blue-600 rounded-full flex items-center justify-center hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
											aria-label="Pinterest"
										>
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<title>abc</title>
												<path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
											</svg>
										</a>
										<a
											href="/"
											className="w-9 h-9 bg-white text-blue-600 rounded-full flex items-center justify-center hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
											aria-label="LinkedIn"
										>
											<LinkedInSVG />
										</a>
									</div>
								</div>
							</div>

							<div className="w-full h-96">
								<iframe
									src="https://www.openstreetmap.org/export/embed.html?bbox=-74.1680,40.8450,-74.1280,40.8750&layer=mapnik&marker=40.8600,-74.1480"
									className="w-full h-full border-0"
									allowFullScreen
									loading="lazy"
									title="Location Map"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
