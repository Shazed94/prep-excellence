# Bluebook Flow Fixes - Summary

## Overview

Fixed the Bluebook exam flow to properly handle the API response structure and implement question status tracking through Zustand store.

## API Response Structure

The API returns the following structure when attempting an exam:

```json
{
  "success": true,
  "data": {
    "attempt": {
      "id": "cmjv6d6xv0000ozkga85m9za7",
      "studentId": "cmjs76fsx000189kgpya8psht",
      "satPracticeId": "cmjv6b2h10016cakgtjylhbse",
      "status": "IN_PROGRESS",
      "startedAt": "2026-01-01T08:20:19.167Z",
      "completedAt": null,
      "satPractice": {
        "id": "cmjv6b2h10016cakgtjylhbse",
        "name": "Psychology",
        "status": "PUBLISHED"
      }
    },
    "activeModule": {
      "id": "cmjv6d6y80002ozkgryp2u0an",
      "moduleId": "cmjv6b2hm0018cakgtxhhpllj",
      "status": "IN_PROGRESS",
      "usedQuestionSet": "SET_ONE",
      "module": {
        "id": "cmjv6b2hm0018cakgtxhhpllj",
        "name": "Module 1 basic",
        "threshold": 30,
        "questionsSetOne": [...],
        "questionsSetTwo": [...]
      },
      "sectionProgress": {
        "section": {
          "name": "Section 1",
          "duration": 5
        }
      }
    }
  }
}
```

## Key Fixes Implemented

### 1. Question Navigation Component (`question-navigation.tsx`)

**Changes:**

- Fixed to use `usedQuestionSet` from API response to determine which question set to display
- Updated to handle both `SET_ONE` and `SET_TWO` question sets dynamically
- Modified `getQuestionStatus` to properly read from Zustand store
- Status priority: `markedForReview` > `answered` > `unanswered`
- Fixed question count display to use the correct question set length

**Code:**

```tsx
// Get questions based on the usedQuestionSet from API
const usedSet = activeModule?.usedQuestionSet || "SET_ONE";
const questions =
  usedSet === "SET_ONE"
    ? activeModule?.module?.questionsSetOne
    : activeModule?.module?.questionsSetTwo;

// Get question status from Zustand store
const getQuestionStatus = (questionId: string) => {
  const answer = answers[questionId];
  if (!answer) return "unanswered";

  // Priority: marked for review > answered > unanswered
  if (answer.markedForReview) return "review";
  if (answer.selectedAnswer) return "answered";
  return "unanswered";
};
```

### 2. Check Your Work Component (`check-your-work.tsx`)

**Changes:**

- Modified to accept `questions` array as prop instead of using static data
- Added `sectionName` prop for dynamic section naming
- Updated `getQuestionStatus` to match the same logic as question-navigation
- Status is now fully managed by Zustand store

**Props:**

```tsx
interface CheckYourWorkProps {
  questions: Question[];
  sectionName?: string;
}
```

### 3. Main Index Component (`bluebook/index.tsx`)

**Changes:**

- Properly passes questions and section name to `CheckYourWork` component
- Questions are built from `activeModule.usedQuestionSet` (either SET_ONE or SET_TWO)
- Attempt ID is correctly accessed via `attempt?.data?.attempt?.id`

**Code:**

```tsx
<CheckYourWork
  questions={questions}
  sectionName={activeModule?.sectionProgress?.section?.name || "Section I"}
/>
```

### 4. Answer Option Component (`answer-option.tsx`)

**Changes:**

- Fixed `handleSelectAnswer` callback dependencies to include all required variables
- Added `attemptId`, `mcqAnswerMutation` to useCallback dependencies

**Code:**

```tsx
const handleSelectAnswer = useCallback(() => {
  mcqAnswerMutation.mutate({
    attemptId,
    questionId,
    choice: optionId,
  });
  selectAnswer(questionId, optionId);
}, [attemptId, questionId, optionId, selectAnswer, mcqAnswerMutation]);
```

### 5. Type Definitions (`store/question.ts`)

**Changes:**

- Updated `AttemptResponse` interface to match actual API response structure
- Added proper nested structure for `attempt` and `activeModule`

**Updated Interface:**

```tsx
export interface AttemptResponse {
  success: boolean;
  data: {
    attempt: {
      id: string;
      createdAt: string;
      updatedAt: string;
      studentId: string;
      satPracticeId: string;
      status: "IN_PROGRESS" | "COMPLETED";
      startedAt: string;
      completedAt: string | null;
      submittedAt: string | null;
      totalScore: number | null;
      maxScore: number | null;
      percentageScore: number | null;
      totalTimeSpent: number | null;
      satPractice: {
        id: string;
        name: string;
        status: string;
      };
    };
    activeModule: any;
  };
  message: string;
}
```

## Question Status Logic

The status for each question is determined by the Zustand store (`useExamStore`):

```tsx
const getQuestionStatus = (questionId: string) => {
  const answer = answers[questionId];
  if (!answer) return "unanswered";

  // Priority order (highest to lowest):
  // 1. Marked for review
  // 2. Answered
  // 3. Unanswered
  if (answer.markedForReview) return "review";
  if (answer.selectedAnswer) return "answered";
  return "unanswered";
};
```

### Status States:

1. **"review"** - Question is marked for review (highest priority)
2. **"answered"** - Question has a selected answer
3. **"unanswered"** - Question has no answer selected

## Visual Indicators

### Question Navigation Grid:

- **Answered**: Blue background (`bg-blue-600`)
- **Marked for Review**: Blue background + Red bookmark icon
- **Unanswered**: Dashed border, no background
- **Current Question**: MapPin icon above the question number

### Check Your Work Page:

- Same visual indicators as Question Navigation
- Questions can be clicked to navigate back to exam page

## Flow Summary

1. **User selects test type and subject** → API call to create/resume attempt
2. **API returns attempt data** with `activeModule` containing:
   - Module details
   - Question sets (SET_ONE and SET_TWO)
   - Used question set indicator (`usedQuestionSet`)
   - Section progress and timing info
3. **Questions are built** from the appropriate question set based on `usedQuestionSet`
4. **Zustand store tracks** all answer states:
   - Selected answers
   - Marked for review
   - Strikethrough answers
5. **UI components** read from Zustand store to display status
6. **Navigation** works across exam, check-work, and break pages

## Testing Checklist

- [ ] Test with SET_ONE question set
- [ ] Test with SET_TWO question set
- [ ] Verify question status updates in real-time
- [ ] Verify marked for review works correctly
- [ ] Verify answered questions show proper status
- [ ] Verify unanswered questions display correctly
- [ ] Test navigation between questions
- [ ] Test check-work page displays all statuses
- [ ] Test break page transition
- [ ] Verify attemptId is passed correctly to API calls
