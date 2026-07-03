import { AccessToken } from "livekit-server-sdk";
import config from "@/config";
import { AppError } from "@/utils/AppError";

/**
 * LiveKit token service.
 *
 * Generates short-lived join tokens for 1-on-1 (and live coaching) sessions.
 * This replaces the previous Jitsi placeholder. Tokens are minted on demand
 * at join time and are NEVER stored — the room name is the only durable value
 * (reusing the session's existing `jitsiRoomId` column as the room id).
 *
 * Credentials come exclusively from environment variables
 * (LIVEKIT_URL / LIVEKIT_API_KEY / LIVEKIT_API_SECRET).
 */

export type MeetingRole = "HOST" | "GUEST";

export interface JoinInfo {
	serverUrl: string;
	token: string;
	room: string;
	role: MeetingRole;
	identity: string;
}

function assertConfigured() {
	const { url, apiKey, apiSecret } = config.livekit;
	if (!url || !apiKey || !apiSecret) {
		throw new AppError(
			"Video calling is not configured. Set LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET.",
			503,
		);
	}
}

/**
 * Create a LiveKit join token for a participant.
 *
 * HOST (teacher) gets room-admin rights (can end the room, mute others).
 * GUEST (student) can publish and subscribe but not administer the room.
 */
export async function createJoinToken(params: {
	room: string;
	identity: string;
	name: string;
	role: MeetingRole;
	ttlSeconds?: number;
}): Promise<JoinInfo> {
	assertConfigured();
	const { room, identity, name, role, ttlSeconds = 60 * 60 } = params;

	const at = new AccessToken(config.livekit.apiKey, config.livekit.apiSecret, {
		identity,
		name,
		ttl: ttlSeconds,
		metadata: JSON.stringify({ role }),
	});

	at.addGrant({
		roomJoin: true,
		room,
		canPublish: true,
		canSubscribe: true,
		canPublishData: true,
		roomAdmin: role === "HOST",
	});

	const token = await at.toJwt();

	return {
		serverUrl: config.livekit.url,
		token,
		room,
		role,
		identity,
	};
}
