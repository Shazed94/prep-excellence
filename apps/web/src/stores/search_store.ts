import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware"; // ১. ইমপোর্ট করুন

// ২. টাইপ ডিফিনিশন (আগের মতোই আছে)
type SearchItem = {
	id: string;
	name: string;
};

export interface UserSearchStoreState {
	testType: SearchItem | null;
	setTestType: (testType: SearchItem | null) => void;

	subject: SearchItem | null;
	setSubject: (subject: SearchItem | null) => void;

	domain: SearchItem[];
	setDomain: (domain: SearchItem[]) => void;
}

// ৩. Store তৈরি করার সময় persist ব্যবহার করুন
const useSearchStore = create<UserSearchStoreState>()(
	persist(
		(set) => ({
			testType: null,
			setTestType: (testType) => set({ testType }),

			subject: null,
			setSubject: (subject) => set({ subject }),

			domain: [],
			setDomain: (domain) => set({ domain }),
		}),
		{
			name: "user-search-storage", // LocalStorage-এ যে নামে সেভ থাকবে
			storage: createJSONStorage(() => localStorage), // LocalStorage ব্যবহার করবে
		},
	),
);

export default useSearchStore;
