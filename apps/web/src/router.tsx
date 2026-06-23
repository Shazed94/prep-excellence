import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { getAccessToken, getUser, isLoggedIn } from "./store/useAuth";

export const queryClient = new QueryClient();

// Create a new router instance
export const router = createRouter({
	routeTree,
	scrollRestoration: true,
	// Provide auth helper functions (not the store or hook) to prevent
	// subscription issues and infinite render loops in route guards.
	context: {
		queryClient,
		auth: {
			isLoggedIn,
			getAccessToken,
			getUser,
		},
	},
	defaultPreload: "render",
});
