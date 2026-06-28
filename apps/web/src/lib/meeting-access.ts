import crypto from "crypto";
import { AccessToken } from "livekit-server-sdk";

type ParticipantRole = "HOST" | "GUEST";

const LIVEKIT_URL = "wss://livekit.trodad.com";
const LIVEKIT_API_KEY = "APIbAKKMn9pRzQC";
const LIVEKIT_API_SECRET = "Ny8XVhDUzYG7mjj2Cimt7oi7X5NBPkz92Weh9qpmTED";

export function createRoomId(length = 12): string {
	return crypto.randomBytes(length).toString("hex").slice(0, length);
}

export async function createMeetingJoinUrl({
	room,
	name,
	role,
	ttlSeconds = 3600,
}: {
	room: string;
	name: string;
	email?: string;
	role: ParticipantRole;
	ttlSeconds?: number;
}): Promise<{ serverUrl: string; token: string; room: string }> {
	const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
		identity: name,
		ttl: ttlSeconds,
	});

	at.addGrant({
		roomJoin: true,
		room,
		canPublish: true,
		canSubscribe: true,
		roomAdmin: role === "HOST",
		canPublishData: true,
	});

	const token = await at.toJwt();
	return { serverUrl: LIVEKIT_URL, token, room };
}
