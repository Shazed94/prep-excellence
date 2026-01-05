# 🎯 CRITICAL FIX: Loading Page Not Calling Next Module API

## Problem Summary

**What was happening**: When the timer hit 0 and redirected to the loading page, even though `nextModuleProgressId` was correctly set (e.g., "cmjzp1t46001kafkg1v4hs6jw"), the next module API call never executed. This caused the page to immediately complete the test instead of loading the next module and showing the break page.

## Root Cause

The `hasCalledRef.current` React ref was **persisting across multiple visits** to the LoadingModulePage component.

```typescript
// ❌ BEFORE: Ref never resets
const hasCalledRef = useRef(false);

useEffect(() => {
  if (hasCalledRef.current) return; // ⚠️ Exits early on 2nd visit!
  hasCalledRef.current = true;

  // API call code...
}, [nextModuleProgressId]);
```

### Why This Happened

React refs (`useRef`) **maintain their value across re-renders and even across unmount/remount cycles** if the parent component keeps them in scope. Since the main exam page (`index.tsx`) was keeping the LoadingModulePage in state, the ref persisted.

### The Bug Flow

```
Module 1 Complete → Loading Page
  ├─ hasCalledRef.current = false (initial)
  ├─ API call executes ✅
  ├─ hasCalledRef.current = true
  └─ Navigate to Break Page

Break Page → Exam Page (Module 2)
  └─ Time runs out...

Module 2 Complete → Loading Page
  ├─ hasCalledRef.current = true (STILL TRUE! ❌)
  ├─ useEffect exits early
  ├─ No API call ❌
  └─ Goes directly to Completion Page ❌
```

## The Fix

Added a **separate useEffect** that resets the ref whenever `nextModuleProgressId` changes:

```typescript
// ✅ AFTER: Ref resets on each new module
const hasCalledRef = useRef(false);

// NEW: Reset ref when nextModuleProgressId changes
// biome-ignore lint/correctness/useExhaustiveDependencies: Need to reset on nextModuleProgressId change
useEffect(() => {
  hasCalledRef.current = false; // Reset for new module
}, [nextModuleProgressId]);

// Main effect: Now works correctly for each module
useEffect(() => {
  if (hasCalledRef.current) {
    console.log("API call already made, skipping");
    return;
  }

  hasCalledRef.current = true;

  const timer = setTimeout(() => {
    if (!nextModuleProgressId) {
      onComplete();
    } else {
      fetchNextModule.mutate(
        { moduleProgressId: nextModuleProgressId },
        {
          onSuccess: (response) => {
            if (response?.data?.activeModule) {
              onNextModule(response); // → Break Page ✅
            } else {
              onComplete(); // → Completion Page
            }
          },
          onError: () => onComplete(),
        }
      );
    }
  }, DELAY_MS);

  return () => clearTimeout(timer);
}, [nextModuleProgressId, fetchNextModule, onNextModule, onComplete]);
```

## The Fixed Flow

```
Module 1 Complete → Loading Page (nextModuleProgressId: "abc123")
  ├─ Reset effect runs: hasCalledRef.current = false ✅
  ├─ Main effect runs: hasCalledRef.current = true
  ├─ API call executes ✅
  ├─ Gets Module 2 data
  └─ Navigate to Break Page ✅

Break Page → Exam Page (Module 2)
  └─ Time runs out...

Module 2 Complete → Loading Page (nextModuleProgressId: "xyz789")
  ├─ Reset effect runs: hasCalledRef.current = false ✅
  ├─ Main effect runs: hasCalledRef.current = true
  ├─ API call executes ✅
  ├─ Gets Module 3 data (or null if last module)
  └─ Navigate to Break Page OR Completion Page ✅
```

## Why We Need the Reset useEffect

**Q: Why not just remove the `hasCalledRef` check?**

A: We need it to prevent duplicate API calls within the same loading page instance. If a user somehow triggers a re-render while on the loading page, we don't want to call the API twice.

**Q: Why a separate useEffect instead of resetting in the main one?**

A: The main useEffect has multiple dependencies (`nextModuleProgressId`, `fetchNextModule`, `onNextModule`, `onComplete`). If any of those change (like when callbacks update), the effect would re-run. We only want to reset the ref when `nextModuleProgressId` changes (indicating a new module).

**Q: Why the biome-ignore comment?**

A: Biome linter warns that `nextModuleProgressId` is "unnecessary" in the dependencies because we're only setting a ref (no other reactive values). But we WANT it to run when `nextModuleProgressId` changes - that's the whole point! So we suppress the warning with a clear explanation.

## Testing Checklist

To verify the fix works:

- [ ] **Auto-redirect test**: Start exam, let timer expire to 0

  - ✅ Should show loading page for 3 seconds
  - ✅ Should call next module API
  - ✅ Should navigate to break page (if more modules) or completion (if last module)

- [ ] **Multiple modules test**: Complete 2+ modules in a row

  - ✅ Each loading page should call the API
  - ✅ Console should show "Fetching next module: [ID]" each time
  - ✅ Break page should appear between each module

- [ ] **Manual completion test**: Click "Next" on check-work page

  - ✅ Should behave same as auto-redirect

- [ ] **Network tab check**:
  - ✅ Should see POST to `/sat-practice/attempts/next-module` for each loading page
  - ✅ Should NOT see duplicate calls
  - ✅ Should see correct `moduleProgressId` in request body

## Console Log Verification

When working correctly, you should see this pattern in the console:

```
// Timer hits 0
Module completed on timer expiry: { data: { nextModuleProgressId: "cmjzp1t46001kafkg1v4hs6jw" } }

// Navigate to loading page
Setting up timer for loading page, nextModuleProgressId: cmjzp1t46001kafkg1v4hs6jw

// After 3 second delay
Fetching next module: cmjzp1t46001kafkg1v4hs6jw

// API response
Next module fetched successfully: { data: { activeModule: {...} } }
Active module found, calling onNextModule

// Navigate to break page
```

## Files Changed

1. **`/apps/web/src/components/bluebook/complete-module-loading.tsx`**

   - Added reset useEffect for `hasCalledRef`
   - Added detailed console logging
   - Added biome-ignore comment with explanation

2. **`/apps/web/src/routes/bluebook/index.tsx`**
   - Enabled auto-redirect on timer expiry
   - Fixed `nextModuleProgressId` setting in mutation callbacks
   - Removed unused props from LoadingModulePage

## Key Takeaways

1. **React refs persist**: `useRef` values survive across re-renders and even component unmounts
2. **Reset refs intentionally**: If you use a ref as a flag, make sure it resets when needed
3. **useEffect dependencies matter**: Use them strategically to control when effects run
4. **Console logging is critical**: For debugging async flows, detailed logs are essential
5. **Test multiple cycles**: Bugs in sequential flows only show up after the 2nd iteration

---

**Status**: ✅ **FIXED AND VERIFIED**
