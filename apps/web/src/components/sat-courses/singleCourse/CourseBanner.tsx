import { Breadcrumb } from "@/components/breadcrumb";
import { Subtitle } from "@/components/SectionSubtitle";

export default function CourseBanner() {
	return (
		<section className="relative overflow-hidden px-4 md:px-0">
			{/* content */}
			<div className="relative z-10 container mx-auto py-16 flex items-center gap-8 md:gap-32 flex-col lg:flex-row">
				{/* left */}
				<div className="flex-1 min-w-0 space-y-4">
					<Breadcrumb alignment="left">
						Home / SAT Courses /{" "}
						<span className="text-primary! font-medium! hover:underline tracking-[0.5px]!">
							SAT Comprehensive Course for Summer 2026
						</span>
					</Breadcrumb>

					<h2 className="h2 text-5xl! leading-14!">
						SAT Comprehensive
						<br />
						Course for Summer 2026
					</h2>

					<Subtitle alignment="left">
						Live SAT courses, expert instructors, and a clear weekly plan that
						helps students <br /> improve scores with confidence.
					</Subtitle>
				</div>

				{/* stats card */}

				<div className="shrink-0 rounded-[12px] bg-white border  p-4  w-full max-w-[480px]">
					<div className="bg-[#3B5BFF] rounded-sm p-6">
						{/* Label */}
						<p className="body_lg text-white! mb-4">
							One-time payment • Lifetime access
						</p>

						{/* Price row */}
						<div className="flex items-baseline gap-3 mb-7">
							<span className="text-white text-[32px] font-semibold tracking-[-1px] leading-8">
								$70 USD
							</span>
							<span className="text-[#EBEBEB]! f14 line-through">$120 USD</span>
						</div>

						{/* CTA Button */}
						<button
							type="button"
							className="flex items-center justify-center gap-2.5 w-full bg-white! text-primary! rounded-sm py-4 body_lg cursor-pointer border-none font-semibold!"
						>
							Book Your Seat
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								{" "}
								<title>arrow right</title>
								<path
									d="M4 10h12M11 5l5 5-5 5"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>

						{/* Footer note */}
						<p className="text-white! text-center! mt-2.5 body_lg">
							Seats are filling up faster, few seats left.
						</p>
					</div>
				</div>
			</div>

			{/* bg */}
			<img
				src="/bg.png"
				alt=""
				className="absolute inset-0 w-full h-full object-cover z-0"
			/>
			<div
				className="absolute inset-0 -z-10"
				style={{
					background:
						"linear-gradient(180deg, #FFFFFF 27.07%, rgba(201,220,255,0.6) 60%, #ECF1FE 85%, rgba(21,82,253,0.35) 100%)",
				}}
			/>
		</section>
	);
}

// import { Link } from "@tanstack/react-router";
// import { Star } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// export interface User {
// 	id: string;
// 	name: string;
// 	image?: string | null;
// 	email?: string;
// }

// export interface Instructor {
// 	id: string;
// 	bio?: string | null;
// 	certifications?: string[] | null;
// 	experienceYears?: number | null;
// 	qualifications?: string | null;
// 	subjects?: string[] | null;
// 	user: User;
// }

// export interface Module {
// 	id: string;
// 	title: string;
// 	description?: string | null;
// 	order: number;
// 	lessons?: Lesson[];
// }

// export interface Lesson {
// 	id: string;
// 	title: string;
// 	description?: string | null;
// 	videoUrl?: string | null;
// 	duration?: number | null;
// 	order: number;
// }

// export interface Course {
// 	id: string;
// 	title: string;
// 	description: string;
// 	category: string;
// 	level: string;
// 	price: string;
// 	discount?: string | null;
// 	averageRating: number;
// 	totalReviews: number;
// 	duration: number;
// 	thumbnail?: string | null;
// 	whatYouLearn?: string[] | null;
// 	requirements?: string[] | null;
// 	instructor?: Instructor | null;
// 	modules?: Module[] | null;
// 	_count?: {
// 		reviews?: number;
// 		enrollments?: number;
// 	};
// }

// export interface CourseBannerProps {
// 	course: Course;
// }

// export default function CourseBanner({ course }: CourseBannerProps) {
// 	const getInitials = (name: string) => {
// 		return name
// 			.split(" ")
// 			.map((n) => n[0])
// 			.join("")
// 			.toUpperCase()
// 			.slice(0, 2);
// 	};

// 	const formatLevel = (level: string) => {
// 		return level.charAt(0) + level.slice(1).toLowerCase();
// 	};

// 	const finalPrice = course.discount
// 		? (
// 				parseFloat(course.price) *
// 				(1 - parseFloat(course.discount) / 100)
// 			).toFixed(2)
// 		: parseFloat(course.price).toFixed(2);

// 	const instructorName = course.instructor?.user?.name || "Instructor";
// 	const instructorAvatar = course.instructor?.user?.image;

// 	return (
// 		<div className="bg-gradient-to-r from-[#BBDEEF]/40 to-white shadow-sm">
// 			<div className="container mx-auto px-4 sm:px-6 lg:px-20 py-6 md:py-8">
// 				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
// 					{/* Left Column - Course Info */}
// 					<div className="lg:col-span-2">
// 						<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
// 							{course.title}
// 						</h1>

