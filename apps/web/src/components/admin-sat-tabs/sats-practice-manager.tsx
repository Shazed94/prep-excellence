import { List, Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SATBuilderPage } from "./sats-builder-form";
import { SATSPracticeList } from "./sats-practice-list";

export function SATSPracticeManager() {
	const [activeTab, setActiveTab] = useState<"list" | "create">("list");

	return (
		<div className="p-6">
			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as "list" | "create")}
			>
				<TabsList className="mb-6">
					<TabsTrigger value="list" className="flex items-center gap-2">
						<List className="w-4 h-4" />
						Practice Tests
					</TabsTrigger>
					<TabsTrigger value="create" className="flex items-center gap-2">
						<Plus className="w-4 h-4" />
						Create New
					</TabsTrigger>
				</TabsList>

				<TabsContent value="list">
					<SATSPracticeList onCreateNew={() => setActiveTab("create")} />
				</TabsContent>

				<TabsContent value="create">
					<SATBuilderPage />
				</TabsContent>
			</Tabs>
		</div>
	);
}
