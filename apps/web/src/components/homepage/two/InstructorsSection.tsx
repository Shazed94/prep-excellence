import { MoveRight, Star } from "lucide-react";
import { motion } from "motion/react";
import { useGetInstructorsPublic } from "@/hooks/instructor";
import {
	fadeUp,
	scaleIn,
	staggerContainer,
	viewportOnce,
} from "@/lib/animations";
import { Button } from "../../ui/button";

type Instructor = {
	id: number;
	name: string;
	image: string;
};

export function InstructorCard({ name, image }: Instructor) {
	return (
		<motion.div
			className=" flex flex-col"
			// whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)" }}
			transition={{ duration: 0.25 }}
		>
			<div className="h-[400px] border border-gray-200 rounded-2xl mb-4 overflow-hidden">
				<img
					src={image}
					alt={name}
					className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
				/>
			</div>
			<div className="">
				<h3 className="h4 -tracking-[0.64px] mb-[5px]">{name}</h3>
				<div className="flex items-center gap-1.5">
					<Star size={20} className="fill-amber-400 text-amber-400" />
					<span className="p mb-0!">0</span>
				</div>
			</div>
		</motion.div>
	);
}

export default function InstructorsSection() {
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
					<h2 className="h3 text-[#0d1b2a] mb-3 ">Brain Behind Results</h2>
					<p className="p">Instructors with proven SAT teaching experience</p>
				</motion.div>

				{/* Cards */}
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					{instructors?.data
						?.slice(0, 4)
						.map((instructor: { id: number; name: string; image: string }) => (
							<motion.div key={instructor.id} variants={scaleIn}>
								<InstructorCard {...instructor} />
							</motion.div>
						))}
				</motion.div>

				{/* View More */}
				<motion.div
					className="flex justify-center"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					viewport={viewportOnce}
				>
					<Button variant={"outline"} className="h-[44px]">
						View More Instructors
						<MoveRight />
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
