import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Award,
	BookOpen,
	GraduationCap,
	MoveLeft,
	Verified,
} from "lucide-react";
import { motion } from "motion/react";

import { useGetInstructorById } from "@/hooks/instructor";

import { fadeUp } from "@/lib/animations";

export const Route = createFileRoute("/_frontend/all_instructors/$id")({
	component: InstructorDetailPage,
});

function InstructorDetailPage() {
	const { id } = Route.useParams();

	const { data: instructor, isLoading } = useGetInstructorById(id);

	if (isLoading) return <DetailSkeleton />;

	const detail = instructor?.data;

	return (
		<main className="bg-white min-h-screen">
			<section className="py-10 md:py-16 px-4">
				<div className="container mx-auto">
					{/* Back */}

					<motion.div
						initial={{ opacity: 0, x: -12 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3 }}
					>
						<Link
							to="/all_instructors"
							className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0d1b2a] transition-colors mb-10"
						>
							<MoveLeft size={16} />
							Back to Instructors
						</Link>
					</motion.div>

					{/* Profile block */}

					<div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 lg:gap-16 items-start">
						{/* Left — Photo */}

						<motion.div
							className="w-full"
							initial={{ opacity: 0, y: 24 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.45 }}
						>
							<div className="h-[480px] border border-gray-200 rounded-2xl overflow-hidden">
								<img
									src={detail?.image}
									alt={detail?.name}
									className="w-full h-full object-cover object-top"
								/>
							</div>
						</motion.div>

						{/* Right — Info */}

						<motion.div
							className="flex flex-col gap-6"
							variants={fadeUp}
							initial="hidden"
							animate="visible"
						>
							{/* Name + qualifications */}

							<div>
								<div className="flex items-center gap-2 mb-2">
									<h1 className="h3 text-[#0d1b2a] -tracking-[0.64px]">
										{detail?.name}
									</h1>

									{detail?.isVerified && (
										<Verified size={20} className="text-blue-500 shrink-0" />
									)}
								</div>

								{detail?.qualifications && (
									<p className="text-gray-500 text-sm">
										{detail.qualifications}
									</p>
								)}
							</div>

							<hr className="border-gray-100" />

							{/* Stats */}

							<div className="grid grid-cols-3 gap-4">
								<StatCard
									icon={<BookOpen size={20} className="text-[#0d1b2a]" />}
									label="Subjects"
									value={detail?.subjects?.length ?? 0}
								/>

								<StatCard
									icon={<Award size={20} className="text-[#0d1b2a]" />}
									label="Experience"
									value={
										detail?.experienceYears ? `${detail.experienceYears}y` : "—"
									}
								/>

								<StatCard
									icon={<GraduationCap size={20} className="text-[#0d1b2a]" />}
									label="Certifications"
									value={detail?.certifications?.length ?? 0}
								/>
							</div>

							{/* Bio */}

							{detail?.bio && (
								<div>
									<h2 className="h4 text-[#0d1b2a] mb-3">About</h2>

									<p className="p text-gray-600 leading-relaxed">
										{detail.bio}
									</p>
								</div>
							)}

							{/* Subjects */}

							{detail?.subjects?.length > 0 && (
								<div>
									<h2 className="h4 text-[#0d1b2a] mb-3">Subjects</h2>

									<div className="flex flex-wrap gap-2">
										{detail.subjects.map((s: string, i: number) => (
											<span
												key={i}
												className="px-3 py-1.5 text-sm border border-gray-200 rounded-full text-gray-700"
											>
												{s}
											</span>
										))}
									</div>
								</div>
							)}

							{/* Certifications */}

							{detail?.certifications?.length > 0 && (
								<div>
									<h2 className="h4 text-[#0d1b2a] mb-3">Certifications</h2>

									<div className="flex flex-wrap gap-2">
										{detail.certifications.map((c: string, i: number) => (
											<span
												key={i}
												className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full text-gray-700"
											>
												{c}
											</span>
										))}
									</div>
								</div>
							)}
						</motion.div>
					</div>
				</div>
			</section>
		</main>
	);
}

function StatCard({
	icon,

	label,

	value,
}: {
	icon: React.ReactNode;

	label: string;

	value: string | number;
}) {
	return (
		<div className="flex flex-col gap-1.5 border border-gray-200 rounded-2xl p-4">
			{icon}

			<span className="text-xl font-semibold text-[#0d1b2a]">{value}</span>

			<span className="text-xs text-gray-500">{label}</span>
		</div>
	);
}

function DetailSkeleton() {
	return (
		<main className="bg-white min-h-screen py-10 md:py-16 px-4">
			<div className="container mx-auto animate-pulse">
				<div className="h-4 w-32 bg-gray-100 rounded mb-10" />

				<div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 lg:gap-16">
					<div className="h-[480px] bg-gray-100 rounded-2xl" />

					<div className="flex flex-col gap-4">
						<div className="h-8 bg-gray-100 rounded w-1/2" />

						<div className="h-4 bg-gray-100 rounded w-1/4" />

						<div className="h-px bg-gray-100 rounded" />

						<div className="grid grid-cols-3 gap-4">
							{[1, 2, 3].map((i) => (
								<div key={i} className="h-24 bg-gray-100 rounded-2xl" />
							))}
						</div>

						<div className="h-32 bg-gray-100 rounded" />
					</div>
				</div>
			</div>
		</main>
	);
}
