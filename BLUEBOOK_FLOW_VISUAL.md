# Bluebook Exam Flow - Visual Guide

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        PREVIEW PAGE                              │
│  - User selects Test Type and Subject                           │
│  - Clicks "Next" button                                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    handlePreviewSubmit()
                    Creates SAT Attempt
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        EXAM PAGE                                 │
│  - Display questions from activeModule                           │
│  - User answers questions                                        │
│  - Navigate: Next/Back buttons                                   │
│  - Timer counting down                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ (Click Next on last question)
                             │
┌─────────────────────────────────────────────────────────────────┐
│                    CHECK YOUR WORK PAGE                          │
│  - Review all questions                                          │
│  - See answered/unanswered/marked for review                     │
│  - Can go back to any question                                   │
│  - Click "Next" to complete module                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ handleNext()
                             │ (Calls completeModuleMutation)
                             │
┌─────────────────────────────────────────────────────────────────┐
│                    LOADING MODULE PAGE                           │
│  "This Module Is Over"                                           │
│  Loading spinner animation (2 seconds)                           │
│                                                                  │
│  [Auto-calls: useCreateSatAttemptMCQModuleNext]                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   API Response  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────┐          ┌──────────────────┐
    │ Has activeModule│          │  No activeModule │
    │ in response?    │          │  or Error?       │
    └────────┬────────┘          └────────┬─────────┘
             │                            │
             ▼ handleNextModule()         ▼ handleComplete()
             │                            │
┌────────────────────────────┐  ┌──────────────────────────┐
│      BREAK PAGE            │  │   COMPLETION PAGE        │
│  - Break timer (60s)       │  │  "You're All Finished!"  │
│  - Break instructions      │  │  - Test complete info    │
│  - "Resume Testing" button │  │  - Return to Home button │
└────────────┬───────────────┘  └──────────────────────────┘
             │
             ▼ (Timer expires or click Resume)
             │ handleBreakComplete()
             │
┌────────────────────────────────────────────────────────────────┐
│                    EXAM PAGE (New Module)                       │
│  - Load questions from new activeModule                         │
│  - Reset to first question                                      │
│  - Continue exam...                                             │
└────────────────────────────────────────────────────────────────┘
             │
             └──────► (Repeat until no more modules)
```

## State Transitions

```
showPreview: true  →  false (after handlePreviewSubmit)

currentPage transitions:
  "exam"        →  "check-work"  (last question, click Next)
  "check-work"  →  "loading"     (click Next)
  "loading"     →  "break"       (next module available)
  "loading"     →  "complete"    (no more modules)
  "break"       →  "exam"        (after break timer/button)
```

## Key Data Flow

### Initial Module Load

```javascript
{
  attempt: {
    id, studentId, satPracticeId, status: "IN_PROGRESS", ...
  },
  activeModule: {
    id, moduleId, status: "IN_PROGRESS",
    module: {
      questionsSetOne: [ /* questions */ ],
      questionsSetTwo: [ /* questions */ ]
    },
    sectionProgress: {
      attemptId, sectionId, section: { name, duration, ... }
    }
  }
}
```

### After Loading Page API Call

```javascript
// If next module exists:
{
  success: true,
  data: {
    attempt: { ... },
    activeModule: { /* new module data */ }
  }
}

// If no next module:
{
  success: true,
  data: {
    attempt: { status: "COMPLETED", ... },
    activeModule: null  // or undefined
  }
}
```

## Component Responsibilities

| Component       | Responsibility                     | API Calls                        |
| --------------- | ---------------------------------- | -------------------------------- |
| Preview Page    | Initial test selection             | useCreateSatAttempt              |
| Exam Page       | Display questions, handle answers  | None                             |
| Check Your Work | Review questions before completion | None                             |
| Loading Module  | Wait and fetch next module         | useCreateSatAttemptMCQModuleNext |
| Break Page      | Show break timer                   | None                             |
| Completion Page | Show test completion               | None                             |

## Important Notes

1. **Loading Module Page** is the only page that calls the "next module" API
2. **Break Page** no longer makes API calls - it just manages the timer
3. **Check Your Work** calls `completeModuleMutation` but doesn't wait for response
4. The flow is determined by the presence of `activeModule` in the API response
5. All state management is handled through `useExamStore` Zustand store
