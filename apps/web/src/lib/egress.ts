import config from "#/config";
import type { RoomCompositeOptions } from "livekit-server-sdk";
import {
    EgressClient,
    EncodedFileOutput,
    S3Upload,
    WebhookConfig,
} from "livekit-server-sdk";

/**
 * LiveKit host URL for the HTTP API (twirp).
 * Derived from the WebSocket URL by replacing "wss://" with "https://".
 */
function getLiveKitHost(): string {
	const wsUrl = config.livekit.url; // e.g. "wss://livekit.trodad.com"
	if (wsUrl.startsWith("wss://")) {
		return "https://" + wsUrl.slice(6);
	}
	if (wsUrl.startsWith("ws://")) {
		return "http://" + wsUrl.slice(5);
	}
	// fallback: assume it's already https
	return wsUrl;
}

let _egressClient: EgressClient | null = null;

function getEgressClient(): EgressClient {
	if (!_egressClient) {
		_egressClient = new EgressClient(
			getLiveKitHost(),
			config.livekit.apiKey,
			config.livekit.apiSecret,
		);
	}
	return _egressClient;
}

/**
 * Build an S3Upload config pointing to the project's MinIO instance.
 * Uses a dedicated "recordings" sub-folder or bucket for call recordings.
 */
function buildS3Output(filepath: string): EncodedFileOutput {
	const s3Config: Partial<S3Upload> = {
		accessKey: config.minio.accessKey,
		secret: config.minio.secretKey,
		bucket: config.minio.bucket,
		region: config.minio.region,
		endpoint: `http${config.minio.useSSL ? "s" : ""}://${config.minio.endpoint}:${config.minio.port}`,
		forcePathStyle: true,
	};

	// The EncodedFileOutput type uses a oneof `output` field in TypeScript,
	// but the protobuf JS runtime expects the proto field name `s3` directly.
	// Using `as any` to bypass the type mismatch — the SDK's isEncodedFileOutput
	// checks for `filepath` and the protobuf toJson() handles `s3` correctly.
	const output = {
		filepath,
		s3: s3Config,
	} as unknown as EncodedFileOutput;

	return output;
}

export interface StartRecordingResult {
	egressId: string;
	audioOnly: boolean;
}

/**
 * Start recording a LiveKit room as an MP4 file.
 * The recording is uploaded to MinIO under a `recordings/` prefix.
 */
export async function startRoomRecording(
	roomName: string,
	roomId: string,
	webhookUrl?: string,
): Promise<StartRecordingResult> {
	const client = getEgressClient();

	// e.g. "recordings/2026/06/07/<room-id>.mp4"
	const now = new Date();
	const datePath = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
	const filepath = `recordings/${datePath}/${roomId}.mp4`;

	const options: RoomCompositeOptions = {
		audioOnly: false,
		videoOnly: false,
	};

	// Add webhook config if URL is provided
	if (webhookUrl) {
		const webhookConfig = new WebhookConfig({
			url: webhookUrl,
			signingKey: config.livekit.apiSecret,
		});
		options.webhooks = [webhookConfig];
	}

	const info = await client.startRoomCompositeEgress(
		roomName,
		buildS3Output(filepath),
		options,
	);

	return { egressId: info.egressId, audioOnly: false };
}

/**
 * Start recording with automatic fallback to audio-only.
 * Tries video recording first. If the egress service rejects the request
 * due to insufficient CPU (error contains "no response from servers" or
 * "not enough cpu"), falls back to audio-only recording.
 * Returns the result along with a flag indicating whether audio-only mode
 * was used, so the UI can display a warning.
 */
export async function startRoomRecordingWithFallback(
	roomName: string,
	roomId: string,
	webhookUrl?: string,
): Promise<StartRecordingResult> {
	try {
		// Attempt video recording first
		return await startRoomRecording(roomName, roomId, webhookUrl);
	} catch (videoErr: unknown) {
		const videoMsg =
			videoErr instanceof Error ? videoErr.message : String(videoErr);
		const isResourceError =
			videoMsg.includes("no response from servers") ||
			videoMsg.includes("not enough cpu") ||
			videoMsg.includes("cpu") ||
			videoMsg.includes("503") ||
			videoMsg.includes("unavailable");

		if (!isResourceError) {
			// Not a CPU/resource issue — re-throw
			throw videoErr;
		}

		console.warn(
			`[Egress] Video recording failed (${videoMsg}). Falling back to audio-only.`,
		);

		// Fall back to audio-only recording
		return startAudioRecording(roomName, roomId, webhookUrl);
	}
}

/**
 * Start recording a LiveKit room with audio-only output.
 */
export async function startAudioRecording(
	roomName: string,
	roomId: string,
	webhookUrl?: string,
): Promise<StartRecordingResult> {
	const client = getEgressClient();

	const now = new Date();
	const datePath = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
	const filepath = `recordings/${datePath}/${roomId}_audio.mp4`;

	const options: RoomCompositeOptions = {
		audioOnly: true,
	};

	if (webhookUrl) {
		options.webhooks = [
			new WebhookConfig({
				url: webhookUrl,
				signingKey: config.livekit.apiSecret,
			}),
		];
	}

	const info = await client.startRoomCompositeEgress(
		roomName,
		buildS3Output(filepath),
		options,
	);

	return { egressId: info.egressId, audioOnly: true };
}

/**
 * Stop an active egress recording.
 */
export async function stopRecording(egressId: string): Promise<void> {
	const client = getEgressClient();
	await client.stopEgress(egressId);
}

/**
 * List active egresses (optionally filtered by room name).
 */
export async function listEgresses(roomName?: string) {
	const client = getEgressClient();
	return client.listEgress(roomName);
}

/**
 * Build a public URL for a recording stored in MinIO.
 */
export function buildRecordingUrl(storagePath: string): string {
	const base = config.storage_url.public_url.replace(/\/$/, "");
	return `${base}/${config.minio.bucket}/${storagePath}`;
}
