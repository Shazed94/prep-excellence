export const BACKEND_URL_V1 =
	import.meta.env.MODE === "production"
		? "https://backend-prepexcellence.trodad.com/api/v1"
		: "http://localhost:3050/api/v1";

export const FRONTEND_URL =
	import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000";
