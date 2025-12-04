import type { Server as HTTPServer } from "node:http";
import jwt from "jsonwebtoken";
import { Server, type Socket } from "socket.io";
import config from "../../config";
import { AppError } from "../../utils/AppError";
import logger from "../../utils/logger";

export interface AuthenticatedSocket extends Socket {
	userId: string;
	email: string;
}

export interface SocketUser {
	socketId: string;
	userId: string;
	email: string;
	connectedAt: Date;
}

class SocketService {
	private io: Server | null = null;
	private connectedUsers: Map<string, SocketUser> = new Map();

	initialize(httpServer: HTTPServer): Server {
		this.io = new Server(httpServer, {
			cors: {
				origin: config.cors.origin,
				credentials: true,
			},
			pingTimeout: 60000,
			pingInterval: 25000,
		});

		// Authentication middleware
		this.io.use(async (socket: Socket, next) => {
			try {
				const token =
					socket.handshake.auth.token ||
					socket.handshake.headers.authorization?.split(" ")[1];

				if (!token) {
					return next(new Error("Authentication token required"));
				}

				const decoded = jwt.verify(token, config.jwt.secret) as {
					userId: string;
					email: string;
				};

				(socket as AuthenticatedSocket).userId = decoded.userId;
				(socket as AuthenticatedSocket).email = decoded.email;

				next();
			} catch (error) {
				logger.error("Socket authentication error:", error);
				next(new Error("Invalid authentication token"));
			}
		});

		// Connection handling
		this.io.on("connection", (socket: Socket) => {
			const authSocket = socket as AuthenticatedSocket;
			this.handleConnection(authSocket);
		});

		logger.info("Socket.IO initialized successfully");
		return this.io;
	}

	private handleConnection(socket: AuthenticatedSocket): void {
		const { userId, email } = socket;

		// Store connected user
		this.connectedUsers.set(socket.id, {
			socketId: socket.id,
			userId,
			email,
			connectedAt: new Date(),
		});

		logger.info(`User connected: ${email} (${socket.id})`);

		// Join user to their personal room
		socket.join(`user:${userId}`);

		// Emit online status to friends/contacts
		this.emitUserOnline(userId);

		// Handle events
		this.registerEventHandlers(socket);

		// Handle disconnection
		socket.on("disconnect", () => {
			this.handleDisconnection(socket);
		});
	}

	private registerEventHandlers(socket: AuthenticatedSocket): void {
		const { userId } = socket;

		// Join room
		socket.on("join:room", (roomId: string) => {
			socket.join(roomId);
			logger.info(`User ${userId} joined room: ${roomId}`);
			this.io?.to(roomId).emit("user:joined", { userId, roomId });
		});

		// Leave room
		socket.on("leave:room", (roomId: string) => {
			socket.leave(roomId);
			logger.info(`User ${userId} left room: ${roomId}`);
			this.io?.to(roomId).emit("user:left", { userId, roomId });
		});

		// Send message to room
		socket.on(
			"message:send",
			(data: { roomId: string; message: string; metadata?: any }) => {
				this.io?.to(data.roomId).emit("message:received", {
					userId,
					roomId: data.roomId,
					message: data.message,
					metadata: data.metadata,
					timestamp: new Date(),
				});
			},
		);

		// Typing indicators
		socket.on("typing:start", (roomId: string) => {
			socket.to(roomId).emit("user:typing", { userId, roomId });
		});

		socket.on("typing:stop", (roomId: string) => {
			socket.to(roomId).emit("user:stopped-typing", { userId, roomId });
		});

		// Direct message
		socket.on(
			"dm:send",
			(data: { recipientId: string; message: string; metadata?: any }) => {
				this.io?.to(`user:${data.recipientId}`).emit("dm:received", {
					senderId: userId,
					message: data.message,
					metadata: data.metadata,
					timestamp: new Date(),
				});
			},
		);

		// Notification
		socket.on("notification:read", (notificationId: string) => {
			// Handle notification read status
			logger.info(`User ${userId} read notification: ${notificationId}`);
		});

		// Presence
		socket.on(
			"presence:update",
			(status: "online" | "away" | "busy" | "offline") => {
				this.io?.emit("user:presence", { userId, status });
			},
		);

		// Video call signals (WebRTC)
		socket.on("call:offer", (data: { recipientId: string; offer: any }) => {
			this.io?.to(`user:${data.recipientId}`).emit("call:offer", {
				callerId: userId,
				offer: data.offer,
			});
		});

		socket.on("call:answer", (data: { callerId: string; answer: any }) => {
			this.io?.to(`user:${data.callerId}`).emit("call:answer", {
				recipientId: userId,
				answer: data.answer,
			});
		});

		socket.on(
			"call:ice-candidate",
			(data: { recipientId: string; candidate: any }) => {
				this.io?.to(`user:${data.recipientId}`).emit("call:ice-candidate", {
					senderId: userId,
					candidate: data.candidate,
				});
			},
		);

		socket.on("call:end", (recipientId: string) => {
			this.io
				?.to(`user:${recipientId}`)
				.emit("call:ended", { callerId: userId });
		});
	}

