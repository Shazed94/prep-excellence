import { Link, useRouterState } from "@tanstack/react-router";
import {
	Award,
	BarChart3,
	BookOpen,
	ClipboardList,
	Trophy,
	Users,
} from "lucide-react";

interface CourseNavProps {
	courseId: string;
	courseName: string;
}

export function CourseNav({ courseId, courseName }: CourseNavProps) {
	const { location } = useRouterState();
	const pathname = location.pathname;

	const base = `/student-dashboard/my-courses/${courseId}`;

	const navItems = [
		{ label: "Overview", href: base, icon: <BookOpen size={15} /> },
		{
			label: "Progress",
			href: `${base}/progress`,
			icon: <BarChart3 size={15} />,
		},
		{
			label: "Attendance",
			href: `${base}/attendence`,
			icon: <ClipboardList size={15} />,
		},
		{
			label: "Quizzes",
			href: `${base}/quiz-scores`,
			icon: <Award size={15} />,
		},
		{
			label: "Certificate",
			href: `${base}/certificate`,
			icon: <Trophy size={15} />,
		},
		{
			label: "Leaderboard",
			href: `${base}/leaderboard`,
			icon: <Users size={15} />,
		},
	];

	return (
		<div className="bg-white rounded-2xl border border-border/60 mb-4 overflow-hidden">
			<div className="px-4 py-3 border-b border-border/60">
				<h2 className="font-switzer font-bold text-foreground truncate">
					{courseName}
				</h2>
			</div>
			<div className="flex overflow-x-auto">
				{navItems.map((item) => {
					const isActive =
						pathname === item.href ||
						(item.href !== base && pathname.startsWith(item.href));
					return (
						<Link key={item.href} to={item.href as any}>
							<button
								type="button"
								className={`flex items-center gap-1.5 px-4 py-3 font-medium text-xs whitespace-nowrap transition-all duration-200 border-b-2 ${
									isActive
										? "border-primary text-primary bg-primary/5"
										: "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20"
								}`}
							>
								{item.icon}
								{item.label}
							</button>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
