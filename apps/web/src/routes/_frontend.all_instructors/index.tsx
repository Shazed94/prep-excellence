// routes/_frontend.all_instructors.tsx
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Breadcrumb } from "@/components/breadcrumb";
import { InstructorCard } from "@/components/homepage/two/InstructorsSection";
import { Subtitle } from "@/components/SectionSubtitle";
import { useGetInstructorsPublic } from "@/hooks/instructor";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

export const Route = createFileRoute("/_frontend/all_instructors/")({
	component: InstructorsPage,
});

function InstructorsPage() {
	const { data: instructors, isLoading } = useGetInstructorsPublic();

	return (
		<main className="bg-white min-h-screen">
			{/* ── Page Header ── */}
			<section className="py-10 md:py-10 px-4 border-b border-gray-100">
				<div className="">
					<Breadcrumb alignment="center">
						Home /{" "}
						<span className="text-primary! font-medium! hover:underline tracking-[0.5px]!">
							All Instructors
						</span>
					</Breadcrumb>

					<div className="text-center mb-10">
						<h2 className="h2">All Instructors</h2>
						<Subtitle alignment="center" className=" max-w-xl">
							Instructors with proven SAT teaching experience
						</Subtitle>
					</div>
				</div>
			</section>

			{/* ── Grid ── */}
			<section className="py-10 md:py-16 px-4">
				<div className="container mx-auto">
					{isLoading ? (
						<LoadingSkeleton />
					) : (
						<>
							<motion.div
								className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
								variants={staggerContainer}
								initial="hidden"
								animate="visible"
							>
								{instructors?.data?.map(
									(instructor: { id: number; name: string; image: string }) => (
										<motion.div key={instructor.id} variants={scaleIn}>
											<InstructorCard {...instructor} />
										</motion.div>
									),
								)}
							</motion.div>

							{/* Empty state */}
							{!instructors?.data?.length && (
								<motion.p
									className="text-center text-gray-400 py-20"
									variants={fadeUp}
									initial="hidden"
									animate="visible"
								>
									No instructors found.
								</motion.p>
							)}
						</>
					)}
				</div>
			</section>
		</main>
	);
}

function LoadingSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={i} className="flex flex-col animate-pulse">
					<div className="h-[400px] bg-gray-100 rounded-2xl mb-4" />
					<div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
					<div className="h-4 bg-gray-100 rounded w-1/3" />
				</div>
			))}
		</div>
	);
}
