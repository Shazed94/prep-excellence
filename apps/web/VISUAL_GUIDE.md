# Visual Guide - Column Sorting Behavior

## Before (Dropdown Approach) ❌

```
┌─────────────────────────────────────────────────────────┐
│  Newsletter Management                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Search...]  [Sort by: ▼]  [↕️ Toggle]               │
│                  ↓                                      │
│              ┌─────────┐                               │
│              │ Email   │                               │
│              │ Name    │                               │
│              │ Date    │                               │
│              └─────────┘                               │
│                                                         │
│  SL  │  Email              │  Action                  │
│  ────┼─────────────────────┼──────────                │
│  1   │  user@example.com   │  [Delete]                │
│  2   │  admin@test.com     │  [Delete]                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Issues:**

- Users have to use separate controls
- Not intuitive (extra steps)
- Takes up toolbar space
- Columns don't show they're sortable

---

## After (Column-Level Sorting) ✅

```
┌─────────────────────────────────────────────────────────┐
│  Newsletter Management                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Search...]                                            │
│                                                         │
│  SL  │  Email ⬍         │  Action                     │
│  ────┼──────────────────┼──────────                    │
│  1   │  admin@test.com  │  [Delete]                    │
│  2   │  user@example.com│  [Delete]                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
       ↑
       └─ Click here to sort by Email
          Icon shows current sort direction
```

**Benefits:**

- ✅ Direct interaction with columns
- ✅ Standard table behavior (like Excel, Gmail, etc.)
- ✅ Visual feedback on active sort
- ✅ Cleaner toolbar
- ✅ Less cluttered UI

---

## Sort States Visual

### State 1: No Sorting (Initial)

```
SL  │  Email ⬍         │  Name ⬍          │  Action
              ↑                  ↑
           50% opacity      50% opacity
       (not active yet)   (not active yet)
```

- All sort icons are semi-transparent
- `sorting.sortBy = undefined`
- `sorting.sortOrder = "asc"`

---

### State 2: After Clicking "Email" (First Time)

```
SL  │  Email ⬍         │  Name ⬍          │  Action
              ↑                  ↑
          100% opacity      50% opacity
       (ACTIVE, ASC)      (inactive)
```

- Email icon is bright (100% opacity)
- Arrow points up (ascending)
- `sorting.sortBy = "email"`
- `sorting.sortOrder = "asc"`

---

### State 3: After Clicking "Email" Again (Toggle)

```
SL  │  Email ⬍         │  Name ⬍          │  Action
              ↑                  ↑
          100% opacity      50% opacity
       (ACTIVE, DESC)     (inactive)
       (rotated 180°)
```

- Email icon is bright (100% opacity)
- Arrow points down (descending) - rotated 180°
- `sorting.sortBy = "email"` (unchanged)
- `sorting.sortOrder = "desc"` (toggled)

---

### State 4: After Clicking "Name" (Switch Column)

```
SL  │  Email ⬍         │  Name ⬍          │  Action
              ↑                  ↑
           50% opacity      100% opacity
          (inactive)       (ACTIVE, ASC)
```

- Name icon is now bright
- Email icon becomes semi-transparent
- Arrow points up again (resets to ascending)
- `sorting.sortBy = "name"` (changed)
- `sorting.sortOrder = "asc"` (reset to default)

---

## Code Example: Making Columns Sortable

### Sortable Column:

```typescript
{
  accessorKey: "email",
  header: createSortableHeader("Email", "email"),
  //                             ↑        ↑
  //                        Display   API field
  //                         text       name
  cell: ({ row }) => <div>{row.getValue("email")}</div>,
}
```

Result: Column shows "Email ⬍" with clickable sort icon

---

### Non-Sortable Column:

```typescript
{
  accessorKey: "actions",
  header: "Action",  // ← Just a string, no createSortableHeader
  cell: ({ row }) => <Button>Delete</Button>,
}
```

Result: Column shows "Action" with NO sort icon

---

## User Interaction Flow

```
Initial Load
    ↓
No sorting applied
sortBy = undefined
    ↓
User clicks "Email" column
    ↓
sortBy = "email", sortOrder = "asc"
API fetches sorted data (A→Z)
    ↓
User clicks "Email" again
    ↓
sortBy = "email", sortOrder = "desc"
API fetches sorted data (Z→A)
    ↓
User clicks "Name" column
    ↓
sortBy = "name", sortOrder = "asc"
API fetches sorted data (A→Z)
```

---

## Integration with Zustand Store

```
┌──────────────────────────────────────────┐
│         User Clicks Column               │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│    createSortableHeader Handler          │
│    - Checks if column is active          │
│    - Toggles or sets sort field          │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│        Zustand Store Updates             │
│    setSortBy("email")                    │
│    or toggleSortOrder()                  │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│     Component Re-renders                 │
│   - Icon updates (opacity/rotation)      │
│   - API hook sees new sorting values     │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│      API Refetches Data                  │
│   useGetNewsletter(                      │
│     page,                                │
│     pageSize,                            │
│     search,                              │
│     sorting.sortBy || "id", ← Updated!  │
│     sorting.sortOrder       ← Updated!  │
│   )                                      │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│     Table Shows Sorted Data              │
└──────────────────────────────────────────┘
```

---

## CSS Styling Details

### Icon Visibility:

```css
/* Active column */
className="ml-2 h-3 w-3 opacity-100"

/* Inactive column */
className="ml-2 h-3 w-3 opacity-50"
```

### Icon Rotation:

```css
/* Ascending (default) */
style={{ transform: 'none' }}

/* Descending (rotated) */
style={{ transform: 'rotate(180deg)', transition: 'transform 0.2s' }}
```

### Result:

- Smooth 0.2s animation when toggling between asc/desc
- Clear visual distinction between active and inactive columns
