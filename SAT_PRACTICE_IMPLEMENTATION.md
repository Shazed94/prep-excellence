# SAT Practice Exam - Implementation Guide

## Overview

This document describes the complete implementation of the SAT Practice exam flow, including student exam taking, teacher grading, and score management.

## Architecture

The implementation follows the full-stack pattern defined in `AGENTS.md`:

```
shared-validators (source of truth)
    ↓
    ├─→ Backend (api)
    │   ├─→ Controllers validate and process
    │   ├─→ Routes define endpoints
    │   └─→ Returns typed responses
    │
    └─→ Frontend (web)
        ├─→ Hooks use schemas for API calls
        ├─→ Components display UI
        └─→ Full type safety throughout
```

## Database Schema

The implementation uses the Prisma schema defined in `apps/api/prisma/schema/sat-practice.prisma` (lines 240-390), which includes:

### Core Models
- **SATPractice**: The test itself with sections
- **Section**: Major divisions with modules
- **Module**: Contains question sets (adaptive testing support)
- **QuestionBank**: Question pool with metadata
- **Options**: Answer choices for questions

### Student Progress Models
- **StudentSATAttempt**: Tracks overall attempt
- **StudentSectionProgress**: Progress through sections
- **StudentModuleProgress**: Progress through modules
- **StudentAnswer**: Individual answer storage
- **StudentAnswerOption**: Selected MCQ options

## Backend Implementation

### 1. Validators (`packages/shared-validators/src/satPractice.ts`)

Added comprehensive Zod schemas for:
- **Start Attempt**: `ZStartAttemptSchema`
- **Submit MCQ Answer**: `ZSubmitMCQAnswerSchema`
- **Submit Text Answer**: `ZSubmitTextAnswerSchema`
- **Navigate Section**: `ZNavigateSectionSchema`
- **Complete Module**: `ZCompleteModuleSchema`
- **Submit Attempt**: `ZSubmitAttemptSchema`
- **Grade Text Answer**: `ZGradeTextAnswerSchema`
- **Recalculate Score**: `ZRecalculateScoreSchema`

### 2. Controllers

#### Student Attempt Controller (`apps/api/src/apps/satPractice/student-attempt.controller.ts`)

**StudentAttemptController** handles all student exam operations:

- `startAttempt()`: Creates new attempt with all progress tracking
  - Verifies SAT Practice is published
  - Checks for existing in-progress attempts
  - Creates section and module progress in transaction
  - Starts first section/module automatically

- `getAttempt()`: Retrieves complete attempt details with all relations

- `submitMCQAnswer()`: Saves MCQ/Multiple Choice answers
  - Auto-grades immediately
  - Allows answer modification
  - Updates points earned

- `submitTextAnswer()`: Saves text answers for manual grading
  - Marks as pending review
  - Points set to 0 until graded

- `completeModule()`: Finishes a module and calculates score
  - Counts correct answers
  - Auto-completes section if all modules done

- `navigateToNextSection()`: Moves to next section
  - Validates current section is complete
  - Auto-submits attempt if last section

- `submitAttempt()`: Final submission
  - Calculates total score
  - Sets status based on grading needs (SUBMITTED vs GRADED)

#### Teacher Grading Controller (`apps/api/src/apps/satPractice/teacher-grading.controller.ts`)

**TeacherGradingController** handles all grading operations:

- `getPendingAnswers()`: Lists answers needing grading
  - Filters by SAT practice or student
  - Pagination support

- `getGradedAnswers()`: Lists already graded answers for review

- `gradeTextAnswer()`: Grades a single text answer
  - Validates points don't exceed question max
  - Records teacher feedback
  - Auto-recalculates attempt score

- `updateGradedAnswer()`: Modifies existing grade

- `bulkGradeAnswers()`: Grade multiple answers at once
  - Transaction-based for consistency
  - Recalculates scores for affected attempts

- `recalculateScore()`: Manually trigger score recalculation

- `getGradingStats()`: Statistics for a SAT practice test
  - Total attempts
  - Pending/graded answer counts
  - Progress percentage

### 3. Routes (`apps/api/src/apps/satPractice/routes.ts`)

All routes mounted under `/api/v1/sat-practice`:

**Student Routes:**
- `POST /attempts` - Start attempt
- `GET /attempts/:attemptId` - Get attempt details
- `POST /attempts/submit-mcq-answer` - Submit MCQ answer
- `POST /attempts/submit-text-answer` - Submit text answer
- `POST /attempts/complete-module` - Complete module
- `POST /attempts/next-section` - Navigate to next section
- `POST /attempts/submit` - Submit entire attempt

**Teacher Routes:**
- `GET /grading/pending` - Get pending answers
- `GET /grading/graded` - Get graded answers
- `POST /grading/grade` - Grade an answer
- `PUT /grading/grade/:answerId` - Update graded answer
- `POST /grading/bulk-grade` - Bulk grade answers
- `POST /grading/recalculate` - Recalculate score
- `GET /grading/stats/:satPracticeId` - Get grading stats

