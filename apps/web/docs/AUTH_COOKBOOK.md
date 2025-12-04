# Common Authentication Tasks

## Adding a New Protected Route

1. Create route file under `/src/routes/admin/`:

```tsx
// src/routes/admin/new-page.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/new-page")({
  component: NewPage,
});

function NewPage() {
  return <div>New protected page</div>;
}
```

2. Add link in `/src/routes/admin/_layout.tsx`:

```tsx
<NavLink to="/admin/new-page" label="New Page" />
```

That's it! The `_layout.tsx` already handles auth checking for all children.

---

## Making Authenticated API Calls

### Using React Query (Recommended)

```tsx
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["myData"],
    queryFn: () => apiGet<MyDataType>("/endpoint"),
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

### Using useEffect

```tsx
import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiGet("/endpoint").then(setData);
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
```

### Direct Call

```tsx
import { apiPost } from "@/lib/api";

async function handleSubmit(formData) {
  try {
    const result = await apiPost("/endpoint", formData);
    alert("Success!");
  } catch (error) {
    alert("Error: " + error.message);
  }
}
```

---

## Accessing User Data in Components

```tsx
import { getUser } from "@/store/useAuth";

function MyComponent() {
  const user = getUser();

  return (
    <div>
      <p>Email: {user?.email}</p>
      <p>Name: {user?.name}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}
```

Or use the store for reactive updates:

```tsx
import { useAuth } from "@/store/useAuth";

function MyComponent() {
  const { user } = useAuth();

  return <div>Email: {user?.email}</div>;
}
```

---

## Changing API Base URL

### Option 1: Environment Variables (Recommended)

1. Create `.env`:

```env
VITE_API_BASE_URL=http://192.168.68.131:3000/api/v1
```

2. Update `src/lib/api.ts`:

```tsx
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
```

3. Update `src/store/useAuth.ts` refresh function:

```tsx
const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
  {
    // ...
  }
);
```

### Option 2: Config File

1. Create `src/config/api.ts`:

```tsx
export const API_BASE_URL = "http://192.168.68.131:3000/api/v1";
```

2. Import in `api.ts` and `useAuth.ts`:

```tsx
import { API_BASE_URL } from "@/config/api";
```

---

## Implementing Role-Based Access Control (RBAC)

1. Update route guard in `_layout.tsx`:

```tsx
beforeLoad: async ({ context }) => {
  const loggedIn = context.auth?.isLoggedIn() ?? false;
  const user = context.auth?.getUser();

  if (!loggedIn) {
    throw redirect({ to: "/", search: { from: "/admin" } });
  }

  // Check if user has admin role
  if (user?.role !== "admin") {
    throw redirect({ to: "/", search: { error: "unauthorized" } });
  }
},
```

2. Create role-specific layouts:

```tsx
// src/routes/admin/super-admin/_layout.tsx
beforeLoad: async ({ context }) => {
  const user = context.auth?.getUser();
  if (user?.role !== "super-admin") {
    throw redirect({ to: "/admin" });
  }
},
```

---

## Adding Remember Me Functionality

1. Update `LoginPopup.tsx` to add checkbox:

```tsx
const [rememberMe, setRememberMe] = useState(false);

// In form:
<label>
  <input
    type="checkbox"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
  />
  Remember Me
</label>;
```

2. Update `useAuth.ts` to use different storage:

```tsx
setAuth: (user, accessToken, refreshToken, remember = false) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("accessToken", accessToken);
  storage.setItem("refreshToken", refreshToken);
  storage.setItem("user", JSON.stringify(user));
  set({ user, accessToken });
},
```

3. Update helper functions to check both storages:

```tsx
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
  );
};
```

---

## Handling Session Expiration

1. Create a session monitor hook:

```tsx
// src/hooks/useSessionMonitor.ts
import { useEffect } from "react";
import { useAuth } from "@/store/useAuth";

export function useSessionMonitor(timeoutMinutes = 30) {
  const { logout } = useAuth();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(
        () => {
          alert("Session expired. Please login again.");
          logout();
        },
        timeoutMinutes * 60 * 1000
      );
    };

    // Reset timer on user activity
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [logout, timeoutMinutes]);
}
```

2. Use in admin layout:

```tsx
function AdminLayout() {
  useSessionMonitor(30); // 30 minutes
  // ... rest of component
}
```

---

## Switching to Cookie-Based Auth

If you want to use cookies instead of localStorage:

1. Update `LoginPopup.tsx`:

```tsx
// After successful login:
document.cookie = `accessToken=${responseData.data.accessToken}; path=/; secure; samesite=strict`;
document.cookie = `refreshToken=${responseData.data.refreshToken}; path=/; secure; samesite=strict`;
```

2. Update `useAuth.ts` helpers:

```tsx
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(/accessToken=([^;]+)/);
  return match ? match[1] : null;
};
```

3. Update `api.ts`:

```tsx
// Remove manual Authorization header
// Browser will automatically send cookies
```

4. Update server to send cookies:

```tsx
// Backend should set httpOnly cookies
res.cookie("accessToken", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 minutes
});
```

---

## Adding Loading States

1. Create global loading component:

```tsx
// src/components/LoadingOverlay.tsx
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        <p className="mt-4">Authenticating...</p>
      </div>
    </div>
  );
}
```

2. Use in LoginPopup:

```tsx
{
  isLoading && <LoadingOverlay />;
}
```

---

## Debugging Authentication Issues

### Check Console Logs

```tsx
// In _layout.tsx beforeLoad:
console.log("Auth check:", {
  isLoggedIn: context.auth?.isLoggedIn(),
  user: context.auth?.getUser(),
  token: context.auth?.getAccessToken()?.substring(0, 20) + "...",
});
```

### Check LocalStorage

```javascript
// In browser console:
console.log({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: JSON.parse(localStorage.getItem("user") || "{}"),
});
```

### Clear Auth Data

```javascript
// In browser console:
localStorage.removeItem("accessToken");
localStorage.removeItem("refreshToken");
localStorage.removeItem("user");
location.reload();
```

### Test Token Refresh

```javascript
// In browser console:
import { refreshAccessToken } from "@/store/useAuth";
await refreshAccessToken();
```

---

## Common Issues & Solutions

### Issue: "Infinite redirect loop"

**Solution:** Make sure `isLoggedIn()` is a pure function that doesn't use hooks.

### Issue: "Token not being sent with requests"

**Solution:** Check that `apiFetch` is being used, not regular `fetch`.

### Issue: "User data not persisting after page reload"

**Solution:** Verify data is being stored in localStorage in `setAuth()`.

### Issue: "Can't access admin routes after login"

**Solution:** Check browser console for errors in beforeLoad hook.

### Issue: "Token refresh not working"

**Solution:** Verify refresh endpoint URL and response format match your API.
