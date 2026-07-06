import { GoogleOAuthProvider } from "@react-oauth/google";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppInitializer } from "@/components/AppInitializer";
import { Toaster } from "@/components/ui/sonner";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import { GOOGLE_CLIENT_ID } from "@/lib/GlobalVariable";
import { getRouter } from "./router";

import "./styles.css";

const router = getRouter();
const queryClient = router.options.context!.queryClient;

function App() {
	return (
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<AppInitializer>
					<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
						<RouterProvider router={router} />

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
					</GoogleOAuthProvider>
				</AppInitializer>
			</QueryClientProvider>
		</StrictMode>
	);
}

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
