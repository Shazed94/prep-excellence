import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_frontend/privacy-policy")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto px-6 py-12 max-w-4xl">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					Our Commitment to Your Privacy
				</h1>
			</div>

			<div className="space-y-8">
				{/* WHO WE ARE */}
				<section>
					<h2 className="text-2xl font-bold text-primary-dark mb-3">
						WHO WE ARE
					</h2>
					<p className="text-gray-700">
						Our website address is:{" "}
						<a
							href="https://prepexcellence.com"
							className="text-primary-dark hover:underline"
						>
							https://prepexcellence.com
						</a>
					</p>
				</section>

				{/* COMMENTS */}
				<section>
					<h2 className="text-2xl font-bold text-primary-dark mb-2">
						WHAT PERSONAL DATA WE COLLECT AND WHY WE COLLECT IT
					</h2>
					<h3 className="text-xl font-semibold text-primary-dark mb-2">
						COMMENTS
					</h3>
					<p className="text-gray-700 mb-3">
						When visitors leave comments on the site we collect the data shown
						in the comments form, and also the visitor's IP address and browser
						user agent string to help spam detection.
					</p>
					<p className="text-gray-700">
						An anonymized string created from your email address (also called a
						hash) may be provided to the Gravatar service to see if you are
						using it. The Gravatar service privacy policy is available here:{" "}
						<a
							href="https://automattic.com/privacy/"
							className="text-primary-dark hover:underline"
						>
							https://automattic.com/privacy/
						</a>
						. After approval of your comment, your profile picture is visible to
						the public in the context of your comment.
					</p>
				</section>

				{/* MEDIA */}
				<section>
					<h2 className="text-2xl font-bold text-primary-dark mb-3">MEDIA</h2>
					<p className="text-gray-700">
						If you upload images to the website, you should avoid uploading
						images with embedded location data (EXIF GPS) included. Visitors to
						the website can download and extract any location data from images
						on the website.
					</p>
				</section>

				{/* CONTACT FORMS */}
				<section>
					<h2 className="text-2xl font-bold text-primary-dark mb-2">
						CONTACT FORMS
					</h2>
					<h3 className="text-xl font-semibold text-primary-dark mb-2">
						COOKIES
					</h3>
					<p className="text-gray-700 mb-3">
						If you leave a comment on our site you may opt-in to saving your
						name, email address and website in cookies. These are for your
						convenience so that you do not have to fill in your details again
						when you leave another comment. These cookies will last for one
						year.
					</p>
					<p className="text-gray-700">
						If you visit our login page, we will set a temporary cookie to
						determine if your browser accepts cookies. This cookie contains no
						personal data and is discarded when you close your browser.
					</p>
					<p className="text-gray-700 mt-3">
						When you log in, we will also set up several cookies to save your
						login information and your screen display choices. Login cookies
						last for two days, and screen options cookies last for a year. If
						you select "Remember Me", your login will persist for two weeks. If
						you log out of your account, the login cookies will be removed.
					</p>
					<p className="text-gray-700 mt-3">
						If you edit or publish an article, an additional cookie will be
						saved in your browser. This cookie includes no personal data and
						simply indicates the post ID of the article you just edited. It
						expires after 1 day.
					</p>
				</section>

				{/* EMBEDDED CONTENT */}
				<section>
					<h2 className="text-2xl font-bold text-primary-dark mb-3">
						EMBEDDED CONTENT FROM OTHER WEBSITES
					</h2>
					<p className="text-gray-700 mb-3">
						Articles on this site may include embedded content (e.g. videos,
						images, articles, etc.). Embedded content from other websites
						behaves in the exact same way as if the visitor has visited the
						other website.
					</p>
					<p className="text-gray-700">
						These websites may collect data about you, use cookies, embed
						additional third-party tracking, and monitor your interaction with
						that embedded content, including tracking your interaction with the
						embedded content if you have an account and are logged in to that
						website.
					</p>
				</section>

				{/* ANALYTICS */}
				<section>
					<h2 className="text-2xl font-bold text-primary-dark mb-2">
						ANALYTICS
					</h2>
					<h3 className="text-2xl font-bold text-primary-dark mb-2">
						WHO WE SHARE YOUR DATA WITH
					</h3>
					<h3 className="text-2xl font-bold text-primary-dark mb-2">
						HOW LONG WE RETAIN YOUR DATA
					</h3>
					<p className="text-gray-700 mb-3">
						If you leave a comment, the comment and its metadata are retained
						indefinitely. This is so we can recognize and approve any follow-up
						comments automatically instead of holding them in a moderation
						queue.
					</p>
					<p className="text-gray-700">
						For users that register on our website (if any), we also store the
						personal information they provide in their user profile. All users
						can see, edit, or delete their personal information at any time
						(except they cannot change their username). Website administrators
						can also see and edit that information.
					</p>
				</section>

				{/* WHAT RIGHTS YOU HAVE */}
				<section>
					<h2 className="text-2xl font-bold text-primary-dark mb-3">
						WHAT RIGHTS YOU HAVE OVER YOUR DATA
					</h2>
					<p className="text-gray-700">
						If you have an account on this site, or have left comments, you can
						request to receive an exported file of the personal data we hold
						about you, including any data you have provided to us. You can also
						request that we erase any personal data we hold about you. This does
						not include any data we are obliged to keep for administrative,
						legal, or security purposes.
					</p>
				</section>

				{/* WHERE WE SEND YOUR DATA */}
				<section>
					<h2 className="text-2xl font-bold text-primary-dark mb-3">
						WHERE WE SEND YOUR DATA
					</h2>
					<p className="text-gray-700">
						Visitor comments may be checked through an automated spam detection
						service.
					</p>
				</section>

				{/* ADDITIONAL SECTIONS */}
				<section className="space-y-4">
					<h2 className="text-2xl font-bold text-primary-dark">
						YOUR CONTACT INFORMATION
					</h2>
					<h2 className="text-2xl font-bold text-primary-dark">
						ADDITIONAL INFORMATION
					</h2>
					<h2 className="text-2xl font-bold text-primary-dark">
						HOW WE PROTECT YOUR DATA
					</h2>
					<h2 className="text-2xl font-bold text-primary-dark">
						WHAT DATA BREACH PROCEDURES WE HAVE IN PLACE
					</h2>
					<h2 className="text-2xl font-bold text-primary-dark">
						WHAT THIRD PARTIES WE RECEIVE DATA FROM
					</h2>
					<h2 className="text-2xl font-bold text-primary-dark">
						WHAT AUTOMATED DECISION MAKING AND/OR PROFILING WE DO WITH USER DATA
					</h2>
					<h2 className="text-2xl font-bold text-primary-dark">
						INDUSTRY REGULATORY DISCLOSURE REQUIREMENTS
					</h2>
				</section>
			</div>
		</div>
	);
}
