import type React from "react";
import { useState } from "react";

export default function SATStrategyCTA() {
	const [email, setEmail] = useState("");

	const handleSubmit = () => {
		if (email?.includes("@")) {
			console.log("Email submitted:", email);
			alert("Thank you for signing up!");
			setEmail("");
		} else {
			alert("Please enter a valid email address");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	return (
		<section className="bg-[#D9E6ED]/40 py-20">
			<div className="container mx-auto px-6">
				<div className="relative max-w-7xl mx-auto">
					{/* MAIN FLEX WRAPPER */}
					<div className="flex flex-col lg:flex-row items-center overflow-visible relative">
						{/* LEFT BLUE SECTION */}
						<div
							className="bg-primary-dark text-white p-8 md:p-12 
              w-full lg:w-[65%] my-6 
              flex flex-col justify-center rounded-xl 
              relative z-20 
              lg:-mr-20 lg:pl-10"
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
							<div className="flex flex-col sm:flex-row gap-3 bg-white rounded-md">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder="Your mail here"
									className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none"
								/>

								<button
									type="button"
									onClick={handleSubmit}
									className="bg-[#ff8c42] hover:bg-[#e67a32] 
                  text-white font-semibold px-8 py-3 m-1.5 
                  rounded-lg transition-colors duration-200 whitespace-nowrap"
								>
									Sign Up
								</button>
							</div>
						</div>

						{/* RIGHT IMAGE SECTION */}
						<div className="w-full lg:w-1/2 ms-auto min-h-[250px] relative z-10">
							<img
								src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
								alt="Happy students studying together"
								className="w-full h-full object-cover aspect-square rounded-xl"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
