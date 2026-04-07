import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TNewsletterSubscription,
	ZNewsletterSubscription,
} from "@prepexcellence/shared-validators";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePostNewsletter } from "@/hooks/content-management";
import { fadeLeft, fadeRight, viewportOnce } from "@/lib/animations";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export default function SATStrategyCTA() {
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
		<section className="bg-[#D9E6ED]/40 py-5 md:py-20">
			<div className="container mx-auto px-4 md:px-0">
				<div className="relative max-w-7xl mx-auto">
					{/* MAIN FLEX WRAPPER */}
					<div className="flex flex-col lg:flex-row items-center overflow-visible relative">
						{/* LEFT BLUE SECTION */}
						<motion.div
							className="bg-primary-dark text-white p-6 md:p-12 
              w-full lg:w-[65%] my-6 
              flex flex-col justify-center rounded-xl 
              relative z-20 
              lg:-mr-20 lg:pl-10"
							variants={fadeLeft}
							initial="hidden"
							whileInView="visible"
							viewport={viewportOnce}
						>
							<h2 className="text-[28px] md:text-4xl font-bold mb-6">
								Get Your <span className="text-[#ff8c42]">Free</span> SAT
								Strategy Guide
							</h2>

							<p className="text-base md:text-[17px] text-white mb-8 leading-relaxed">
								Join our mailing list and unlock immediate access to a free,
								expert-crafted SAT strategy guide. Stay updated with essential
								tips, proven study techniques, upcoming offers, and resources
								designed to help you boost your scores and stay ahead in your
								academic journey.
							</p>

							{/* EMAIL FORM */}
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<div className="flex bg-white sm:flex-row gap-3 rounded-md p-1 ">
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormControl>
														<Input
															placeholder="Your mail here"
															{...field}
															className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 placeholder-gray-500 h-full shadow-none"
														/>
													</FormControl>
												</FormItem>
											)}
										/>

										<Button
											type="submit"
											className="bg-[#ff8c42] hover:bg-[#e67a32] 
                    text-white font-semibold px-6 py-3
                    rounded-lg transition-colors duration-200 whitespace-nowrap"
										>
											Sign Up
										</Button>
									</div>
									<FormField
										control={form.control}
										name="email"
										render={() => (
											<FormItem>
												<FormMessage className="text-white font-medium" />
											</FormItem>
										)}
									/>
								</form>
							</Form>
						</motion.div>

						{/* RIGHT IMAGE SECTION */}
						<motion.div
							className="w-full lg:w-1/2 ms-auto min-h-[250px] relative z-10"
							variants={fadeRight}
							initial="hidden"
							whileInView="visible"
							viewport={viewportOnce}
						>
							<img
								src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
								alt="Happy students studying together"
								className="w-full h-full object-cover aspect-square  rounded-xl"
							/>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
