export default function Footer() {
	return (
		<footer className="bg-[#0D2E3D] text-white py-10 md:py-16">
			<div className="container mx-auto px-4 md:px-0">
				<div className="flex flex-col md:flex-row justify-between mb-12">
					{/* Logo and Description */}
					<div className="w-full md:w-[28%] mb-12 md:mb-0">
						<div className="mb-6">
							<img
								src="/Logo@3x.png"
								alt="PrepExcellence"
								className="h-16 w-auto"
							/>
						</div>
						<p className="text-sm text-gray-300 mb-4 leading-relaxed">
							Contrary to popular belief, Lorem Ipsum is not simply random text.
							It has roots in a piece of classical Latin literature from 45 BC,
							making it over 2000 years old. Richard McClintock, a Latin
							professor at Hampden-Sydney College in Virginia to popular belief,
							Lorem Ipsum is not simply random text. It has roots in a piece of
							classical Latin.
						</p>
						<p className="text-sm text-gray-300 leading-relaxed">
							Contrary to popular belief, Lorem Ipsum is not simply random text.
							It has roots in a piece of classical Latin literature from 45 BC,
							making it over 2000 years old. Richard McClintock.
						</p>
					</div>

					{/* Pages */}
					<div className="mb-10 md:mb-0">
						<h3 className="text-lg font-bold mb-6">PAGES</h3>
						<ul className="space-y-3">
							<li>
								<a
									href="/"
									className="text-sm text-gray-300 hover:text-white transition-colors"
								>
									Home
								</a>
							</li>
							<li>
								<a
									href="/college-admissions"
									className="text-sm text-gray-300 hover:text-white transition-colors"
								>
									College Admission
								</a>
							</li>
							<li>
								<a
									href="/blog"
									className="text-sm text-gray-300 hover:text-white transition-colors"
								>
									Blog
								</a>
							</li>
							<li>
								<a
									href="/about"
									className="text-sm text-gray-300 hover:text-white transition-colors"
								>
									About Us
								</a>
							</li>
							<li>
								<a
									href="/contact"
									className="text-sm text-gray-300 hover:text-white transition-colors"
								>
									Contact Us
								</a>
							</li>
							<li>
								<a
									href="/studebook"
									className="text-sm text-gray-300 hover:text-white transition-colors"
								>
									StudeBook
								</a>
							</li>
						</ul>
					</div>

					{/* Useful Links */}
					<div className="mb-10 md:mb-0">
						<h3 className="text-lg font-bold mb-6">USEFUL LINKS</h3>
						<ul className="space-y-3">
							<li>
								<a
									href="/terms"
									className="text-sm text-gray-300 hover:text-white transition-colors"
								>
									Terms of Service
								</a>
							</li>
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
							<li>
								<a
									href="/instructor"
									className="text-sm text-gray-300 hover:text-white transition-colors"
								>
									Become an Instructor
								</a>
							</li>
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

					{/* Follow Us */}
					<div>
						<h3 className="text-lg font-bold mb-6">FOLLOW US</h3>
						<ul className="space-y-3">
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

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-gray-600">
					<p className="text-sm text-gray-300 text-center">
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
