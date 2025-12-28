import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Footer() {
	const [open, setOpen] = useState<string | null>(null);

	const toggle = (key: string) => {
		setOpen(open === key ? null : key);
	};

	return (
		<footer className="bg-[#0D2E3D] text-white py-10 md:py-16">
			<div className="container mx-auto px-4 md:px-0">
				<div className="flex flex-col md:flex-row justify-between mb-6 lg:mb-12 gap-6 lg:gap-12">
					{/* Logo and Description */}
					<div className="w-full lg:w-[28%] md:px-2">
						<div className="mb-6">
							<img
								src="/Logo@3x.png"
								alt="PrepExcellence"
								className="h-16 w-auto"
							/>
						</div>
						<p className="text-xs md:text-sm text-gray-300 mb-4 leading-relaxed text-justify ">
							Contrary to popular belief, Lorem Ipsum is not simply random text.
							It has roots in a piece of classical Latin literature from 45 BC,
							making it over 2000 years old. Richard McClintock, a Latin
							professor at Hampden-Sydney College in Virginia to popular belief,
							Lorem Ipsum is not simply random text. It has roots in a piece of
							classical Latin.
						</p>
						<p className="text-xs md:text-sm text-gray-300 leading-relaxed text-justify ">
							Contrary to popular belief, Lorem Ipsum is not simply random text.
							It has roots in a piece of classical Latin literature from 45 BC,
							making it over 2000 years old. Richard McClintock.
						</p>
					</div>

					{/* Links Section */}
					{/* Links Section */}
					<div className=" md:w-auto grid md:grid-cols-3 divide-y md:divide-y-0 gap-6 md:gap-16">
						{/* PAGES */}
						<div>
							<button
								onClick={() => toggle("pages")}
								type="button"
								className="flex w-full items-center text-left bg-transparent text-gray-200 justify-between md:block pb-2 md:pb-0"
							>
								<h3 className="text-sm lg:text-lg font-bold mb-0 md:mb-6">
									PAGES
								</h3>
								<ChevronDown
									className={`md:hidden transition-transform ${
										open === "pages" ? "rotate-180" : ""
									}`}
								/>
							</button>

							<ul
								className={`space-y-3 pt-3 md:pt-0 ${
									open === "pages" ? "block" : "hidden"
								} md:block`}
							>
								<Link
									to="/"
									className="text-sm text-gray-300 hover:text-white block transition-colors"
								>
									Home
								</Link>
								<li>
									<Link
										to="/college-admissions"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										College Admission
									</Link>
								</li>
								<li>
									<Link
										to="/blog"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										Blog
									</Link>
								</li>
								<li>
									<Link
										to="/about-us"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										About Us
									</Link>
								</li>
								<li>
									<Link
										to="/contact-us"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										Contact Us
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										StudeBook
									</Link>
								</li>

								<li>
									<Link
										to="/question-bank"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										Question Bank
									</Link>
								</li>
							</ul>
						</div>

						{/* USEFUL LINKS */}
						<div>
							<button
								onClick={() => toggle("useful")}
								type="button"
								className="flex w-full items-center text-left bg-transparent text-gray-200  justify-between md:block pb-2 md:pb-0"
							>
								<h3 className="text-sm md:text-lg font-bold mb-0 md:mb-6">
									USEFUL LINKS
								</h3>
								<ChevronDown
									className={`md:hidden transition-transform ${
										open === "useful" ? "rotate-180" : ""
									}`}
								/>
							</button>

							<ul
								className={`space-y-3 pt-3 md:pt-0 ${
									open === "useful" ? "block" : "hidden"
								} md:block`}
							>
								<Link
									to="/terms-of-service"
									className="text-sm text-gray-300 hover:text-white block transition-colors"
								>
									Terms of Service
								</Link>
								<li>
									<a
										href="/privacy"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										Privacy policy
									</a>
								</li>
								<li>
									<a
										href="/affiliate"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										Become an affiliate partner
									</a>
								</li>
								<Link
									to="/tutor-registration"
									className="text-sm text-gray-300 hover:text-white block transition-colors"
								>
									Become an Instructor
								</Link>
								<li>
									<a
										href="/referral"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										You can earn a up to $200 referral
									</a>
								</li>
							</ul>
						</div>

						{/* FOLLOW US */}
						<div>
							<button
								onClick={() => toggle("follow")}
								type="button"
								className="flex w-full items-center text-left bg-transparent text-gray-200 justify-between md:block pb-2 md:pb-0"
							>
								<h3 className="text-sm md:text-lg font-bold mb-0 md:mb-6">
									FOLLOW US
								</h3>
								<ChevronDown
									className={`md:hidden transition-transform ${
										open === "follow" ? "rotate-180" : ""
									}`}
								/>
							</button>

							<ul
								className={`space-y-3 pt-3 md:pt-0 ${
									open === "follow" ? "block" : "hidden"
								} md:block`}
							>
								<li>
									<a
										href="/"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										Bluesky
									</a>
								</li>
								<li>
									<a
										href="/"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										Facebook
									</a>
								</li>
								<li>
									<a
										href="/"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										Instagram
									</a>
								</li>
								<li>
									<a
										href="/"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										LinkedIn
									</a>
								</li>
								<li>
									<a
										href="/"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										Twitter
									</a>
								</li>
								<li>
									<a
										href="/"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										TikTok
									</a>
								</li>
								<li>
									<a
										href="/"
										className="text-sm text-gray-300 hover:text-white transition-colors"
									>
										YouTube
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-gray-600">
					<p className="text-xs md:px-4 md:text-sm text-gray-300 text-center">
						© Prepexcellence.com 2021-2025. All Rights Reserved
						&nbsp;&nbsp;|&nbsp;&nbsp; SAT® is a registered trademark of the
						College Board. The College Board does not endorse or is not
						affiliated in any way with the owner or any content of this web
						site.
					</p>
				</div>
			</div>
		</footer>
	);
}