## Frontend Implementation

### 1. API Hooks (`apps/web/src/integrations/sat-practice/hooks.ts`)

TanStack Query hooks for all operations:

**Student Hooks:**
- `useStartAttempt()` - Start new exam
- `useGetAttempt()` - Load exam state
- `useSubmitMCQAnswer()` - Save MCQ answer
- `useSubmitTextAnswer()` - Save text answer
- `useCompleteModule()` - Complete module
- `useNavigateToNextSection()` - Next section
- `useSubmitAttempt()` - Submit exam

**Teacher Hooks:**
- `useGetPendingAnswers()` - Load pending answers
- `useGetGradedAnswers()` - Load graded answers
- `useGradeTextAnswer()` - Grade an answer
- `useUpdateGradedAnswer()` - Update grade
- `useBulkGradeAnswers()` - Bulk grade
- `useRecalculateScore()` - Recalculate
- `useGetGradingStats()` - Load statistics

**Utility Hooks:**
- `useGetPublishedSATPractice()` - List available tests
- `useGetStudentAttempts()` - Student's attempt history

### 2. Components (`apps/web/src/components/sat-practice/`)

#### SATPracticeList
**Purpose**: Browse and start exams

**Features**:
- Displays available SAT practice tests
- Shows test metadata (sections, duration, difficulty)
- Resume in-progress attempts
- View completed exam results
- Start new attempts

#### ExamInterface
**Purpose**: Main exam-taking interface

**Features**:
- Section-by-section navigation
- Question display with rich content
- Answer input (MCQ, multiple choice, text)
- Flag questions for review
- Auto-save answers on selection
- Progress tracking
- Module completion
- Section navigation

**Question Types Supported**:
- Single Choice (radio buttons)
- Multiple Choice (checkboxes)
- True/False
- Fill in the Blank (text)
- Short Answer (textarea)

#### ExamResults
**Purpose**: Display exam results and review

**Features**:
- Overall score display
- Accuracy metrics
- Section-by-section breakdown
- Detailed answer review
- Correct/incorrect indicators
- Teacher feedback display
- Pending review status

#### TeacherGradingInterface
**Purpose**: Grade text answers

**Features**:
- Pending answers queue
- Answer details with context
- Reference answer display
- Grading form (correct/incorrect, points, feedback)
- Grading statistics dashboard
- Pagination for large answer sets
- Auto score recalculation

## User Flows

### Student Exam Flow

1. **Browse Exams** (`SATPracticeList`)
   - View available published SAT practice tests
   - See test metadata and requirements
   - Check existing attempts

2. **Start Exam**
   - Click "Start Exam"
   - API creates `StudentSATAttempt` with progress tracking
   - Navigate to `ExamInterface`

3. **Take Exam** (`ExamInterface`)
   - View questions one at a time
   - For MCQ/True-False:
     - Select answer(s)
     - Answer auto-saved immediately
     - Can go back and change
   - For Text questions:
     - Type answer
     - Submit for teacher review
   - Flag questions for review
   - Complete module → auto-calculate module score
   - Complete section → move to next section

4. **Complete Exam**
   - After last section, attempt auto-submitted
   - Navigate to `ExamResults`

5. **View Results** (`ExamResults`)
   - See overall score
   - Review all answers
   - View correct/incorrect status
   - Read teacher feedback (for text answers)
   - Check pending review status

### Teacher Grading Flow

1. **Access Grading Interface** (`TeacherGradingInterface`)
   - View grading statistics
   - See pending answer count
   - Track grading progress

2. **Grade Answers**
   - Select answer from pending queue
   - Review:
     - Student information
     - Original question
     - Student's answer
     - Reference answer (if available)
   - Assign grade:
     - Mark correct/incorrect
     - Assign points
     - Add feedback (optional)
   - Submit grade

3. **Score Updates**
   - Attempt score recalculated automatically
   - Student status updated (SUBMITTED → GRADED)
   - Student can view updated results

## Features

### Auto-Grading
- MCQ, Multiple Choice, True/False questions are auto-graded instantly
- Points awarded immediately
- Student sees results right away

### Manual Grading
- Text answers (Fill in Blank, Short Answer) require teacher review
- Marked as "pending review"
- Score shown as "preliminary" until fully graded

### Answer Modification
- Students can change MCQ answers before submission
- Previous answers replaced with new selection
- Auto-grading recalculated

### Progress Tracking
- Section-level progress
- Module-level progress
- Question-level completion
- Time tracking support

### Adaptive Testing Support (Schema-ready)
- Module includes threshold and direction fields
- Can route to easier/harder question sets
- `questionsSetOne` and `questionsSetTwo` support
- Ready for future adaptive implementation

## API Endpoints Reference

### Student Endpoints

