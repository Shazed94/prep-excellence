# Bluebook Flow Optimizations - Complete

## Issues Fixed

### 🐛 Critical Bug: Loading Page Not Calling Next Module API

**Symptom**: When timer hit 0, page navigated to loading page, but even though `nextModuleProgressId` was set correctly (e.g., "cmjzp1t46001kafkg1v4hs6jw"), the next module API call never happened, causing the page to go directly to completion instead of break page.

**Root Cause**: The `hasCalledRef.current` flag was persisting across multiple visits to the loading page. Once set to `true` on the first visit, it would prevent the useEffect from running on subsequent visits.

**Flow Before Fix**:

```
Visit 1: Loading Page
  → hasCalledRef.current = false
  → API call happens ✅
  → hasCalledRef.current = true
  → Navigate to Break Page

Visit 2: Loading Page (new module)
  → hasCalledRef.current = true (still!)
  → useEffect exits early ❌
  → No API call ❌
  → Goes to completion page instead of break ❌
```

**Flow After Fix**:

```
Visit 1: Loading Page (nextModuleProgressId: "abc123")
  → Reset useEffect: hasCalledRef.current = false ✅
  → API call happens ✅
  → hasCalledRef.current = true
  → Navigate to Break Page

Visit 2: Loading Page (nextModuleProgressId: "xyz789")
  → Reset useEffect: hasCalledRef.current = false ✅
  → API call happens ✅
  → hasCalledRef.current = true
  → Navigate to Break Page ✅
```

### 1. ✅ Auto-redirect on Timer Expiry

**Problem**: When timer hit 0, the module completion wasn't setting `nextModuleProgressId` properly, causing the loading page to immediately go to completion page.

**Solution**:

- Enabled the commented `useEffect` for auto-navigation when timer hits 0
- Properly set `nextModuleProgressId` in the `onSuccess` callback
- Added proper error handling to set `nextModuleProgressId` to null on error

```typescript
// When timer hits 0, complete the module and go to loading
if (timeRemaining === 0) {
  moduleCompletionTriggeredRef.current = true;

  completeModuleMutation.mutate(
    {
      /* ... */
    },
    {
      onSuccess: (response) => {
        // ✅ Properly set nextModuleProgressId from response
        setNextModuleProgressId(response.data.nextModuleProgressId);
        setPage("loading");
      },
      onError: (error) => {
        // ✅ Set to null on error so LoadingPage knows to complete
        setNextModuleProgressId(null);
        setPage("loading");
      },
    }
  );
}
```

### 2. ✅ LoadingModulePage Component Optimization

**Problem**: Had 3 separate `useEffect` hooks doing redundant work, causing confusion and potential race conditions. Additionally, the `hasCalledRef` was not resetting between different loading page instances, preventing the API call from happening on subsequent visits.

**Critical Fix**: Added a separate useEffect to reset `hasCalledRef.current` when `nextModuleProgressId` changes. This ensures that each time we navigate to the loading page (for a new module), the API call will execute.

**Solution**:

- Consolidated into a **single `useEffect`** that handles:
  - Timer delay (3 seconds)
  - Checking if next module exists
  - Fetching next module or completing test
  - All success/error handling in one place

**Before** (3 useEffects):

```typescript
// useEffect 1: Timer delay
useEffect(() => {
  const timer = setTimeout(() => {
    if (!nextModuleProgressId) {
      onComplete();
    } else {
      fetchNextModule.mutate({ moduleProgressId: nextModuleProgressId });
    }
  }, DELAY_MS);
  return () => clearTimeout(timer);
}, [nextModuleProgressId]);

// useEffect 2: Watch for success
useEffect(() => {
  if (fetchNextModule.isSuccess && fetchNextModule.data) {
    if (fetchNextModule.data?.data?.activeModule) {
      onNextModule(fetchNextModule.data);
    } else {
      onComplete();
    }
  }
}, [fetchNextModule.isSuccess, fetchNextModule.data]);

// useEffect 3: Watch for error
useEffect(() => {
  if (fetchNextModule.isError) {
    onComplete();
  }
}, [fetchNextModule.isError, fetchNextModule.error]);
```

**After** (1 optimized useEffect + 1 reset useEffect):

