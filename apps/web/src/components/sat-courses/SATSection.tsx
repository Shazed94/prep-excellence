import { motion } from "motion/react";
import { Breadcrumb } from "../breadcrumb";
import { Subtitle } from "../SectionSubtitle";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "../ui/avatar";

export default function SATSection() {
	return (
		<section className="relative overflow-hidden px-4 md:px-0">
			{/* content */}
			<div className="relative z-10 container mx-auto py-16 flex items-center gap-8 md:gap-32 flex-col lg:flex-row">
				{/* left */}
				<div className="flex-1 min-w-0 space-y-4">
					<Breadcrumb alignment="left">
						Home /{" "}
						<span className="text-primary! font-medium! hover:underline tracking-[0.5px]!">
							SAT Courses
						</span>
					</Breadcrumb>

					<h2 className="h2 text-5xl! leading-14!">
						Find the right SAT course
						<br />
						for your target score
					</h2>

					<Subtitle alignment="left">
						Live SAT courses, expert instructors, and a clear weekly plan that
						helps <br /> students improve scores with confidence.
					</Subtitle>

					{/* avatars + rating */}
					<motion.div
						className="flex flex-col sm:flex-row justify-start items-center gap-1 sm:gap-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						<AvatarGroup className="w-fit *:data-[slot=avatar]:ring-[2.5px]">
							<Avatar className="size-[30px]">
								<AvatarImage
									src="home/avatar-group-1.png"
									alt="@shadcn"
									className=""
								/>
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<Avatar className="size-[30px]">
								<AvatarImage src="home/avatar-group-2.png" alt="@maxleiter" />
								<AvatarFallback>LR</AvatarFallback>
							</Avatar>
							<Avatar className="size-[30px]">
								<AvatarImage src="home/avatar-group-3.png" alt="@evilrabbit" />
								<AvatarFallback>ER</AvatarFallback>
							</Avatar>
						</AvatarGroup>
						<Subtitle className="text-center mb-0! w-fit mx-0">
							4.9 out of 5.00 by 14,000 people worldwide.
						</Subtitle>
					</motion.div>
				</div>

				{/* stats card */}
				<div className="shrink-0  bg-primary rounded-[12px] p-8 grid grid-cols-2">
					{[
						{
							label: "Avg. Score Improvement",
							sub: "150+",
							border: "border-b border-r",
						},
						{ label: "2000 Reviews", sub: "4.9", border: "border-b" },
						{ label: "Students Worldwide", sub: "2000+", border: "border-r" },
						{ label: "Expert Instructors", sub: "32+", border: "" },
					].map(({ label, sub }, i) => (
						<div
							key={i}
							className={`${
								i < 2 ? "pb-6" : "pt-6"
							} ${i % 2 === 0 ? "pr-6" : "pl-6"}`}
						>
							<p className="f14 text-white! tracking-[0.5px]! flex items-center gap-2 mb-3">
								<span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
								{label}
							</p>
							<div className="h-0.5 bg-white mb-2.5  " />
							<p className="h2 text-white! leading-12! -tracking-[2px]!">
								{sub}
							</p>
						</div>
					))}
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
