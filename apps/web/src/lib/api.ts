import { getAccessToken, refreshAccessToken, useAuth } from "@/store/useAuth";

// const API_BASE_URL = "http://192.168.68.127:3000/api/v1";
const API_BASE_URL = "https://backend-prepexcellence.trodad.com/api/v1";

interface RequestConfig extends RequestInit {
	skipAuth?: boolean;
}

/**
 * Authenticated fetch wrapper that automatically handles token refresh
 */
export async function apiFetch(
	endpoint: string,
	config: RequestConfig = {},
): Promise<Response> {
	const { skipAuth, ...fetchConfig } = config;

	// Prepare headers
	const headers = new Headers(fetchConfig.headers);
	if (!headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	// Add auth token if not skipped
	if (!skipAuth) {
		const token = getAccessToken();
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
	}

	// Make request
	let response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...fetchConfig,
		headers,
	});

	// If unauthorized and we have auth, try to refresh token
	if (response.status === 401 && !skipAuth) {
		const newToken = await refreshAccessToken();

		if (newToken) {
			// Retry request with new token
			headers.set("Authorization", `Bearer ${newToken}`);
			response = await fetch(`${API_BASE_URL}${endpoint}`, {
				...fetchConfig,
				headers,
			});
		} else {
			// Refresh failed, logout user
			useAuth.getState().logout();
			if (typeof window !== "undefined") {
				window.location.href = "/";
			}
		}
	}

	return response;
}

/**
 * Helper for GET requests
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
	const response = await apiFetch(endpoint);
	if (!response.ok) {
		throw new Error(`API Error: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Helper for POST requests
 */
export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
	const response = await apiFetch(endpoint, {
		method: "POST",
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || `API Error: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Helper for PUT requests
 */
export async function apiPut<T>(endpoint: string, data: unknown): Promise<T> {
	const response = await apiFetch(endpoint, {
		method: "PUT",
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || `API Error: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Helper for DELETE requests
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
	const response = await apiFetch(endpoint, {
		method: "DELETE",
	});
	if (!response.ok) {
		throw new Error(`API Error: ${response.statusText}`);
	}
	return response.json();
}
