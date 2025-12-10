// src/lib/axios.ts
import Axios from "axios";
import { BACKEND_URL_V1 } from "./GlobalVariable";

const axiosInstance = Axios.create({
	baseURL: BACKEND_URL_V1 || "http://localhost:3000/api",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor — add auth token automatically
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("accessToken");
		console.log("tokendddddddddddddddddddd", token);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response interceptor — handle common errors globally
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Optional: redirect to login or trigger logout
			localStorage.removeItem("accessToken");
			window.location.href = "/login";
		}
		// You can use toast notifications here
		// toast.error(error.response?.data?.message || "Something went wrong");
		return Promise.reject(error);
	},
);

export default axiosInstance;
