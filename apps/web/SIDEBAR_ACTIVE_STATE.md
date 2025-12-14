# Sidebar Active State Implementation

## Overview

The sidebar now dynamically highlights the active menu item based on the current URL pathname. When you navigate to `/dashboard/content-management/newsletter`, both the parent section and the specific menu item will be highlighted.

## Changes Made

### 1. **nav-content-management.tsx**

Added dynamic active state detection:

```tsx
const location = useLocation();
const pathname = location.pathname;

// Check if any sub-item is active
const isItemActive = (item) => {
  if (item.url && pathname === item.url) return true;
  if (item.items) {
    return item.items.some((subItem) => pathname === subItem.url);
  }
  return false;
};
```

**Features:**

- ✅ Parent section auto-expands when child is active
- ✅ Active menu item gets `isActive={true}` styling
- ✅ Uses `defaultOpen={isItemActive(item)}` to expand parent

**Example:**

- URL: `/dashboard/content-management/newsletter`
- Result: "Content Management" section expands, "Newsletter" item highlighted

### 2. **nav-main.tsx**

Same implementation for the main navigation:

```tsx
const location = useLocation();
const pathname = location.pathname;

const isItemActive = (item) => {
  if (item.url && pathname === item.url) return true;
  if (item.items) {
    return item.items.some((subItem) => pathname === subItem.url);
  }
  return false;
};
```

**Example:**

- URL: `/dashboard/instructor-portal/create-course`
- Result: "Instructor Portal" section expands, "My Course" item highlighted

### 3. **nav-projects.tsx**

Simpler implementation for flat menu items:

```tsx
const location = useLocation();
const pathname = location.pathname;

const isActive = pathname === item.url;
```

**Example:**

- URL: `/design-engineering`
- Result: "Design Engineering" project highlighted

## How It Works

### Flow:

1. User navigates to a page (e.g., `/dashboard/content-management/newsletter`)
2. TanStack Router updates the `location` object
3. `useLocation()` hook provides current `pathname`
4. Each nav component compares `pathname` with menu item URLs
5. Matching items get `isActive={true}` prop
6. Parent sections auto-expand if child is active

### Visual Result:

```
Website Manager
  └─ Content Management        ← Auto-expanded
       ├─ Newsletter           ← Highlighted (active)
       └─ Trusted Companies
```

## Key Features

✅ **Auto-expand parent sections** - Parent collapses automatically expand when a child route is active  
✅ **Visual feedback** - Active items have distinct styling (background color, font weight)  
✅ **Dynamic updates** - Changes immediately when user navigates  
✅ **No manual state management** - Uses TanStack Router's location hook  
✅ **Nested route support** - Works with multi-level navigation

## Styling

The `isActive` prop is passed to `SidebarMenuSubButton` and `SidebarMenuButton` components, which apply these styles:

```tsx
// Active state styling (from sidebar component)
data-active: true
// Applies background color and text styling
```

## Usage in Other Components

To add active state detection to any sidebar component:

```tsx
import { useLocation } from "@tanstack/react-router";

function YourNavComponent() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarMenuButton asChild isActive={pathname === item.url}>
      <Link to={item.url}>{item.title}</Link>
    </SidebarMenuButton>
  );
}
```

## Examples

### Newsletter Page

- **URL:** `/dashboard/content-management/newsletter`
- **Active Section:** "Content Management" (expanded)
- **Active Item:** "Newsletter" (highlighted)

### Trusted Companies Page

- **URL:** `/dashboard/content-management/trusted-companies`
- **Active Section:** "Content Management" (expanded)
- **Active Item:** "Trusted Companies" (highlighted)

### Create Course Page

- **URL:** `/dashboard/instructor-portal/create-course`
- **Active Section:** "Instructor Portal" (expanded)
- **Active Item:** "My Course" (highlighted)

## Benefits

1. **Better UX** - Users always know where they are
2. **Visual Consistency** - Standard behavior across all nav sections
3. **Automatic** - No manual state management needed
4. **Router Integration** - Works seamlessly with TanStack Router
5. **Performance** - Lightweight, only re-renders on navigation

## No Breaking Changes

All existing functionality remains intact. The active state detection is purely additive and doesn't affect:

- Existing navigation
- Manual collapse/expand functionality
- Custom styling
- Other sidebar features

Everything now works automatically! 🎉
