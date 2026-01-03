# Bluebook Exam Flow Implementation

## Flow Overview

The complete exam flow has been implemented with the following sequence:

### 1. Initial Preview Page (showPreview = true)
- User selects test type and subject
- Submits via `handlePreviewSubmit`
- Creates SAT attempt and receives initial module data
- Transitions to exam page

### 2. Exam Page (currentPage = "exam")
- User answers questions in the current module
- Navigate through questions using Next/Back buttons
- When reaching the last question and clicking Next, transitions to Check Your Work page

### 3. Check Your Work Page (currentPage = "check-work")
- Shows summary of all questions (answered, unanswered, marked for review)
- User can click on question numbers to return to specific questions
- When clicking Next:
  - Calls `completeModuleMutation` to mark module as complete
  - Transitions to Loading Module page

### 4. Loading Module Page (currentPage = "loading")
- Shows "This Module Is Over" message with loading spinner
- Automatically calls `handleFetchNextModule` API after 2 seconds
- API Response handling:
  - **If successful with activeModule data**: Calls `onNextModule` → Updates state → Goes to Break Page
  - **If no activeModule or error**: Calls `onComplete` → Goes to Completion Page

### 5. Break Page (currentPage = "break")
- Shows break timer (default 60 seconds)
- User can manually click "Resume Testing" or wait for timer to expire
- When timer expires or button clicked: Calls `handleBreakComplete` → Goes to Exam Page with new module

### 6. Completion Page (currentPage = "complete")
- Shows "You're All Finished!" message
- Displays completion information
- Provides "Return to Home" button

## Key Functions

### handlePreviewSubmit
```typescript
// Creates initial SAT attempt
// Sets attempt and activeModule state
// Transitions from preview to exam
```

### handleNext
```typescript
// From exam: Moves to next question or Check Your Work
// From check-work: Completes module → Goes to Loading Page
```

### handleBreakComplete
```typescript
// After break: Resets to exam page with new module
// Resets to first question of new module
```

### handleNextModule (in LoadingModulePage)
```typescript
// Called when API returns next module
// Updates attempt and activeModule
// Transitions to Break Page
```

### handleComplete (in LoadingModulePage)
```typescript
// Called when no more modules or API error
// Transitions to Completion Page
```

## State Management

### Page States (useExamStore)
- `"exam"` - Main exam interface
- `"check-work"` - Review questions before completing module
- `"loading"` - Loading next module
- `"break"` - Break between modules
- `"complete"` - Test completion

### Key State Variables
- `showPreview` - Controls preview page visibility
- `currentPage` - Current page in the flow
- `attempt` - Current SAT attempt data
- `activeModule` - Current active module with questions
- `answers` - User's answers to questions

## API Endpoints Used

1. **useCreateSatAttempt** - Creates initial SAT attempt
2. **useCreateSatAttemptMCQModuleComplete** - Marks module as complete
3. **useCreateSatAttemptMCQModuleNext** - Fetches next module (called in LoadingModulePage)

## Component Files Modified

1. `/apps/web/src/routes/bluebook/index.tsx` - Main exam page logic
2. `/apps/web/src/components/bluebook/complete-module-loading.tsx` - Loading page with API call
3. `/apps/web/src/components/bluebook/break-page.tsx` - Break page (simplified, removed API call)
4. `/apps/web/src/components/bluebook/check-your-work.tsx` - Review page (unchanged)
5. `/apps/web/src/components/bluebook/complete-test.tsx` - Completion page (unchanged)
6. `/apps/web/src/store/useExamStore.ts` - Added "loading" page type

## Flow Diagram

```
Preview Page
     ↓ (handlePreviewSubmit)
Exam Page
     ↓ (handleNext - last question)
Check Your Work Page
     ↓ (handleNext - completes module)
Loading Module Page
     ↓
   [API Call: useCreateSatAttemptMCQModuleNext]
     ↓
     ├─→ Has Next Module? → Break Page → (timer/button) → Exam Page (new module)
     │
     └─→ No More Modules? → Completion Page
```

## Testing Checklist

- [ ] Preview page loads and submits correctly
- [ ] Exam page displays questions properly
- [ ] Navigation between questions works
- [ ] Check Your Work page shows correct summary
- [ ] Loading page appears after clicking Next on Check Your Work
- [ ] API call in Loading page fetches next module
- [ ] Break page appears when next module exists
- [ ] Break timer counts down correctly
- [ ] Next module loads after break
- [ ] Completion page shows when no more modules
- [ ] All transitions are smooth and state is preserved
