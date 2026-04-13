import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TNewsletterSubscription,
	ZNewsletterSubscription,
} from "@prepexcellence/shared-validators";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, PhoneCall, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePostNewsletter } from "@/hooks/content-management";
import { FacebookSVG, LinkedInSVG, PinterestSVG } from "./SvgComponents";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
export default function FooterTwo() {
	const mutation = usePostNewsletter();

	const form = useForm<TNewsletterSubscription>({
		resolver: zodResolver(ZNewsletterSubscription),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = (data: TNewsletterSubscription) => {
		mutation.mutate(data, {
			onSuccess: (response) => {
				toast.success(
					response.data.message || "Successfully subscribed to newsletter!",
				);
				form.reset();
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	};

	return (
		<div className="bg-[#141B34] px-4 lg:px-0 relative">
			<div className="container mx-auto z-10 relative">
				{/* CTA Bar */}
				<div className="pt-8">
					<div className="bg-white rounded-xl p-8 sm:p-6  lg:p-8  flex flex-col md:flex-row items-center justify-between ">
						<div className="w-full">
							<div className="flex items-center gap-2 text-[#141B34] text-sm font-medium mb-2">
								<span className="w-2 h-2 rounded-full bg-primary inline-block" />
								Make the move
							</div>
							<h3 className="h3 font-medium! mb-0!">
								Start improving your <br className="hidden md:block" />
								SAT score today
							</h3>
						</div>
						<div className="max-w-[452px] w-full ">
							<p className="p -tracking-[1px]!">
								Choose a program, book a consultation, or start with a free
								seminar. Take the first step with clarity and confidence.
							</p>
							<div className="flex gap-3 flex-wrap">
								<Link to="/college-admissions" className="h-[48px] flex-1">
									<Button variant={"gradient"} className="h-full w-full">
										Explore SAT Programs
									</Button>
								</Link>
								<Link to="/contact-us" className="h-[48px] flex-1">
									<Button variant={"outline"} className="h-full w-full">
										Book a Consultation
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Main Footer */}
				<div className="pt-12 pb-0 px-4 lg:px-0 text-white">
					<div className="grid grid-cols-1 md:grid-cols-[220px_1fr_1fr_1fr] gap-5 lg:gap-10">
						{/* Logo + Contact */}
						<div>
							<img
								src="/logo-white.png"
								alt="PrepExcellence"
								className="h-[70px] w-auto mb-4"
							/>
							<div className="flex flex-col gap-3 mt-4 font-inter">
								<div className="flex items-start gap-2 text-[12px] leading-[18px] -tracking-[0.64px]">
									<Mail className="w-4 h-4 mt-0.5 shrink-0" />
									<span>info@prepexcellence.com</span>
								</div>
								<div className="flex items-start gap-2 text-[12px] leading-[18px] -tracking-[0.64px]">
									<PhoneCall className="w-4 h-4 mt-0.5 shrink-0" />
									<span>
										+1 (214) 503-2254
										<br />
										or +1 (848) 448-3331
									</span>
								</div>
								<div className="flex items-start gap-2 text-[12px] leading-[18px] -tracking-[0.64px]">
									<MapPin className="w-4 h-4 mt-0.5 shrink-0" />
									<span>
										645 Broad St, Suite 18,
										<br />
										Clifton, NJ 07013
									</span>
								</div>
							</div>
						</div>

						{/* Explore */}
						<div>
							<h3 className="text-[16px] leading-[22px] -tracking-[0.5px] font-semibold font-inter mb-6 ">
								Explore
							</h3>
							<ul className="space-y-3">
								{[
									{ label: "SAT Courses", to: "/college-admissions" },
									{ label: "Seminars", to: "/college-admissions" },
									{ label: "Careers", to: "/about-us" },
									{ label: "Blogs", to: "/blog" },
									{ label: "Team", to: "/about-us" },
								].map(({ label, to }) => (
									<li key={label}>
										<Link
											to={to}
											className="text-[16px] leading-[22px] -tracking-[0.5px] text-white font-inter transition-colors"
										>
											{label}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Supports */}
						<div>
							<h3 className="text-[16px] leading-[22px] -tracking-[0.5px] font-semibold font-inter mb-6 ">
								Supports
							</h3>
							<ul className="space-y-3">
								{[
									{ label: "Privacy Policy", to: "/privacy-policy" },
									{ label: "Terms & Conditions", to: "/terms-of-service" },
									{ label: "FAQs", to: "/contact-us" },
									{ label: "Contact", to: "/contact-us" },
								].map(({ label, to }) => (
									<li key={label}>
										<Link
											to={to}
											className="text-[16px] leading-[22px] -tracking-[0.5px] text-white font-inter"
										>
											{label}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Newsletter + Social */}
						<div>
							<h3 className="text-[16px] leading-[22px] -tracking-[0.5px] font-semibold font-inter mb-6">
								Subscribe Newsletter
							</h3>
							<div className=" mb-6">
								{/* EMAIL FORM */}
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className=" w-full "
									>
										<div className="relative w-full bg-white rounded-md">
											<FormField
												control={form.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input
																placeholder="youremailhere@yourmail.com"
																{...field}
																className="pr-12 h-12 text-gray-800 placeholder-gray-500 placeholder:text-sm"
															/>
														</FormControl>
													</FormItem>
												)}
											/>

											<Button
												type="submit"
												size="icon"
												className="group bg-transparent absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 cursor-pointer transition-all duration-300"
											>
												<Send className="h-5 w-5 text-primary group-hover:text-white" />
											</Button>
										</div>
										<FormField
											control={form.control}
											name="email"
											render={() => (
												<FormItem className="bg-[#141B34]!">
													<FormMessage className="text-red-500 font-medium" />
												</FormItem>
											)}
										/>
									</form>
								</Form>
							</div>

							<h3 className="text-[16px] leading-[22px] -tracking-[0.5px] font-semibold font-inter mb-4">
								Find on Social Media
							</h3>
							<div className="flex gap-2.5">
								<a
									href="https://www.facebook.com/prepexcellence"
									target="_blank"
									rel="noopener noreferrer"
								>
									<FacebookSVG />
								</a>
								<a
									href="https://www.pinterest.com/prepexcellence"
									target="_blank"
									rel="noopener noreferrer"
								>
									<PinterestSVG />
								</a>
								<a
									href="https://www.linkedin.com/company/prepexcellence/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<LinkedInSVG />
								</a>
							</div>
						</div>
					</div>

					{/* Bottom Bar */}
					<div className="border-t border-white/10 mt-10 py-6 flex flex-col md:flex-row justify-between gap-3">
						<p className="text-[16px] leading-[22px] -tracking-[0.5px]  font-inter text-[#7B7B7B] ">
							© Prepexcellence.com 2021-2026.
							<br /> All Rights Reserved
						</p>
						<p className="text-[16px] leading-[22px] -tracking-[0.5px]  font-inter text-[#7B7B7B]  md:text-right max-w-[600px]">
							SAT® is a registered trademark of the College Board. The College
							Board does not endorse or is not affiliated in any way with the
							owner or any content of this web site.
						</p>
					</div>
				</div>
			</div>
			<img
				src="home/footer-grid-bg.png"
				alt=""
				className="absolute inset-0 w-full h-full object-cover z-0"
			/>
		</div>
	);
}
