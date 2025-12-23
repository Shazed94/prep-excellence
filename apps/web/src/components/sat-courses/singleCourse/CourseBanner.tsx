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
