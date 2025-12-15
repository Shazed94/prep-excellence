"use client";

import { BookOpen, FileText, Globe, Sparkles } from "lucide-react";
import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TabConfig } from "./lib-data/types";
import { TabContent } from "./tab-content";

const tabConfigs: TabConfig[] = [
	{
		id: "test-type",
		label: "Test Type",
		description: "Manage test types like SAT, ACT, etc.",
	},
	{
		id: "subject",
		label: "Subject",
		description: "Manage subjects like Math, Reading, etc.",
	},
	// {
	// 	id: "difficulty",
	// 	label: "Difficulty",
	// 	description: "Manage difficulty levels",
	// },
	{ id: "domain", label: "Domain", description: "Manage content domains" },
	{ id: "skills", label: "Skills", description: "Manage specific skills" },
];

const tabIcons: Record<string, React.ReactNode> = {
	"test-type": <FileText className="h-4 w-4" />,
	subject: <BookOpen className="h-4 w-4" />,
	domain: <Globe className="h-4 w-4" />,
	skills: <Sparkles className="h-4 w-4" />,
};

export function AdminTabs() {
	return (
		<div className="w-full">
			<Tabs defaultValue="test-type" className="w-full">
				<div className="border-b border-border bg-muted/10 backdrop-blur-sm sticky top-0 z-10 rounded-sm">
					<TabsList className="h-auto bg-transparent gap-1 flex-wrap justify-start">
						{tabConfigs.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="
                  data-[state=active]:bg-primary-dark data-[state=active]:text-primary-foreground
               border
                  rounded-sm px-4 py-2 text-sm font-medium transition-all
                  flex items-center gap-2
                "
							>
								{tabIcons[tab.id]}
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<div>
					{tabConfigs.map((tab) => (
						<TabsContent key={tab.id} value={tab.id} className="mt-0">
							<TabContent tabType={tab.id} tabLabel={tab.label} />
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	);
}
