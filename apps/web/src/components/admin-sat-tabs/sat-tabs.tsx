import { BookOpen, FileText, Globe, Sparkles } from "lucide-react";
import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainsTab } from "./domains-tab";
import type { TabConfig } from "./lib-data/types";
import { SkillsTab } from "./skills-tab";
import { SubjectsTab } from "./subjects-tab";
import { TestTypesTab } from "./test-types-tab";

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
	{ id: "domain", label: "Domain", description: "Manage content domains" },
	{ id: "skills", label: "Skills", description: "Manage specific skills" },
];

const tabIcons: Record<string, React.ReactNode> = {
	"test-type": <FileText className="h-4 w-4" />,
	subject: <BookOpen className="h-4 w-4" />,
	difficulty: <Sparkles className="h-4 w-4" />,
	domain: <Globe className="h-4 w-4" />,
	skills: <Sparkles className="h-4 w-4" />,
};

export function AdminTabs() {
	return (
		<div className="w-full">
			<Tabs defaultValue="test-type" className="w-full">
				<div className="border-b border-border bg-muted/10 backdrop-blur-sm rounded-sm">
					<TabsList className=" bg-transparent gap-1 flex-wrap justify-start">
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
					<TabsContent value="test-type" className="mt-0">
						<TestTypesTab />
					</TabsContent>
					<TabsContent value="subject" className="mt-0">
						<SubjectsTab />
					</TabsContent>
					<TabsContent value="domain" className="mt-0">
						<DomainsTab />
					</TabsContent>
					<TabsContent value="skills" className="mt-0">
						<SkillsTab />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
