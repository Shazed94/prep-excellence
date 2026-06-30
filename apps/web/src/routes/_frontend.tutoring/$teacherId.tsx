import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	Award,
	CheckCircle,
	Clock,
	Loader2,
	MessageCircle,
	Star,
	Users,
	Video,
} from "lucide-react";
import { motion } from "motion/react";
import { Breadcrumb } from "@/components/breadcrumb";
import FooterTwo from "@/components/FooterTwo";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetTeacherProfile, useGetTeacherReviews } from "@/hooks/onetoone";
import { fadeLeft, fadeRight, fadeUp, viewportOnce } from "@/lib/animations";
import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";

export const Route = createFileRoute("/_frontend/tutoring/$teacherId")({
	component: RouteComponent,
});

// ─── Level badge ──────────────────────────────────────────────────────────────

function levelColor(level: string) {
	const map: Record<string, string> = {
		BEGINNER: "bg-emerald-100 text-emerald-700",
		INTERMEDIATE: "bg-amber-100 text-amber-700",
		ADVANCED: "bg-red-100 text-red-600",
	};
	return map[level] ?? "bg-primary-light text-primary";
}

// ─── Star row ─────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex items-center gap-0.5">
			{Array.from({ length: 5 }).map((_, i) => (
				<Star
					key={i}
					className={`w-4 h-4 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
				/>
			))}
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RouteComponent() {
	const { teacherId } = Route.useParams();
	const { data, isLoading } = useGetTeacherProfile(teacherId);
	const { data: reviewsData } = useGetTeacherReviews(teacherId);

	const profile = data?.data;
	const reviews = reviewsData?.data ?? [];

	const { user } = useAuth();
	const navigate = useNavigate();
	const { openLoginPopup } = useLoginPopupStore();

	const handleBook = () => {
		if (!user) {
			openLoginPopup(`/tutoring/${teacherId}`);
			return;
		}
		navigate({
			to: "/student-dashboard/find-tutor/$teacherId",
			params: { teacherId },
		});
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center gap-4">
				<Users className="w-12 h-12 text-gray-200" />
				<p className="h4 text-muted-foreground">Tutor not found</p>
				<Link to="/tutoring">
					<Button variant="outline">Browse all tutors</Button>
				</Link>
			</div>
		);
	}

	const teacher = profile.teacher?.user;
	const name = teacher?.name ?? "Tutor";
	const image = teacher?.image;

	return (
		<div>
			{/* ── Hero ── */}
			<section className="relative overflow-hidden px-4 md:px-0">
				<div className="relative z-10 container mx-auto py-16">
					<Breadcrumb alignment="left" className="mb-6">
						<Link to="/tutoring" className="hover:underline">
							Tutoring
						</Link>
						{" / "}
						<span className="text-primary! font-medium!">{name}</span>
					</Breadcrumb>

					<div className="flex flex-col lg:flex-row gap-10 items-start">
						{/* Left: Profile */}
						<motion.div
							className="flex-1 min-w-0"
							variants={fadeLeft}
							initial="hidden"
							animate="visible"
						>
							<div className="flex items-start gap-5 mb-6">
								<Avatar className="w-20 h-20 flex-shrink-0 border-4 border-white shadow-md">
									<AvatarImage src={image} alt={name} />
									<AvatarFallback className="text-2xl bg-primary-light text-primary font-bold">
										{name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<h1 className="h2 text-4xl! leading-[48px]! mb-1">{name}</h1>
									<div className="flex flex-wrap items-center gap-3">
										<div className="flex items-center gap-1.5">
											<StarRating rating={profile.rating} />
											<span className="f14 font-semibold text-[#1e293b]">
												{profile.rating.toFixed(1)}
											</span>
											<span className="f14 text-muted-foreground">
												({profile.totalReviews} reviews)
											</span>
										</div>
										{profile.isAvailable ? (
											<span className="flex items-center gap-1 f14 text-emerald-600 font-medium">
												<CheckCircle className="w-4 h-4" />
												Available
											</span>
										) : (
											<span className="f14 text-muted-foreground">
												Not available
											</span>
										)}
									</div>
								</div>
							</div>

							{/* Bio */}
							{profile.bio && (
								<div className="mb-6">
									<h3 className="h4 mb-2">About</h3>
									<p className="p text-muted-foreground leading-relaxed">
										{profile.bio}
									</p>
								</div>
							)}

							{/* Stats */}
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
								{[
									{
										icon: Users,
										label: "Total Sessions",
										value: profile.totalSessions,
									},
									{
										icon: Star,
										label: "Rating",
										value: `${profile.rating.toFixed(1)} / 5`,
									},
									{
										icon: MessageCircle,
										label: "Reviews",
										value: profile.totalReviews,
									},
									{
										icon: Clock,
										label: "Response Time",
										value: profile.responseTime
											? `${profile.responseTime}h`
											: "Fast",
									},
								].map(({ icon: Icon, label, value }) => (
									<div
										key={label}
										className="bg-white rounded-xl border border-[#EBEBEB] p-4 text-center"
									>
										<Icon className="w-5 h-5 text-primary mx-auto mb-1" />
										<p className="h4 text-primary">{value}</p>
										<p className="f14 text-muted-foreground">{label}</p>
									</div>
								))}
							</div>

							{/* Specializations */}
							{profile.specializations?.length > 0 && (
								<div className="mb-6">
									<h3 className="h4 mb-4">Specializations</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										{profile.specializations.map((spec) => (
											<div
												key={spec.id}
												className="flex items-start gap-3 bg-white rounded-xl border border-[#EBEBEB] p-4"
											>
												<Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
												<div>
													<div className="flex items-center gap-2 mb-1">
														<span className="p font-semibold">
															{spec.subject}
														</span>
														<span
															className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${levelColor(spec.level)}`}
														>
															{spec.level.charAt(0) +
																spec.level.slice(1).toLowerCase()}
														</span>
													</div>
													{spec.yearsExp && (
														<p className="f14 text-muted-foreground">
															{spec.yearsExp} years experience
														</p>
													)}
													{spec.description && (
														<p className="f14 text-muted-foreground mt-1">
															{spec.description}
														</p>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</motion.div>

						{/* Right: Booking card */}
						<motion.div
							className="w-full lg:w-[320px] flex-shrink-0 sticky top-6"
							variants={fadeRight}
							initial="hidden"
							animate="visible"
						>
							<div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-lg overflow-hidden">
								{/* Rate */}
								<div className="bg-primary p-6 text-white">
									<p className="f14 text-white/70 mb-1">Hourly Rate</p>
									<div className="flex items-end gap-1">
										<span className="text-[40px] font-bold leading-none">
											${profile.hourlyRate}
										</span>
										<span className="text-white/70 mb-1">/hr</span>
									</div>
								</div>

								{/* Details */}
								<div className="p-6 space-y-3 border-b border-[#EBEBEB]">
									{[
										{
											icon: Video,
											label: "Session Type",
											value: "Online / Offline",
										},
										{
											icon: Clock,
											label: "Timezone",
											value: profile.timezone || "Flexible",
										},
										{
											icon: Star,
											label: "Rating",
											value: `${profile.rating.toFixed(1)} (${profile.totalReviews})`,
										},
										{
											icon: Users,
											label: "Sessions done",
											value: String(profile.totalSessions),
										},
									].map(({ icon: Icon, label, value }) => (
										<div
											key={label}
											className="flex items-center justify-between"
										>
											<div className="flex items-center gap-2 f14 text-muted-foreground">
												<Icon className="w-4 h-4" />
												<span>{label}</span>
											</div>
											<span className="f14 font-semibold text-[#1e293b]">
												{value}
											</span>
										</div>
									))}
								</div>

								{/* CTA */}
								<div className="p-6 space-y-3">
									<Button
										variant="gradient"
										className="w-full h-[46px] text-base"
										onClick={handleBook}
									>
										Book a Session
									</Button>
									{profile.videoUrl && (
										<a href={profile.videoUrl} target="_blank" rel="noreferrer">
											<Button variant="outline" className="w-full h-[42px]">
												<Video className="w-4 h-4 mr-2" />
												Watch Intro Video
											</Button>
										</a>
									)}
								</div>
							</div>
						</motion.div>
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
							"linear-gradient(180deg, #FFFFFF 27.07%, rgba(201,220,255,0.2) 60%, rgba(236,241,254,0.2) 83%, rgba(21,82,253,0.15) 100%)",
					}}
				/>
			</section>

			{/* ── Reviews ── */}
			{reviews.length > 0 && (
				<section className="py-16 px-6 md:px-0 bg-white">
					<div className="container mx-auto max-w-3xl">
						<motion.div
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={viewportOnce}
						>
							<h2 className="h2 mb-2">
								Student Reviews
								<span className="text-muted-foreground text-2xl font-normal ml-2">
									({reviews.length})
								</span>
							</h2>
							<div className="flex items-center gap-3 mb-8">
								<StarRating rating={profile.rating} />
								<span className="h4 text-primary">
									{profile.rating.toFixed(1)}
								</span>
								<span className="f14 text-muted-foreground">
									overall rating
								</span>
							</div>

							<div className="space-y-4">
								{reviews.map((review) => (
									<div
										key={review.id}
										className="bg-white rounded-2xl border border-[#EBEBEB] p-6"
									>
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-3">
												<Avatar className="w-10 h-10">
													<AvatarImage
														src={review.student?.user?.image}
														alt={review.student?.user?.name}
													/>
													<AvatarFallback className="bg-primary-light text-primary font-semibold">
														{review.student?.user?.name?.charAt(0) ?? "S"}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="p font-semibold">
														{review.student?.user?.name ?? "Student"}
													</p>
													<p className="f14 text-muted-foreground">
														{new Date(review.createdAt).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															},
														)}
													</p>
												</div>
											</div>
											<StarRating rating={review.rating} />
										</div>
										{review.comment && (
											<p className="f14 text-muted-foreground leading-relaxed">
												{review.comment}
											</p>
										)}
										{review.response && (
											<div className="mt-3 pl-4 border-l-2 border-primary-light">
												<p className="f14 font-semibold text-primary mb-1">
													Tutor response
												</p>
												<p className="f14 text-muted-foreground">
													{review.response}
												</p>
											</div>
										)}
									</div>
								))}
							</div>
						</motion.div>
					</div>
				</section>
			)}

			<FAQSectionTwo />
			<FooterTwo />
		</div>
	);
}
