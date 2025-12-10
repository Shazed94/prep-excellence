import { useCallback, useState } from "react";

import {
	mockDomains,
	mockSkills,
	mockSubjects,
	mockTestTypes,
} from "./lib-data/mock-data";
import type { BaseItem, TabType } from "./lib-data/types";

export function useTabData<T extends BaseItem>(tabType: TabType) {
	const getInitialData = (): T[] => {
		switch (tabType) {
			case "test-type":
				return mockTestTypes as T[];
			case "subject":
				return mockSubjects as T[];
			//   case "difficulty":
			//     return mockDifficulties as T[]
			case "domain":
				return mockDomains as T[];
			case "skills":
				return mockSkills as T[];
			//   case "qty-type":
			//     return mockQtyTypes as T[]
			default:
				return [];
		}
	};

	const [data, setData] = useState<T[]>(getInitialData);

	const createItem = useCallback(
		(item: Omit<T, "id" | "createdAt" | "updatedAt">) => {
			const newItem = {
				...item,
				id: crypto.randomUUID(),
				createdAt: new Date(),
				updatedAt: new Date(),
			} as T;
			setData((prev) => [...prev, newItem]);
			return newItem;
		},
		[],
	);

	const updateItem = useCallback((id: string, updates: Partial<T>) => {
		setData((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item,
			),
		);
	}, []);

	const deleteItem = useCallback((id: string) => {
		setData((prev) => prev.filter((item) => item.id !== id));
	}, []);

	const reorderItems = useCallback((startIndex: number, endIndex: number) => {
		setData((prev) => {
			const result = Array.from(prev);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);
			return result.map((item, index) => ({ ...item, order: index + 1 }));
		});
	}, []);

	return { data, createItem, updateItem, deleteItem, reorderItems };
}
