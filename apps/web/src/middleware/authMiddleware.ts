import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import jwt from "jsonwebtoken";

export const authMiddleware = createMiddleware().server(async (options) => {
	const { next, request } = options;
	const cookieHeader = request.headers.get("cookie") || "";
	const accessToken = cookieHeader
		.split("; ")
		.find((c) => c.startsWith("accessToken="))
		?.split("=")[1];

	if (!accessToken) {
		// Redirect to login if no token
		throw redirect({
			to: "/",
		});
	}

	try {
		// Verify token (replace 'SECRET_KEY' with your JWT secret)
		const user = jwt.verify(
			accessToken,
			process.env.JWT_SECRET || "SECRET_KEY",
		);
		return next({
			context: { user }, // pass user info to next middleware / server functions
		});
	} catch (_err) {
		throw redirect({
			to: "/",
		});
	}
});
