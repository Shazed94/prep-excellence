import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import "react-phone-number-input/style.css";
import NotFound from "@/components/NotFound";

interface MyRouterContext {
	queryClient: QueryClient;
	auth: {
		isLoggedIn: () => boolean;
		getAccessToken: () => string | null;
		getUser: () => unknown | null;
	};
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	notFoundComponent: () => {
		return <NotFound />;
	},
	component: RootDocument,
});

function RootDocument() {
	return (
		<>
			<Outlet />
		</>
	);
}
