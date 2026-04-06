import { MoveRight, Star } from "lucide-react";
import { Button } from "../ui/button";

// Type
type Instructor = {
	id: number;
	name: string;
	rating: string;
	image: string;
};

const instructors: Instructor[] = [
	{
		id: 1,
		name: "Elijah Thompson",
		rating: "4.5 Stars",
		image: "https://i.pravatar.cc/400?img=11",
	},
	{
		id: 2,
		name: "Caleb Odom",
		rating: "4.5 Stars",
		image: "https://i.pravatar.cc/400?img=13",
	},
	{
		id: 3,
		name: "Julian Hayes",
		rating: "4.5 Stars",
		image: "https://i.pravatar.cc/400?img=15",
	},
	{
		id: 4,
		name: "Josiah Quinn",
		rating: "4.5 Stars",
		image: "https://i.pravatar.cc/400?img=17",
	},
];

function InstructorCard({ name, rating, image }: Instructor) {
	return (
		<div className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
			<div className="h-64 overflow-hidden">
				<img
					src={image}
					alt={name}
					className="w-full h-full object-cover object-top"
				/>
			</div>
			<div className="p-4">
				<h3 className="font-bold text-[#0d1b2a] text-sm mb-1">{name}</h3>
				<div className="flex items-center gap-1.5">
					<Star size={14} className="fill-amber-400 text-amber-400" />
					<span className="text-xs text-gray-500">{rating}</span>
				</div>
			</div>
		</div>
	);
}

export default function InstructorsSection() {
	return (
		<section className="bg-white py-16 px-4">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="text-4xl font-extrabold text-[#0d1b2a] mb-3 tracking-tight">
						Brain Behind Results
					</h2>
					<p className="text-gray-500 text-sm">
						Instructors with proven SAT teaching experience
					</p>
				</div>

				{/* Cards */}
				<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
					{instructors.map((instructor) => (
						<InstructorCard key={instructor.id} {...instructor} />
					))}
				</div>

				{/* View More */}
				<div className="flex justify-center">
					<Button variant={"outline"} className="">
						View More Instructors
						<MoveRight />
					</Button>
				</div>
			</div>
		</section>
	);
}
