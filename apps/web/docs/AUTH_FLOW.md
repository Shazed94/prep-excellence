# Authentication Flow Diagram

## Login Flow

```
┌─────────────┐
│   User      │
│ Click Login │
└──────┬──────┘
       │
       ▼
┌────────────────┐
│  LoginPopup    │
│  Opens         │
└───────┬────────┘
        │
        ▼
┌────────────────────┐
│ User enters        │
│ email & password   │
└────────┬───────────┘
         │
         ▼
┌─────────────────────────────────┐
│ POST /api/v1/auth/login         │
│ { email, password }             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Response:                       │
│ {                               │
│   accessToken,                  │
│   refreshToken,                 │
│   user: { id, email, name }     │
│ }                               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ useAuth.setAuth()               │
│ - Store in localStorage         │
│ - Update Zustand state          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Navigate to /admin              │
└─────────────────────────────────┘
```

## Protected Route Access

```
┌────────────────┐
│ User navigates │
│ to /admin/*    │
└───────┬────────┘
        │
        ▼
┌────────────────────────────────┐
│ beforeLoad hook triggers       │
│ context.auth.isLoggedIn()      │
└────────┬──────────┬────────────┘
         │          │
    NO   │          │  YES
         ▼          ▼
┌────────────┐  ┌──────────────┐
│ Redirect   │  │ Allow access │
│ to /       │  │ Load page    │
└────────────┘  └──────────────┘
```

## API Request with Auth

```
┌────────────────┐
│ Component      │
│ calls apiGet() │
└───────┬────────┘
        │
        ▼
┌─────────────────────────────┐
│ apiFetch()                  │
│ - Add Authorization header  │
│ - Bearer {accessToken}      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Make HTTP request           │
└────┬────────────────┬───────┘
     │                │
200  │                │  401
     ▼                ▼
┌─────────┐  ┌──────────────────────┐
│ Return  │  │ Token expired        │
│ data    │  │ Call refreshToken()  │
└─────────┘  └────────┬─────────────┘
                      │
                      ▼
          ┌──────────────────────────┐
          │ POST /auth/refresh       │
          │ { refreshToken }         │
          └─────┬──────────┬─────────┘
                │          │
          SUCCESS│          │ FAIL
                ▼          ▼
    ┌──────────────┐  ┌─────────────┐
    │ Update token │  │ Logout user │
    │ Retry request│  │ Redirect /  │
    └──────────────┘  └─────────────┘
```

## Logout Flow

```
┌────────────────┐
│ User clicks    │
│ Logout button  │
└───────┬────────┘
        │
        ▼
┌─────────────────────────────┐
│ useAuth.logout()            │
│ - Clear localStorage        │
│   • accessToken             │
│   • refreshToken            │
│   • user                    │
│ - Reset Zustand state       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Navigate to /               │
└─────────────────────────────┘
```

## File Structure

```
src/
├── store/
│   └── useAuth.ts          ← Auth state & helpers
├── lib/
│   ├── api.ts              ← Authenticated fetch wrapper
│   └── api-examples.tsx    ← Usage examples
├── components/
│   └── LoginPopup.tsx      ← Login UI
├── routes/
│   ├── __root.tsx          ← Router context type
│   └── admin/
│       ├── _layout.tsx     ← Protected layout + auth check
│       ├── index.tsx       ← Dashboard
│       └── users.tsx       ← Users page
└── router.tsx              ← Router config with auth context
```

## Key Files & Their Roles

### `useAuth.ts` - Authentication State

- Zustand store for reactive auth state
- Helper functions (non-reactive) for route guards
- Token refresh logic

### `api.ts` - HTTP Client

- Wrapper around fetch()
- Auto-adds Authorization header
- Auto-refreshes tokens on 401
- Helper methods: apiGet, apiPost, apiPut, apiDelete

### `_layout.tsx` - Route Protection

- beforeLoad hook checks authentication
- Redirects to / if not logged in
- Provides admin layout with sidebar & logout

### `LoginPopup.tsx` - Authentication UI

- Login form with validation
- Calls login API
- Stores tokens & user data
- Redirects to /admin on success

## Data Flow

### Local Storage

```
accessToken   → JWT token for API requests
refreshToken  → JWT token for getting new accessToken
user          → JSON string: { id, email, name, role }
```

### Zustand Store

```typescript
{
  user: User | null,
  accessToken: string | null
}
```

### Router Context

```typescript
{
  auth: {
    isLoggedIn: () => boolean,
    getAccessToken: () => string | null,
    getUser: () => User | null
  }
}
```
