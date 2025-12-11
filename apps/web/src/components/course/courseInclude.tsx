import {
	Award,
	Download,
	File,
	FileText,
	Play,
	Smartphone,
	Subtitles,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export function CourseIncludes() {
	const features = [
		{ icon: Play, label: "5 hours on-demand video" },
		{ icon: FileText, label: "Assignments" },
		{ icon: File, label: "1 article" },
		{ icon: Download, label: "7 downloadable resources" },
		{ icon: Smartphone, label: "Access on mobile and TV" },
		{ icon: Subtitles, label: "Closed captions" },
		{ icon: Award, label: "Certificate of completion" },
	];

	return (
		<Card className="p-6 mb-8">
			<h2 className="text-xl font-bold mb-6">This course includes:</h2>
			<div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
				{features.map((feature, index) => (
					<div key={index} className="flex items-center gap-3">
						<feature.icon className="h-5 w-5 text-muted-foreground shrink-0" />
						<span className="text-sm">{feature.label}</span>
					</div>
				))}
			</div>
		</Card>
	);
}