	private handleDisconnection(socket: AuthenticatedSocket): void {
		const { userId, email } = socket;
		this.connectedUsers.delete(socket.id);
		logger.info(`User disconnected: ${email} (${socket.id})`);

		// Emit offline status
		this.emitUserOffline(userId);
	}

	// Public API methods

	/**
	 * Emit event to specific user
	 */
	emitToUser(userId: string, event: string, data: any): void {
		if (!this.io) throw new AppError("Socket.IO not initialized", 500);
		this.io.to(`user:${userId}`).emit(event, data);
	}

	/**
	 * Emit event to specific room
	 */
	emitToRoom(roomId: string, event: string, data: any): void {
		if (!this.io) throw new AppError("Socket.IO not initialized", 500);
		this.io.to(roomId).emit(event, data);
	}

	/**
	 * Emit event to all connected clients
	 */
	emitToAll(event: string, data: any): void {
		if (!this.io) throw new AppError("Socket.IO not initialized", 500);
		this.io.emit(event, data);
	}

	/**
	 * Send notification to user
	 */
	sendNotification(
		userId: string,
		notification: { title: string; message: string; type: string; data?: any },
	): void {
		this.emitToUser(userId, "notification:new", {
			...notification,
			timestamp: new Date(),
		});
	}

	/**
	 * Send notification to multiple users
	 */
	sendBulkNotifications(
		userIds: string[],
		notification: { title: string; message: string; type: string; data?: any },
	): void {
		userIds.forEach((userId) => {
			this.sendNotification(userId, notification);
		});
	}

	/**
	 * Get online users count
	 */
	getOnlineUsersCount(): number {
		return this.connectedUsers.size;
	}

	/**
	 * Get all connected users
	 */
	getConnectedUsers(): SocketUser[] {
		return Array.from(this.connectedUsers.values());
	}

	/**
	 * Check if user is online
	 */
	isUserOnline(userId: string): boolean {
		return Array.from(this.connectedUsers.values()).some(
			(user) => user.userId === userId,
		);
	}

	/**
	 * Get user's socket IDs
	 */
	getUserSockets(userId: string): string[] {
		return Array.from(this.connectedUsers.values())
			.filter((user) => user.userId === userId)
			.map((user) => user.socketId);
	}

	/**
	 * Disconnect user
	 */
	disconnectUser(userId: string): void {
		if (!this.io) throw new AppError("Socket.IO not initialized", 500);

		const socketIds = this.getUserSockets(userId);
		socketIds.forEach((socketId) => {
			const socket = this.io?.sockets.sockets.get(socketId);
			socket?.disconnect(true);
		});
	}

	/**
	 * Emit user online status
	 */
	private emitUserOnline(userId: string): void {
		this.emitToAll("user:online", { userId, timestamp: new Date() });
	}

	/**
	 * Emit user offline status
	 */
	private emitUserOffline(userId: string): void {
		// Only emit offline if user has no other connections
		if (!this.isUserOnline(userId)) {
			this.emitToAll("user:offline", { userId, timestamp: new Date() });
		}
	}

	/**
	 * Get Socket.IO server instance
	 */
	getIO(): Server {
		if (!this.io) throw new AppError("Socket.IO not initialized", 500);
		return this.io;
	}

	/**
	 * Close Socket.IO server
	 */
	async close(): Promise<void> {
		if (this.io) {
			await new Promise<void>((resolve) => {
				this.io?.close(() => {
					logger.info("Socket.IO server closed");
					resolve();
				});
			});
			this.io = null;
			this.connectedUsers.clear();
		}
	}
}

export default new SocketService();
