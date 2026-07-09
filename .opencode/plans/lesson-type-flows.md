# Lesson Type Flows — Improvement Plan

## Overview

This plan addresses issues in the lesson type management flows for coaching courses. Lessons can be Live Class, Assignment, Exam, or Reading Material — but the current implementation has incomplete flows, inconsistent UI, and missing features.

---

## 1. Live Class — Create Management Page & UI

**Problem**: `LIVE_CLASS` is the default lesson type but has **no management page**. Only a disabled "Duration (minutes)" field is shown. The backend already has a full `LiveClass` model in Prisma (meeting provider, scheduling, recording, etc.) — but no frontend.

### Changes

#### 1a. Create `/apps/web/src/routes/dashboard/coaching-management/create-live-class.tsx`
- **Route**: `/dashboard/coaching-management/create-live-class`
- **Search params**: `lessonId` (required), `courseTitle`, `moduleTitle`, `lessonTitle` (optional)
- **Form fields**:
  - Meeting Provider: dropdown (`GOOGLE_MEET`, `ZOOM`, `MICROSOFT_TEAMS`, `OTHER`)
  - Meeting Link / URL
  - Meeting ID / Code
  - Password
  - Scheduled Start Date & Time (datetime picker)
  - Duration (minutes)
  - Max Participants
  - Is Recorded (toggle)
- **API**: `POST /coaching/courses/lessons/:lessonId/live-class`
- **On success**: Navigate back to course edit page
- **Validation**: At minimum, meeting link or meeting ID is required

#### 1b. Add Navigation Handler in `lesson-item.tsx`
- Add `handleNavigateToLiveClass()` function (similar pattern to exam/assignment/reading)
- Add "Manage Live Class" button rendered when `isLiveClass` is true
- Replace the disabled "Duration (minutes)" field with a proper management card

#### 1c. Create API Hook
- `useCreateLiveClass(lessonId)` — POST to create/update live class
- `useGetLiveClass(lessonId)` — GET to fetch existing live class data

---

## 2. Fix Wrong Error Message in Assignment Navigation

**Problem**: `lesson-item.tsx:184` — `handleNavigateToAssignments` shows:
> "Please save the lesson (and its module) before managing **reading material**."

Should say **"assignment"**.

**File**: `lesson-item.tsx`
**Change**: Line 184 — `"reading material"` → `"assignment"`

---

## 3. Add Missing `description` Field to Lesson Form

**Problem**: The Zod schema has `description: z.string().optional()` but it's never rendered.

**File**: `lesson-item.tsx`
**Change**: Add a `<FormField>` for `description` (textarea) after the title/type/order grid. Match the module's description field style.

---

## 4. Improve Form Layout

**Problem**: Title, lesson type, and order index are crammed into a single `grid-cols-4` row.

**File**: `lesson-item.tsx`
**Changes**:
- Title field: full width on its own row
- Lesson Type + Order Index: side by side (2 columns)
- Description field: full width below

```
Row 1: [ Title (full width) ]
Row 2: [ Lesson Type (2/3)  |  Order Index (1/3) ]
Row 3: [ Description (full width) ]
```

---

## 5. Distinct Visual Styling for Management Cards

**Problem**: All management cards (Exam, Reading Material, Assignment) use identical `amber-50/amber-200` styling. No visual distinction.

**File**: `lesson-item.tsx`
**Changes**:

| Lesson Type | Background | Border | Icon Accent |
|---|---|---|---|
| Live Class | `bg-orange-50` | `border-orange-200` | Orange |
| Assignment | `bg-blue-50` | `border-blue-200` | Blue |
| Reading Material | `bg-green-50` | `border-green-200` | Green |
| Exam | `bg-purple-50` | `border-purple-200` | Purple |

---

## 6. Show Status Indicators for Existing Content

**Problem**: No indication whether content already exists for a lesson type (number of questions, files, etc.).

**File**: `lesson-item.tsx`
**Changes**:
- For each management card, when the lesson is saved (not temp), fetch a lightweight status:
  - **Exam**: Show `{n} questions` badge if quiz data exists
  - **Assignment**: Show assignment title and due date if exists
  - **Reading Material**: Show `{n} files` badge
  - **Live Class**: Show scheduled date if exists
- Pass placeholder props through from parent or fetch via new hooks

---

## 7. Fix Inconsistent Route Params for Quiz Page

**Problem**: `create-quiz` requires `moduleId` as required param, while `create-assignment` and `create-reading-material` use `lessonId`.

**File**: `lesson-item.tsx` → `handleNavigateToExam()`
**Change**: Pass `lessonId` as the primary param and make `moduleId` optional. Update the route validation schema to accept `lessonId` as primary.

**Note**: This requires updating `create-quiz.tsx` route schema to accept `lessonId` as an alternative to `moduleId`.

---

## 8. Reorder Save Button

**Problem**: Save button appears **above** the management cards, so users may save and miss the management section below.

**File**: `lesson-item.tsx`
**Change**: Move the "Save Lesson" button to the **bottom** of the form, after all management cards. This ensures users see the management options after saving.

---

## 9. General Polish

- **Loading states**: Show skeleton/spinner on management cards while checking if content exists
- **Form sync**: Ensure `content` field is synced from lesson prop to form default values
- **Auto-save hint**: Consider adding `formState.isDirty` indicator text to remind users to save
- **Module item**: Add `description` field sync consistency

---

## Files to Modify (Summary)

| File | Action |
|---|---|
| `lesson-item.tsx` | Add live class nav handler, fix error message, add description field, improve layout, restyle cards, add status indicators, reorder save button |
| `module-item.tsx` | Pass lesson description/content to form |
| `create.tsx` (coaching) | Pass lesson content/description in creation |
| `$courseId.edit.tsx` | Pass lesson content/description in creation |
| **New:** `create-live-class.tsx` | New route page for live class management |
| **New:** `useCreateLiveClass.ts` | API hook for live class |
| **New:** `useGetLiveClass.ts` | API hook to fetch live class |
| `create-quiz.tsx` | Accept `lessonId` as primary search param |

---

## Verification

After implementation:
1. Each lesson type dropdown option shows a distinct management card with corresponding navigation
2. Live class page can be created, saved, and navigated to/from
3. Assignment error message correctly says "assignment"
4. Description field appears and saves correctly
5. Form layout is clean and responsive
6. Each management card has distinct colors
7. Status badges show when content exists
8. Save button is at the bottom of the form
9. All existing functionality (drag-and-drop, module CRUD, etc.) still works
