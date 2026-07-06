import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { getAccessToken, getUser, isLoggedIn } from "./store/useAuth";

export function getRouter() {
	const rqContext = TanstackQuery.getContext();

	const router = createTanstackRouter({
		routeTree,
		scrollRestoration: true,
		context: {
			...rqContext,
			auth: {
				isLoggedIn,
				getAccessToken,
				getUser,
			},
		},
		defaultPreload: "intent",
		Wrap: (props: { children: React.ReactNode }) => {
			return (
				<TanstackQuery.Provider {...rqContext}>
					{props.children}
				</TanstackQuery.Provider>
			);
		},
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	return router;
}