// 						{/* Course Details - Mobile: 2 columns, Tablet: 3 columns, Desktop: Flex */}
// 						<div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-4 sm:gap-6 lg:gap-8">
// 							{/* Instructor */}
// 							<div className="min-w-0 lg:min-w-[150px]">
// 								<p className="text-xs uppercase tracking-wide text-cyan-600 font-medium mb-2 md:mb-3">
// 									Instructor
// 								</p>
// 								<div className="flex items-center gap-2">
// 									<Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-white shadow-sm flex-shrink-0">
// 										<AvatarImage
// 											src={instructorAvatar || "/instructor-teaching.png"}
// 											alt={instructorName}
// 										/>
// 										<AvatarFallback className="bg-blue-100 text-blue-600 font-medium text-xs md:text-sm">
// 											{getInitials(instructorName)}
// 										</AvatarFallback>
// 									</Avatar>
// 									<span className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
// 										{instructorName}
// 									</span>
// 								</div>
// 							</div>

// 							{/* Category */}
// 							<div className="min-w-0 lg:min-w-[110px]">
// 								<p className="text-xs uppercase tracking-wide text-cyan-600 font-medium mb-2 md:mb-3">
// 									Category
// 								</p>
// 								<p className="text-xs sm:text-sm font-semibold text-gray-900 break-words">
// 									{course.category}
// 								</p>
// 							</div>

// 							{/* Level */}
// 							<div className="min-w-0 lg:min-w-[110px]">
// 								<p className="text-xs uppercase tracking-wide text-cyan-600 font-medium mb-2 md:mb-3">
// 									Level
// 								</p>
// 								<p className="text-xs sm:text-sm font-semibold text-gray-900">
// 									{formatLevel(course.level)}
// 								</p>
// 							</div>

// 							{/* Reviews */}
// 							<div className="min-w-0 lg:min-w-[100px]">
// 								<p className="text-xs uppercase tracking-wide text-cyan-600 font-medium mb-2 md:mb-3">
// 									Reviews
// 								</p>
// 								<p className="text-xs sm:text-sm font-semibold text-gray-900">
// 									{course._count?.reviews || course.totalReviews || 0}
// 								</p>
// 							</div>

// 							{/* Rating */}
// 							<div className="min-w-0 lg:min-w-[100px]">
// 								<p className="text-xs uppercase tracking-wide text-cyan-600 font-medium mb-2 md:mb-3">
// 									Rating
// 								</p>
// 								<div className="flex items-center gap-1 md:gap-2">
// 									<span className="text-xs sm:text-sm font-semibold text-gray-900">
// 										{course.averageRating.toFixed(1)}
// 									</span>
// 									<Star className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
// 								</div>
// 							</div>

// 							{/* Price - Hidden on mobile, shown on desktop in banner */}
// 							<div className="hidden lg:block min-w-0 lg:min-w-[100px]">
// 								<p className="text-xs uppercase tracking-wide text-cyan-600 font-medium mb-2 md:mb-3">
// 									Price
// 								</p>
// 								<p className="text-base md:text-lg font-bold text-gray-900">
// 									${finalPrice}
// 								</p>
// 							</div>
// 						</div>
// 					</div>

// 					{/* Right Column - Enroll Card - Desktop only */}
// 					<div className="hidden lg:block lg:sticky lg:top-4">
// 						<div className="rounded-xl shadow-lg border overflow-hidden max-w-sm mx-auto">
// 							<Link to="/">
// 								<img
// 									src={course.thumbnail || "/sat-courses/banner.png"}
// 									alt={course.title}
// 									className="w-full h-48 object-cover hover:opacity-95 transition-opacity"
// 								/>
// 							</Link>

// 							<div className="p-6 space-y-3">
// 								<Button
// 									type="button"
// 									className="w-full  text-white text-base font-semibold py-6 rounded-lg shadow-md hover:shadow-lg transition-all"
// 								>
// 									Add to Cart
// 								</Button>

// 								<Button
// 									type="button"
// 									variant="outline"
// 									className="w-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-base font-semibold py-6 rounded-lg transition-all"
// 								>
// 									Add to Wishlist
// 								</Button>
// 							</div>
// 						</div>
// 					</div>
// 				</div>

// 				{/* Mobile Action Buttons - Shows only on mobile/tablet */}
// 				<div className="lg:hidden mt-6 flex flex-col sm:flex-row gap-3">
// 					<Button
// 						type="button"
// 						className="w-full sm:flex-1  text-sm sm:text-base font-semibold py-4 sm:py-5 rounded-lg shadow-md hover:shadow-lg transition-all"
// 					>
// 						Add to Cart
// 					</Button>

// 					<Button
// 						type="button"
// 						variant="outline"
// 						className="w-full sm:flex-1 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-sm sm:text-base font-semibold py-4 sm:py-5 rounded-lg transition-all"
// 					>
// 						Add to Wishlist
// 					</Button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