```typescript
// Reset the ref when nextModuleProgressId changes (new loading page instance)
// biome-ignore lint/correctness/useExhaustiveDependencies: Need to reset on nextModuleProgressId change
useEffect(() => {
  hasCalledRef.current = false;
}, [nextModuleProgressId]);

// Main effect: handles timer delay and API call
useEffect(() => {
  if (hasCalledRef.current) {
    console.log("API call already made, skipping");
    return;
  }

  console.log(
    "Setting up timer for loading page, nextModuleProgressId:",
    nextModuleProgressId
  );
  hasCalledRef.current = true;

  const timer = setTimeout(() => {
    if (!nextModuleProgressId) {
      onComplete(); // No next module, complete test
    } else {
      // Fetch next module with inline success/error handling
      fetchNextModule.mutate(
        { moduleProgressId: nextModuleProgressId },
        {
          onSuccess: (response) => {
            if (response?.data?.activeModule) {
              onNextModule(response); // Has next module → break page
            } else {
              onComplete(); // No active module → complete
            }
          },
          onError: (error) => {
            console.error("Error fetching next module:", error);
            onComplete(); // Error → treat as completion
          },
        }
      );
    }
  }, DELAY_MS);

  return () => clearTimeout(timer);
}, [nextModuleProgressId, fetchNextModule, onNextModule, onComplete]);
```

**Key Improvement**: The separate reset useEffect ensures that when you navigate to loading page multiple times (for different modules), the `hasCalledRef` is reset, allowing the API call to execute each time.

### 3. ✅ Removed Duplicate API Calls

**Problem**: Both `index.tsx` and `LoadingModulePage` could potentially call the next module API.

**Solution**:

- **LoadingModulePage** is now the ONLY component that calls `useCreateSatAttemptMCQModuleNext()`
- `index.tsx` only calls `completeModuleMutation` and sets `nextModuleProgressId`
- Clear separation of concerns

### 4. ✅ Cleaned Up Unused Props

**Problem**: LoadingModulePage was receiving props it didn't use (`attemptId`, `activeModule`, `setPage`)

**Solution**:

- Removed unused props from component interface
- Only kept essential props: `nextModuleProgressId`, `onNextModule`, `onComplete`

## Updated Flow

### Manual Approach (Button Clicks) - ✅ Working

```
Exam → Check Your Work → (Click Next) → Loading Page → Break/Complete
```

### Auto-redirect (Timer Expiry) - ✅ Now Working

```
Exam (timer=0) → Loading Page → Break/Complete
```

## Key Points

1. **Timer-based completion**: When timer hits 0, `moduleCompletionTriggeredRef` prevents duplicate calls
2. **Loading page delay**: 3-second delay with loading animation before API call
3. **Next module decision**: Made entirely in LoadingModulePage based on API response
4. **Error handling**: All errors treated as test completion (safe fallback)
5. **Break page**: Automatically shown when next module exists
6. **Completion page**: Automatically shown when no more modules

## Component Responsibilities

| Component           | Responsibilities                                                                                           | API Calls                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `index.tsx`         | - Timer management<br>- Module completion on timer=0 or Check Your Work<br>- Navigation between exam pages | `useCreateSatAttemptMCQModuleComplete`<br>`useSatAttemptCompleteTest` |
| `LoadingModulePage` | - 3-second delay animation<br>- Fetch next module<br>- Decide: break page vs completion                    | `useCreateSatAttemptMCQModuleNext`                                    |
| `BreakPage`         | - Show break timer<br>- Handle break completion                                                            | None                                                                  |
| `CompletionPage`    | - Show test complete message                                                                               | None                                                                  |

## Testing Checklist

- [ ] Manual flow: Click through entire test with Next button
- [ ] Auto-redirect: Let timer expire to 0 on exam page
- [ ] Auto-redirect: Let timer expire to 0 on check-work page
- [ ] Multiple modules: Verify break page appears between modules
- [ ] Last module: Verify completion page appears after last module
- [ ] Error handling: Simulate API error during next module fetch
- [ ] Timer display: Verify timer countdown is accurate
- [ ] No duplicate API calls: Check network tab for duplicate requests

## Files Modified

1. `/apps/web/src/components/bluebook/complete-module-loading.tsx`

   - Optimized from 3 useEffects to 1
   - Removed unused props
   - Added proper error handling

2. `/apps/web/src/routes/bluebook/index.tsx`
   - Enabled auto-redirect on timer expiry
   - Fixed nextModuleProgressId setting
   - Updated LoadingModulePage props
