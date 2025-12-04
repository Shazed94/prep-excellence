# Authentication Implementation

## Overview

This application uses a token-based authentication system with access tokens and refresh tokens. The authentication is handled through localStorage and Zustand for state management.

## Architecture

### 1. Auth Store (`src/store/useAuth.ts`)

The Zustand store manages authentication state and provides helper functions:

- `setAuth()` - Stores user data and tokens after login
- `updateAccessToken()` - Updates the access token after refresh
- `logout()` - Clears all authentication data
- `isLoggedIn()` - Pure function to check auth status (doesn't trigger subscriptions)
- `getAccessToken()` - Retrieves current access token
- `getRefreshToken()` - Retrieves refresh token
- `getUser()` - Retrieves user data
- `refreshAccessToken()` - Automatically refreshes expired tokens

### 2. Protected Routes

All routes under `/admin/*` are protected using TanStack Router's `beforeLoad` hook:

```tsx
beforeLoad: async ({ context }) => {
  const loggedIn = context.auth?.isLoggedIn() ?? false;
  if (!loggedIn) {
    throw redirect({ to: "/", search: { from: "/admin" } });
  }
};
```

The `_layout.tsx` file in `/admin` handles this check for all child routes.

### 3. API Utilities (`src/lib/api.ts`)

Provides authenticated fetch wrappers that automatically:

- Add authorization headers
- Refresh tokens on 401 errors
- Logout on refresh failure

**Usage:**

```tsx
import { apiGet, apiPost } from "@/lib/api";

// GET request
const data = await apiGet("/endpoint");

// POST request
const result = await apiPost("/endpoint", { data: "value" });
```

### 4. Login Flow

1. User clicks login button → opens LoginPopup
2. User submits credentials
3. API returns `accessToken`, `refreshToken`, and `user` data
4. Data is stored via `setAuth()`
5. User is redirected to `/admin`

### 5. Token Refresh

Tokens are automatically refreshed when:

- A 401 error is received from the API
- The `apiFetch` utility detects an expired token

**Note:** Update the refresh endpoint URL in `useAuth.ts`:

```tsx
const response = await fetch("http://192.168.68.131:3000/api/v1/auth/refresh", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ refreshToken }),
});
```

### 6. Logout Flow

1. User clicks logout button in admin sidebar
2. `logout()` clears localStorage and Zustand state
3. User is redirected to home page

## API Endpoints

### Login

```
POST http://192.168.68.131:3000/api/v1/auth/login

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "...",
      "email": "...",
      "name": "...",
      "role": "..."
    }
  }
}
```

### Refresh Token

```
POST http://192.168.68.131:3000/api/v1/auth/refresh

Request:
{
  "refreshToken": "..."
}

Response:
{
  "data": {
    "accessToken": "..."
  }
}
```

## Security Considerations

1. **LocalStorage** - Tokens are stored in localStorage. For enhanced security, consider using httpOnly cookies.

2. **Token Expiration** - Implement token expiration checks and refresh before making API calls.

3. **HTTPS** - Always use HTTPS in production to prevent token interception.

4. **XSS Protection** - Sanitize user inputs to prevent XSS attacks that could steal tokens.

5. **CSRF Protection** - If using cookies, implement CSRF tokens.

## Environment Variables

Create a `.env` file with:

```
VITE_API_BASE_URL=http://192.168.68.131:3000/api/v1
```

Then update `src/lib/api.ts` to use it:

```tsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## Testing Authentication

1. Start the dev server: `pnpm dev`
2. Click "Login" button
3. Enter credentials
4. After successful login, you'll be redirected to `/admin`
5. Try accessing protected routes
6. Click "Logout" to clear session

## Removing useAuth Store (Optional)

If you find the Zustand store redundant, you can rely solely on helper functions and localStorage. However, the store provides:

- Reactive updates when auth state changes
- Clean logout functionality
- Centralized state management

The current implementation uses helper functions (`isLoggedIn`, `getAccessToken`, etc.) in route guards to avoid subscription issues, making the store more of a convenience than a necessity.
