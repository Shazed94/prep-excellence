// store/useLoginPopupStore.ts
import { create } from "zustand";

interface LoginPopupState {
	isLoginPopupOpen: boolean;
	redirectUrl: string | null;
	openLoginPopup: (redirectUrl?: string) => void;
	closeLoginPopup: () => void;
	toggleLoginPopup: () => void;

	// add signup
	isSignupPopupOpen: boolean;
	openSignupPopup: () => void;
	closeSignupPopup: () => void;
	toggleSignupPopup: () => void;
}

const useLoginPopupStore = create<LoginPopupState>((set) => ({
	isLoginPopupOpen: false,
	redirectUrl: null,
	openLoginPopup: (redirectUrl?: string) => set({ isLoginPopupOpen: true, redirectUrl: redirectUrl || null }),
	closeLoginPopup: () => set({ isLoginPopupOpen: false, redirectUrl: null }),
	toggleLoginPopup: () =>
		set((state) => ({ isLoginPopupOpen: !state.isLoginPopupOpen })),

	// signup popup
	isSignupPopupOpen: false,
	openSignupPopup: () => set({ isSignupPopupOpen: true }),
	closeSignupPopup: () => set({ isSignupPopupOpen: false }),
	toggleSignupPopup: () =>
		set((state) => ({ isSignupPopupOpen: !state.isSignupPopupOpen })),
}));

export default useLoginPopupStore;
