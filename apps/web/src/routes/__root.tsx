import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import "react-phone-number-input/style.css";
import { AppInitializer } from "@/components/AppInitializer";
import NotFound from "@/components/NotFound";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { Toaster } from "@/components/ui/sonner";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import "../styles.css"; // 🔥 THIS FIXES FOUC
import "react-phone-number-input/style.css";

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
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Prep Excellence - Find the Best Course for Your Child" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
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
        <style>{`
    body {
      visibility: hidden;
    }
  `}</style>
      </head>
      <body
        onLoad={() => {
          document.body.style.visibility = "visible";
        }}
      >
        <AppInitializer>
          {children}

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
          <ScrollToTopButton />
        </AppInitializer>
        <Scripts />
      </body>
    </html>
  );
}
