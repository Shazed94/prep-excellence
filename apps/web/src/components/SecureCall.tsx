import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useRef } from "react";

interface SecureCallProps {
  serverUrl: string;
  token: string;
  onCallEnd?: () => void;
  onRoomConnected?: () => void;
  onHostDisconnected?: () => void;
  audioOnly?: boolean;
}

/**
 * Hook that watches for the host (first admin participant) leaving the room.
 * When the host disconnects, calls onHostDisconnected.
 */
function useHostDisconnectMonitor(onHostDisconnected?: () => void) {
  const room = useRoomContext();
  const onHostDisconnectedRef = useRef(onHostDisconnected);
  onHostDisconnectedRef.current = onHostDisconnected;

  useEffect(() => {
    if (!room) return;

    const handleDisconnected = () => {
      console.log("[SecureCall] Local participant disconnected");
      onHostDisconnectedRef.current?.();
    };

    const handleParticipantDisconnected = () => {
      const participants = room.remoteParticipants;
      const hasHostRemaining = Array.from(participants.values()).some(
        (p) =>
          p.identity?.toLowerCase().includes("host") ||
          p.identity?.toLowerCase().includes("admin") ||
          p.identity?.toLowerCase().includes("amar advocate"),
      );

      if (!hasHostRemaining) {
        console.log(
          "[SecureCall] Host participant disconnected, no host remaining",
        );
        onHostDisconnectedRef.current?.();
      }
    };

    room.on("disconnected", handleDisconnected);
    room.on("participantDisconnected", handleParticipantDisconnected);

    return () => {
      room.off("disconnected", handleDisconnected);
      room.off("participantDisconnected", handleParticipantDisconnected);
    };
  }, [room]);
}

export default function SecureCall({
  serverUrl,
  token,
  onCallEnd,
  onRoomConnected,
  onHostDisconnected,
  audioOnly = false,
}: SecureCallProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-[var(--border-default)]"
      style={{ height: "calc(100vh - 160px)", minHeight: 400 }}
    >
      <LiveKitRoom
        serverUrl={serverUrl}
        token={token}
        video={!audioOnly}
        audio={true}
        onConnected={() => onRoomConnected?.()}
        onDisconnected={() => onCallEnd?.()}
        data-lk-theme="default"
        style={{ height: "100%" }}
      >
        <HostDisconnectWrapper onHostDisconnected={onHostDisconnected} />
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}

function HostDisconnectWrapper({
  onHostDisconnected,
}: {
  onHostDisconnected?: () => void;
}) {
  useHostDisconnectMonitor(onHostDisconnected);
  return null;
}
