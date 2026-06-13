import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import "react-phone-number-input/style.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppInitializer } from "@/components/AppInitializer";
import NotFound from "@/components/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { GOOGLE_CLIENT_ID } from "@/lib/GlobalVariable";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

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
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Prep Excellence - Find the Best Course for Your Child",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			// ─── Poppins: Preconnect (faster loading) ───
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},

			// ─── Preload critical weights (optional but amazing for FCP) ───
			{
				rel: "preload",
				as: "style",
				href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap",
			},

			// ─── Load Poppins (with display=swap) ───
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap",
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<AppInitializer>
					<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
						{children}
					</GoogleOAuthProvider>

					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
					<Toaster richColors />
					{/* <ScrollToTopButton /> */}
				</AppInitializer>
				<Scripts />
			</body>
		</html>
	);
}
