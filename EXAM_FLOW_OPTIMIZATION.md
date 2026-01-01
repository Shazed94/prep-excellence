# Exam Flow Optimization - Implementation Summary

## Overview
This document outlines the optimization implemented for the SAT exam flow based on the API response structure, ensuring proper module-based navigation, time management, and UI layout.

## Key Changes

### 1. Question Interface Update (`question.ts`)
- **Removed**: `layout: "split"` property (since all questions use split layout)
- **Added**: `moduleId?: string` property to track which module each question belongs to
- This allows for proper module-based navigation and break page triggering

```typescript
export interface Question {
  id: string;
  questionNumber: number;
  text: string;
  options: { id: string; label: string; text: string; }[];
  passage?: string;
  moduleId?: string;  // NEW: Track module ownership
}
```

### 2. Question Building Logic (`index.tsx`)
Enhanced the `questions` useMemo to:
- Build questions from all modules within the current section
- Sort modules by `orderIndex`
- Respect the `usedQuestionSet` (SET_ONE or SET_TWO) per module
- Assign `moduleId` to each question for navigation tracking
- Parse HTML content from API (`qb.content`) as question text

```typescript
const questions: Question[] = useMemo(() => {
  // Maps through section → modules → questionsSetOne/Two → questions
  // Assigns sequential question numbers across all modules
  // Stores moduleId with each question
}, [currentSectionProg]);
```

### 3. Split Panel Layout Update
**Changed**: Question and answer placement
- **Left Panel**: Passage (if exists) + Question Text
- **Right Panel**: Answer Options with controls

Previously the question text was in the right panel with answers. Now it's logically separated.

### 4. Module-Based Navigation (`handleNext`)
Implemented intelligent navigation that:
- Detects module boundaries by comparing current and next question's `moduleId`
- Shows "Check Your Work" page at the end of each module
- From "Check Your Work", shows "Break Page" when moving to next module
- Handles last question of section appropriately

```typescript
const handleNext = () => {
  // If on check-work page
  if (currentPage === "check-work") {
    const nextQuestion = questions[currentIndex + 1];
    // Show break if next module or end of section
    if (!nextQuestion || currentQuestionData?.moduleId !== nextQuestion?.moduleId) {
      setPage("break");
    }
  }
  // During exam
  else {
    const nextQuestion = questions[currentIndex + 1];
    // Show check-work at end of module
    if (!nextQuestion || currentQuestionData?.moduleId !== nextQuestion?.moduleId) {
      setPage("check-work");
    }
  }
};
```

### 5. Break Page Handling (`handleBreakComplete`)
Enhanced to:
- Check if there's a next module in current section
- If yes: Navigate to first question of next module
- If no: Check for next section
- If next section exists: Move to that section
- If last section: Show completion page

### 6. Time Management
**Added automatic time-up handling:**
```typescript
useEffect(() => {
  if (!showPreview && timeRemaining <= 0 && 
      currentPage !== "break" && currentPage !== "complete") {
    setPage("break");
  }
}, [timeRemaining, showPreview, currentPage]);
```

When a section's time runs out:
- Automatically navigates to Break Page
- No further interaction allowed until break completes

### 7. Back Button Enhancement (`handleBack`)
Added protection against going back from break page:
```typescript
const handleBack = () => {
  // Prevent going back from break page
  if (currentPage === "break") {
    return;
  }
  // ... rest of logic
};
```

### 8. QuestionDisplay Component Simplification
Removed:
- Question text rendering (now in left panel)
- Passage rendering (now in left panel)
- Layout conditional logic

Now focuses solely on:
- Question number and "Mark for Review" controls
- Eliminate answer toggle
- Answer options display

## Flow Diagram

```
Start Exam
    ↓
Module 1 Questions → Check Your Work → Break Page
    ↓
Module 2 Questions → Check Your Work → Break Page
    ↓
... (continue for all modules in section)
    ↓
Section Complete → Break Page (if more sections)
    ↓
Next Section Module 1 Questions → ...
    ↓
All Sections Complete → Complete Page
```

## Time Management Rules

1. **During Section**: Timer counts down from section.duration (in minutes)
2. **Time Expires**: Auto-navigate to Break Page
3. **Cannot Go Back**: Once on Break Page (via time-up or module completion), back button is disabled
4. **Break Duration**: Configurable (default 170 seconds)
5. **Resume**: Can manually resume or auto-resume when break timer expires

## API Integration Points

### Section Progress Structure
```typescript
{
  sectionProgress: [
    {
      section: {
        modules: [
          {
            questionsSetOne: [...],  // Used based on moduleProgress.usedQuestionSet
            questionsSetTwo: [...]
          }
        ]
      },
      moduleProgress: [...]
    }
  ]
}
```

### Navigation State
- `currentSectionProgressId`: Tracks which section is active
- `currentModuleId`: Tracks which module is active (via question.moduleId)
- `currentQuestionId`: Tracks current question

## Benefits

1. ✅ **Accurate Module Boundaries**: Break pages appear after each module, not just sections
2. ✅ **Proper Time Management**: Auto-navigation when time expires
3. ✅ **Better UX**: Question text and passages on left, answers on right for easier reading
4. ✅ **Simplified Code**: Removed unnecessary layout conditionals since all questions use split layout
5. ✅ **API Alignment**: Question building directly maps to API structure
6. ✅ **State Tracking**: Each question knows its module for proper flow control

## Testing Checklist

- [ ] Module transitions trigger Check Your Work page
- [ ] Check Your Work → Next triggers Break Page between modules
- [ ] Section time expiry auto-navigates to Break Page
- [ ] Cannot go back from Break Page
- [ ] Break Page timer counts down correctly
- [ ] Multiple sections navigate properly
- [ ] Question text appears in left panel
- [ ] Answer options appear in right panel
- [ ] Passages render correctly in left panel
- [ ] Question numbering is sequential across modules

## Files Modified

1. `/apps/web/src/store/question.ts` - Question interface
2. `/apps/web/src/routes/bluebook/index.tsx` - Main exam logic
3. `/apps/web/src/components/bluebook/question-display.tsx` - Display component
4. `/apps/web/src/components/bluebook/split-panel.tsx` - (no changes, used correctly)

## Notes

- The `layout` property was removed entirely since all questions use split layout
- `moduleId` is optional to maintain backward compatibility with mock data
- Time management runs independently and can interrupt the flow when section time expires
- The solution is optimized for the exact API structure provided
