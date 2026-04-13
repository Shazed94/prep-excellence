import { UserRound, Users, Zap } from "lucide-react";
import { Subtitle } from "../SectionSubtitle";
import { Button } from "../ui/button";

// type
type Program = {
	id: number;
	icon: React.ElementType;
	title: string;
	description: string;
	cta: string;
};

const programs: Program[] = [
	{
		id: 1,
		icon: Users,
		title: "Group Classes",
		description:
			"Weekly structured classes with guided practice and feedback. Ideal for students who thrive in a collaborative environment.",
		cta: "Join Group Classes",
	},
	{
		id: 2,
		icon: Zap,
		title: "Intensive Courses",
		description:
			"Fast-track preparation for students with limited time before the exam. Covers all sections with focused drills.",
		cta: "Join Intensive Courses",
	},
	{
		id: 3,
		icon: UserRound,
		title: "1:1 Tutoring",
		description:
			"Personalized sessions focused on specific score improvement goals. Tailored to each student's strengths and weaknesses.",
		cta: "Join 1:1 Session",
	},
];

function ProgramCard({ icon: Icon, title, description, cta }: Program) {
	return (
		<div className="border border-gray-200 rounded-[12px] p-4 flex flex-col ">
			<div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shrink-0 mb-7 md:mb-14">
				<Icon size={24} className="text-white" />
			</div>
			<div className="flex flex-col gap-2 flex-1">
				<h4 className="h4 mb-[5px]">{title}</h4>
				<p className="f14 text-[#6C7179]! mb-6">{description}</p>
			</div>
			<Button
				variant={"outline"}
				className="w-full border border-primary text-primary rounded-sm py-2.5 h-[42px] text-sm font-medium hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
			>
				{cta}
			</Button>
		</div>
	);
}

export default function ChooseProgramSection() {
	return (
		<section className="bg-white py-16 px-4">
			<div className="container mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="h2">Choose Best SAT Program</h2>
					<Subtitle className="">
						Each program is designed for a different timeline and goal.
					</Subtitle>
				</div>

				{/* Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{programs.map((program) => (
						<ProgramCard key={program.id} {...program} />
					))}
				</div>
			</div>
		</section>
	);
}
