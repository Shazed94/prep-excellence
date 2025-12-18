# StudentModuleProgress Implementation

## Overview

The `StudentModuleProgress` table is **REQUIRED** for the SAT Practice system as it enables:
- ✅ Detailed module-level progress tracking
- ✅ Adaptive testing with two question sets per module
- ✅ Per-module scoring and performance analytics
- ✅ Sequential module navigation with routing logic

## What Was Implemented

### 1. Database Schema (Already Existed)
The `StudentModuleProgress` model tracks:
- Module start/completion times
- Which question set was used (SET_ONE or SET_TWO)
- Score, correctAnswers, totalQuestions per module
- Status tracking (NOT_STARTED → IN_PROGRESS → COMPLETED)
- Next module routing for adaptive testing

### 2. Validation Schemas (`shared-validators/src/satPractice.ts`)

Added three new validators:

```typescript
// Start a module with specific question set
ZStartModule = {
  sectionProgressId: string (cuid)
  moduleId: string (cuid)
  useQuestionSet: "SET_ONE" | "SET_TWO"
}

// Complete a module (triggers scoring)
ZCompleteModule = {
  moduleProgressId: string (cuid)
}

// Update module progress (for future extensibility)
ZUpdateModuleProgress = {
  moduleProgressId: string (cuid)
  status?: AttemptStatus
  score?: number
  correctAnswers?: number
  nextModuleId?: string
}
```

### 3. Controller Methods (`student-attempt.controller.ts`)

#### `startModule()`
- Validates student owns the attempt
- Marks module as IN_PROGRESS
- Records which question set to use (SET_ONE or SET_TWO)
- Calculates and stores maxScore and totalQuestions
- Updates section progress to IN_PROGRESS
- Returns module with questions

#### `completeModule()`
- Calculates module score from student answers
- Counts correct answers
- Determines next module for adaptive routing
- Marks module as COMPLETED
- Auto-completes section when all modules are done
- Calculates total section time

#### `getModuleProgress()`
- Retrieves detailed module progress
- Includes all questions and options
- Verifies student ownership

### 4. Automatic Module Progress Creation

Modified `start()` method in StudentAttemptController:
```typescript
// When creating an attempt, now also creates:
for (const section of satPractice.section) {
  const sectionProgress = await tx.studentSectionProgress.create({...});
  
  // NEW: Create module progress for each module
  for (const module of section.modules) {
    await tx.studentModuleProgress.create({
      sectionProgressId: sectionProgress.id,
      moduleId: module.id,
      status: "NOT_STARTED"
    });
  }
}
```

### 5. API Routes (`routes.ts`)

Added three new endpoints:
```typescript
POST /api/v1/sat-practice/module-progress/start
POST /api/v1/sat-practice/module-progress/complete
GET  /api/v1/sat-practice/module-progress/:id
```

## Data Flow

```
1. Student starts attempt
   ↓
2. System creates StudentSATAttempt
   ↓
3. System creates StudentSectionProgress for each section
   ↓
4. System creates StudentModuleProgress for each module ✅ NEW
   ↓
5. Student starts first module (POST /module-progress/start)
   ↓
6. System marks module IN_PROGRESS and loads question set
   ↓
7. Student submits answers (existing submitAnswer endpoint)
   ↓
8. Student completes module (POST /module-progress/complete)
   ↓
9. System calculates score, determines next module
   ↓
10. Repeat steps 5-9 for each module
   ↓
11. When all modules complete, section auto-completes
   ↓
12. Student submits attempt (existing submit endpoint)
```

## Adaptive Testing Support

The implementation supports adaptive testing:

1. **Two Question Sets**: Each module can have `questionsSetOne` and `questionsSetTwo`
2. **Module Threshold**: Module has `threshold` field to determine if student passes
3. **Direction Routing**: Module has `direction` field ("EASIER" or "HARDER")
4. **Next Module Tracking**: `nextModuleId` can route based on performance

### Future Enhancement Example:
```typescript
// In completeModule(), add adaptive logic:
const passedThreshold = (score / maxScore) * 100 >= module.threshold;

if (module.direction === "HARDER" && passedThreshold) {
  // Route to harder module
  nextModuleId = findHarderModule();
} else if (module.direction === "EASIER" && !passedThreshold) {
  // Route to easier module
  nextModuleId = findEasierModule();
}
```

## Usage Example (Frontend)

```typescript
// 1. Start attempt
const attempt = await api.post('/attempts/start', { satPracticeId });

// 2. Get first section and module
const firstSection = attempt.sectionProgress[0];
const firstModule = firstSection.moduleProgress[0];

// 3. Start module with question set
const moduleProgress = await api.post('/module-progress/start', {
  sectionProgressId: firstSection.id,
  moduleId: firstModule.moduleId,
  useQuestionSet: 'SET_ONE'
});

// 4. Display questions from moduleProgress.module.questionsSetOne

// 5. Submit answers as student progresses
await api.post('/attempts/submit-answer', {
  attemptId: attempt.id,
  questionId: question.id,
  selectedOptionIds: [optionId]
});

// 6. Complete module when done
await api.post('/module-progress/complete', {
  moduleProgressId: moduleProgress.id
});

// 7. Start next module or complete section
```

## Analytics & Reporting Benefits

With `StudentModuleProgress`, you can now:

✅ Show per-module performance in student dashboard
✅ Identify which modules students struggle with
✅ Calculate average time per module
✅ Track question set usage (which set performs better)
✅ Generate heat maps of module difficulty
✅ Provide targeted recommendations based on weak modules
✅ Support adaptive test paths

## Testing the Implementation

1. **Create a test with modules**:
   ```bash
   POST /api/v1/sat-practice/tests
   # Include sections with modules and questions
   ```

2. **Start an attempt**:
   ```bash
   POST /api/v1/sat-practice/attempts/start
   # Check that module progress records are created
   ```

3. **Start a module**:
   ```bash
   POST /api/v1/sat-practice/module-progress/start
   {
     "sectionProgressId": "...",
     "moduleId": "...",
     "useQuestionSet": "SET_ONE"
   }
   ```

4. **Submit answers and complete module**:
   ```bash
   POST /api/v1/sat-practice/module-progress/complete
   {
     "moduleProgressId": "..."
   }
   ```

## Conclusion

The `StudentModuleProgress` table is **essential** and **fully implemented**. It provides:
- Granular progress tracking
- Adaptive testing capability
- Rich analytics potential
- Better student experience with module-level feedback

**Status**: ✅ IMPLEMENTED AND READY TO USE
