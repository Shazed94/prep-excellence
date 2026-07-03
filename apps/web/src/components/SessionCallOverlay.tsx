import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import SecureCall from "@/components/SecureCall";
import { Button } from "@/components/ui/button";
import { useGetSessionJoinInfo } from "@/hooks/onetoone";

/**
 * Full-screen in-app LiveKit call overlay.
 *
 * Replaces the old "open Jitsi link in a new tab" flow. When opened it fetches
 * a short-lived join token from `GET /onetoone/sessions/:id/join` and renders
 * the LiveKit room inline. No separate route required.
 */
export default function SessionCallOverlay({
	sessionId,
	title,
	onClose,
}: {
	sessionId: string;
	title?: string;
	onClose: () => void;
}) {
	const { data, isLoading, isError, error } = useGetSessionJoinInfo(
		sessionId,
		true,
	);

	const join = data?.data;

	useEffect(() => {
		if (isError) {
			const message =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message ?? "Could not join the session.";
			toast.error(message);
		}
	}, [isError, error]);

	// Lock body scroll while the call is open.
	useEffect(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, []);

	return (
		<div className="fixed inset-0 z-[100] flex flex-col bg-[#0d0d0d]">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
				<div className="min-w-0">
					<p className="truncate font-switzer text-sm font-semibold text-white">
						{title ?? "Live session"}
					</p>
					{join?.role && (
						<p className="text-[11px] text-white/50">
							Joined as {join.role === "HOST" ? "host" : "participant"}
						</p>
					)}
				</div>
				<Button
					size="sm"
					variant="ghost"
					onClick={onClose}
					className="gap-1.5 text-white hover:bg-white/10 hover:text-white"
				>
					<X size={15} /> Leave
				</Button>
			</div>

			{/* Body */}
			<div className="flex flex-1 items-center justify-center p-3">
				{isLoading && (
					<div className="flex flex-col items-center gap-3 text-white/70">
						<Loader2 className="h-6 w-6 animate-spin" />
						<p className="text-sm">Connecting to the session…</p>
					</div>
				)}

				{isError && (
					<div className="flex flex-col items-center gap-3 text-center text-white/70">
						<p className="text-sm">
							{(error as { response?: { data?: { message?: string } } })
								?.response?.data?.message ?? "Could not join the session."}
						</p>
						<Button size="sm" variant="outline" onClick={onClose}>
							Close
						</Button>
					</div>
				)}

				{join && (
					<div className="h-full w-full max-w-6xl">
						<SecureCall
							serverUrl={join.serverUrl}
							token={join.token}
							onCallEnd={onClose}
							onHostDisconnected={
								join.role === "GUEST"
									? () => {
											toast.info("The host has ended the session.");
											onClose();
										}
									: undefined
							}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
