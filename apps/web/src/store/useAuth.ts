import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
}

interface AuthActions {
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateAccessToken: (accessToken: string) => void;
  hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isHydrated: false,

  hydrate: () => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");
      let user = null;

      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch {
          user = null;
        }
      }

      set({ user, accessToken, isHydrated: true });
    }
  },

  setAuth: (user: User, accessToken: string, refreshToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, accessToken });
  },

  updateAccessToken: (accessToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
    }
    set({ accessToken });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    set({ user: null, accessToken: null });
  },
}));

// Helper functions outside the store to avoid subscription issues
export const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
};

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Token refresh utility
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(
      `https://backend-prepexcellence.trodad.com/api/v1/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!response.ok) {
      // Refresh token is invalid, logout
      useAuth.getState().logout();
      return null;
    }

    const data = await response.json();
    if (data.data?.accessToken) {
      useAuth.getState().updateAccessToken(data.data.accessToken);
      return data.data.accessToken;
    }

    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
};
