import { motion } from "motion/react";
import { useGetInstructorsPublic } from "@/hooks/instructor";
import {
	fadeUp,
	scaleIn,
	staggerContainer,
	viewportOnce,
} from "@/lib/animations";
import { InstructorCard } from "../homepage/two/InstructorsSection";

export default function OurInstructors() {
	const { data: instructors } = useGetInstructorsPublic();

	return (
		<section className="bg-white py-8 md:py-16 px-4">
			<div className="container mx-auto">
				{/* Header */}
				<motion.div
					className="text-center mb-12"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<h2 className="h2 text-[#0d1b2a] mb-3">Meet Our Instructor Team</h2>
					<p className="p">Instructors with proven SAT teaching experience</p>
				</motion.div>

				{/* Cards — all instructors, no slice */}
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					{instructors?.data?.map(
						(instructor: { id: number; name: string; image: string }) => (
							<motion.div key={instructor.id} variants={scaleIn}>
								<InstructorCard {...instructor} />
							</motion.div>
						),
					)}
				</motion.div>
			</div>
		</section>
	);
}
