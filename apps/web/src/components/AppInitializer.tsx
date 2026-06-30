import { useEffect } from "react";
import { useAuth } from "@/store/useAuth";

interface AppInitializerProps {
	children: React.ReactNode;
}

/**
 * AppInitializer hydrates auth state from localStorage on mount.
 * Renders children immediately — no blocking spinner — to avoid SSR
 * hydration mismatches and the "Loading..." flash on every page load.
 */
export function AppInitializer({ children }: AppInitializerProps) {
	const { hydrate, isHydrated } = useAuth();

	useEffect(() => {
		if (!isHydrated) {
			hydrate();
		}
	}, [hydrate, isHydrated]);

	return <>{children}</>;
}
