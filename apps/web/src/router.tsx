import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { getAccessToken, getUser, isLoggedIn } from "./store/useAuth";

const rqContext = TanstackQuery.getContext();
export const queryClient = rqContext.queryClient;

export const router = createRouter({
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

export const getRouter = () => router;