```typescript
// Start new attempt
POST /api/v1/sat-practice/attempts
Body: { satPracticeId: string, studentId: string }

// Get attempt details
GET /api/v1/sat-practice/attempts/:attemptId

// Submit MCQ answer
POST /api/v1/sat-practice/attempts/submit-mcq-answer
Body: {
  attemptId: string,
  questionId: string,
  selectedOptionIds: string[],
  timeSpent?: number,
  flaggedForReview?: boolean
}

// Submit text answer
POST /api/v1/sat-practice/attempts/submit-text-answer
Body: {
  attemptId: string,
  questionId: string,
  textAnswer: string,
  timeSpent?: number,
  flaggedForReview?: boolean
}

// Complete module
POST /api/v1/sat-practice/attempts/complete-module
Body: {
  attemptId: string,
  sectionId: string,
  moduleId: string,
  usedQuestionSet: "SET_ONE" | "SET_TWO"
}

// Navigate to next section
POST /api/v1/sat-practice/attempts/next-section
Body: { attemptId: string, currentSectionId: string }

// Submit attempt
POST /api/v1/sat-practice/attempts/submit
Body: { attemptId: string }
```

### Teacher Endpoints

```typescript
// Get pending answers
GET /api/v1/sat-practice/grading/pending
Query: { satPracticeId?: string, studentId?: string, page?: number, limit?: number }

// Get graded answers
GET /api/v1/sat-practice/grading/graded
Query: { satPracticeId?: string, studentId?: string, page?: number, limit?: number }

// Grade answer
POST /api/v1/sat-practice/grading/grade
Body: {
  answerId: string,
  isCorrect: boolean,
  pointsEarned: number,
  teacherFeedback?: string,
  gradedByTeacherId: string
}

// Update graded answer
PUT /api/v1/sat-practice/grading/grade/:answerId
Body: {
  isCorrect: boolean,
  pointsEarned: number,
  teacherFeedback?: string,
  gradedByTeacherId: string
}

// Bulk grade
POST /api/v1/sat-practice/grading/bulk-grade
Body: {
  answers: Array<{
    answerId: string,
    isCorrect: boolean,
    pointsEarned: number,
    teacherFeedback?: string
  }>,
  gradedByTeacherId: string
}

// Recalculate score
POST /api/v1/sat-practice/grading/recalculate
Body: { attemptId: string }

// Get grading stats
GET /api/v1/sat-practice/grading/stats/:satPracticeId
```

## Type Safety

All data flows through shared validators ensuring:
- Backend validates incoming requests
- Frontend validates before submission
- TypeScript types inferred from schemas
- No type mismatches possible

## Error Handling

- Validation errors caught by Zod schemas
- API errors handled in mutation hooks
- User-friendly toast notifications
- Graceful fallbacks for loading states

## Testing Recommendations

### Backend Tests
1. Test attempt creation with valid/invalid data
2. Test MCQ answer submission and auto-grading
3. Test text answer submission (no grading)
4. Test section navigation logic
5. Test module completion and score calculation
6. Test teacher grading and score recalculation
7. Test edge cases (incomplete sections, missing data)

### Frontend Tests
1. Test exam list display
2. Test exam start flow
3. Test answer submission (MCQ and text)
4. Test navigation (next/previous questions)
5. Test grading interface
6. Test results display

## Future Enhancements

1. **Adaptive Testing**: Use module threshold/direction for dynamic difficulty
2. **Timed Sections**: Enforce time limits per section
3. **Review Mode**: Allow students to review flagged questions
4. **Analytics**: Detailed performance analytics per domain/skill
5. **Partial Credit**: Award partial points for multiple choice questions
6. **Question Explanations**: Show detailed explanations after completion
7. **Practice Mode**: Untimed practice with instant feedback

## Deployment Notes

1. Run Prisma migrations to create tables:
   ```bash
   cd apps/api
   pnpm prisma migrate dev
   ```

2. Ensure environment variables are set:
   - Database connection string
   - API base URL for frontend

3. Build and deploy:
   ```bash
   # Backend
   cd apps/api
   pnpm build
   
   # Frontend
   cd apps/web
   pnpm build
   ```

## Troubleshooting

### Issue: Answers not saving
- Check network requests in dev tools
- Verify attemptId is correct
- Check validation errors in response

### Issue: Score not updating after grading
- Check `recalculateScoreInternal` is called
- Verify all answers have valid points
- Check for unhandled errors in grading

### Issue: Cannot start exam
- Verify SAT Practice status is PUBLISHED
- Check student has valid ID
- Verify no conflicting in-progress attempts

## Support

For issues or questions about this implementation, refer to:
- Prisma schema: `apps/api/prisma/schema/sat-practice.prisma`
- Validators: `packages/shared-validators/src/satPractice.ts`
- Backend controllers: `apps/api/src/apps/satPractice/`
- Frontend hooks: `apps/web/src/integrations/sat-practice/`
- Components: `apps/web/src/components/sat-practice/`
