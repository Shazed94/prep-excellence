import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function CourseBanner() {
	return (
		<div className="  py-8 md:py-20 px-6 bg-linear-to-r from-[#BBDEEF]/40 to-[#FFFFFF] to-50% shadow-[0_0_31px_0_rgba(0,0,0,0.10)]">
			<div className="mx-auto container h-44 relative">
				<div className="grid grid-cols-1 md:grid-cols-3 ">
					{/* Left Column - Course Info */}
					<div className="col-span-3 md:col-span-2">
						<h1 className="text-2xl  md:text-3xl font-bold text-gray-900 mb-4">
							Python Advanced Course
						</h1>

						<div className="flex gap-6 text-sm text-gray-600 mb-8">
							<span>
								Projects: <strong className="text-gray-900">3</strong>
							</span>
							<span>
								Certificate: <strong className="text-gray-900">Yes</strong>
							</span>
							<span>
								Access: <strong className="text-gray-900">Lifetime</strong>
							</span>
						</div>

						{/* Course Details Grid */}
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
							{/* Instructor */}
							<div>
								<p className="text-sm text-cyan-600 mb-2">Instructor:</p>
								<div className="flex items-center gap-2">
									<Avatar className="h-8 w-8">
										<AvatarImage
											src="/instructor-teaching.png"
											alt="Julius Connon"
										/>
										<AvatarFallback>JC</AvatarFallback>
									</Avatar>
									<span className="text-sm font-medium text-gray-900">
										Julius Connon
									</span>
								</div>
							</div>

							{/* Category */}
							<div>
								<p className="text-sm text-cyan-600 mb-2">Category</p>
								<p className="text-sm font-medium text-gray-900">
									Computer Science
								</p>
							</div>

							{/* Level */}
							<div>
								<p className="text-sm text-cyan-600 mb-2">Level</p>
								<p className="text-sm font-medium text-gray-900">Beginner</p>
							</div>

							{/* Reviews */}
							<div>
								<p className="text-sm text-cyan-600 mb-2">Reviews</p>
								<p className="text-sm font-medium text-gray-900">5</p>
							</div>

							{/* Rating */}
							<div>
								<p className="text-sm text-cyan-600 mb-2">Rating</p>
								<div className="flex items-center gap-1">
									<span className="text-sm font-medium text-gray-900">4.6</span>
									<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
								</div>
							</div>

							{/* Price */}
							<div>
								<p className="text-sm text-cyan-600 mb-2">Price</p>
								<p className="text-sm font-medium text-gray-900">$512</p>
							</div>
						</div>
					</div>
					{/* Right Column - Enroll Button */}
					<div className=" w-full px-8 relative">
						<Link to="/">
							<img
								src="/sat-courses/banner.png"
								alt="Course Banner"
								className="w-full h-full "
							/>
						</Link>
						<Button
							type="button"
							className="absolute bottom-24 right-12 left-12 bg-accent text-white text-[21px] font-medium py-2 rounded-[5px] cursor-pointer"
						>
							Add to cart
						</Button>
						<Button
							type="button"
							className="absolute bottom-8 right-12 left-12 bg-transparent border border-white text-white text-[21px] font-medium py-2 rounded-[5px] cursor-pointer"
						>
							Add to Wishlist
						</Button>
					</div>
				</div>
			</div>
		</div>
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
