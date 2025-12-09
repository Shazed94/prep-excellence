import { useEffect } from "react";
import { useAuth } from "@/store/useAuth";

interface AppInitializerProps {
	children: React.ReactNode;
}

/**
 * AppInitializer ensures auth state is hydrated before rendering children.
 * This prevents the sidebar and other components from flashing during initial load.
 */
export function AppInitializer({ children }: AppInitializerProps) {
	const { hydrate, isHydrated } = useAuth();

	useEffect(() => {
		// Hydrate auth state immediately on mount
		if (!isHydrated) {
			hydrate();
		}
	}, [hydrate, isHydrated]);

	// Show loader while hydrating
	if (!isHydrated) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-[#FAFAFA] z-50">
				<div className="flex flex-col items-center gap-3">
					<div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
					<p className="text-sm font-medium text-muted-foreground animate-pulse">
						Loading...
					</p>
				</div>
			</div>
		);
	}

	// Render children only after hydration is complete
	return <>{children}</>;
}
