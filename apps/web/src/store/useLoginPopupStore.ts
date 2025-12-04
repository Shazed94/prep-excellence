// store/useLoginPopupStore.ts
import { create } from "zustand";

interface LoginPopupState {
	isLoginPopupOpen: boolean;
	openLoginPopup: () => void;
	closeLoginPopup: () => void;
	toggleLoginPopup: () => void;
}

const useLoginPopupStore = create<LoginPopupState>((set) => ({
	isLoginPopupOpen: false,
	openLoginPopup: () => set({ isLoginPopupOpen: true }),
	closeLoginPopup: () => set({ isLoginPopupOpen: false }),
	toggleLoginPopup: () =>
		set((state) => ({ isLoginPopupOpen: !state.isLoginPopupOpen })),
}));

export default useLoginPopupStore;
