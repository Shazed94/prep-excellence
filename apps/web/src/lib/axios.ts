// src/lib/axios.ts
import Axios from "axios";
import { toast } from "sonner";
import { BACKEND_URL_V1 } from "./GlobalVariable";

const axiosInstance = Axios.create({
	baseURL: BACKEND_URL_V1 || "http://localhost:3000/api",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
	paramsSerializer: {
		serialize: (params) => {
			const searchParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					if (typeof value === "object" && !Array.isArray(value)) {
						// Serialize nested objects as JSON
						searchParams.append(key, JSON.stringify(value));
					} else {
						searchParams.append(key, String(value));
					}
				}
			});
			return searchParams.toString();
		},
	},
});

// Request interceptor — add auth token automatically
axiosInstance.interceptors.request.use(
	(config) => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("accessToken");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}

		// Handle FormData — don't set Content-Type, let browser set it
		if (config.data instanceof FormData) {
			delete config.headers["Content-Type"];
		}

		return config;
	},
	(error) => Promise.reject(error),
);

// Response interceptor — handle common errors globally
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401 && typeof window !== "undefined") {
			localStorage.removeItem("accessToken");
			toast.error(error.response?.data?.message || "Unauthorized");
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
