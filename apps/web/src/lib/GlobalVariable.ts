export const BACKEND_URL_V1 =
	import.meta.env.MODE === "production"
		? "https://backend-prepexcellence.trodad.com/api/v1"
		: "http://192.168.68.126:3050/api/v1";
