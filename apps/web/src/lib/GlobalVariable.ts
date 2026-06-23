export const BACKEND_URL_V1 =
	import.meta.env.MODE === "production"
		? "https://backend-prepexcellence.trodad.com/api/v1"
		: "http://localhost:3080/api/v1";

export const FRONTEND_URL =
	import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000";

export const GOOGLE_CLIENT_ID =
	import.meta.env.VITE_GOOGLE_CLIENT_ID ||
	"REDACTED";
