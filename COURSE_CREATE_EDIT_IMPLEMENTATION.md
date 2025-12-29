# Course Create/Edit Implementation Guide

## Overview

The `/dashboard/instructor-portal/create-course` route now supports both **creating new courses** and **editing existing courses** using the same page and form.

## How It Works

### Mode Detection

The route accepts an optional `courseId` query parameter to determine the mode:
- **Create Mode**: No `courseId` parameter → User starts from Step 1 (Basic Info)
- **Edit Mode**: `courseId` parameter provided → Fetches existing course data and skips to Step 3 (Modules)

```tsx
// Navigate to create new course
<Link to="/dashboard/instructor-portal/create-course">
  Create Course
</Link>

// Navigate to edit existing course
<Link 
  to="/dashboard/instructor-portal/create-course"
  search={{ courseId: "course-123" }}
>
  Edit Course
</Link>
```

### Data Flow

#### Create Mode
```
Basic Info (Step 1)
    ↓
Course Details (Step 2)
    ↓
Modules & Lessons (Step 3)
    ↓
useCreateCourse() → API POST /lms/courses
    ↓
Course created, modules/lessons can be added
```

#### Edit Mode
```
Load Course Data (useGetCourse)
    ↓
Skip to Modules & Lessons (Step 3)
    ↓
Update course details/modules/lessons
    ↓
useUpdateCourse() → API PATCH /lms/courses/:id
    ↓
Course updated, data refetched automatically
```

## Modified Files

### 1. [create-course.tsx](apps/web/src/routes/dashboard/instructor-portal/create-course.tsx)

**Key Changes:**
- Added route parameter validation for `courseId`
- Imported `useUpdateCourse` hook
- Added `useEffect` to detect edit mode and pre-populate form
- Load course data in edit mode and skip to modules step
- Handle both create and update submissions

**Mode Detection:**
```tsx
const searchParams = useSearch({ from: Route.id });
const editCourseId = searchParams.courseId;
const isEditMode = !!editCourseId;

// When editing, skip basic/details steps
useEffect(() => {
  if (isEditMode && courseData && !courseState.title) {
    setCourseState({ /* populate with courseData */ });
    setCourseDataForModules({ /* populate with courseData */ });
    setStep("modules"); // Skip to modules
  }
}, [isEditMode, courseData, courseState.title]);
```

**Conditional Submission:**
```tsx
const handleDetailsNext = async (data: TcreateLMSCourseSchema) => {
  if (isEditMode && courseId) {
    // Update existing course
    await updateCourseMutation.mutateAsync({ courseId, data });
  } else {
    // Create new course
    const response = await createCourseMutation.mutateAsync(data);
    setCourseId(response.id);
  }
};
```

### 2. [course-basic-info.tsx](apps/web/src/components/courses/course-basic-info.tsx)

**Props Added:**
```tsx
interface CourseBasicInfoProps {
  onNext: (data: { title: string; thumbnail: File | null }) => void;
  isLoading?: boolean;
  isEditMode?: boolean;           // NEW
  initialTitle?: string;          // NEW
  initialThumbnailPreview?: string; // NEW
}
```

**Features:**
- Pre-populates title with `initialTitle` in edit mode
- Shows thumbnail preview with `initialThumbnailPreview`
- Heading dynamically shows "Edit Course" vs "Create New Course"

### 3. [course-details.tsx](apps/web/src/components/courses/course-details.tsx)

**Props Added:**
```tsx
interface CourseDetailsProps {
  // ... existing props
  isEditMode?: boolean;           // NEW
  initialData?: Partial<TcreateLMSCourseSchema>; // NEW
}
```

**Features:**
- Pre-populates form fields with `initialData` in edit mode
- Form title shows "Update Course Details" vs "Course Details"
- Button text shows "Save & Next" vs "Next: Add Modules"

### 4. [course-modules.tsx](apps/web/src/components/courses/course-modules.tsx)

**Props Added:**
```tsx
interface CourseModulesProps {
  // ... existing props
  isEditMode?: boolean; // NEW
}
```

**Features:**
- Heading shows "Edit Modules & Lessons" vs "Course Modules & Lessons"
- All module/lesson management works identically in both modes

### 5. [courses.tsx](apps/web/src/routes/dashboard/instructor-portal/courses.tsx)

**Changes:**
- Updated all "Edit" buttons to pass `courseId` as query parameter

```tsx
// Grid view edit button
<Link
  to="/dashboard/instructor-portal/create-course"
  search={{ courseId: course.id }}
>
  <Edit className="w-4 h-4 mr-2" />
  Edit
</Link>

// List view edit button
<Link
  to="/dashboard/instructor-portal/create-course"
  search={{ courseId: course.id }}
>
  <Edit className="w-4 h-4 mr-2" />
  Edit Course
</Link>

// Dropdown menu edit button
<Link
  to="/dashboard/instructor-portal/create-course"
  search={{ courseId: course.id }}
>
  <Edit className="w-4 h-4 mr-2" />
  Edit Course
</Link>
```

## API Interactions

### Create Course
- **Method:** POST
- **Endpoint:** `/lms/courses`
- **Payload:** Full course details + thumbnail file
- **Response:** New course object with ID

### Update Course
- **Method:** PATCH
- **Endpoint:** `/lms/courses/:courseId`
- **Payload:** Partial course details (only changed fields)
- **Response:** Updated course object

### Fetch Course (for edit mode)
- **Method:** GET
- **Endpoint:** `/lms/courses/:courseId`
- **Response:** Complete course object with modules and lessons

## Shared Logic

Both create and update modes use the same:
- Form validation (via Zod schemas)
- UI components (CourseBasicInfo, CourseDetails, CourseModules)
- Module/lesson management operations
- Data sync and refetching

## User Experience

### Creating a New Course
1. Click "Create Course" button
2. Fill in basic info (title, thumbnail)
3. Complete course details (description, price, instructor, etc.)
4. Add modules and lessons
5. Course is created and ready for publishing

### Editing an Existing Course
1. Click "Edit" on any course in the courses list
2. Page loads course data and shows modules/lessons directly
3. User can modify modules, lessons, or basic course info
4. Changes are saved immediately to the API
5. Course data is refetched to keep UI in sync

## Key Features

✅ **Shared UI**: Both modes use identical components
✅ **Smart Mode Detection**: Automatically detects edit vs create via query params
✅ **Data Sync**: Uses `useGetCourse` as single source of truth
✅ **Optimized Flow**: Edit mode skips to modules step when data is loaded
✅ **Immediate Feedback**: Mutations include loading states and toast notifications
✅ **Type Safety**: Full TypeScript support across all components
✅ **Backward Compatible**: Existing create flow works unchanged

## Testing Checklist

- [ ] Create new course from scratch
- [ ] Edit existing course (modify title, description, price)
- [ ] Add modules to new course
- [ ] Add modules to existing course
- [ ] Edit modules in existing course
- [ ] Add lessons to modules
- [ ] Edit lessons in modules
- [ ] Delete modules/lessons
- [ ] Verify thumbnail upload in create mode
- [ ] Verify thumbnail preview in edit mode
- [ ] Check loading states during operations
- [ ] Verify success/error toasts
- [ ] Test navigation back/forward
- [ ] Verify course data persists across steps

## Configuration

No additional configuration needed. The feature uses existing:
- `useGetCourse()` hook for fetching course data
- `useCreateCourse()` hook for creating courses
- `useUpdateCourse()` hook for updating courses
- TanStack Router for navigation and query parameters
- TanStack Query for data fetching and caching

## Future Improvements

- [ ] Add draft/autosave functionality
- [ ] Implement course duplication
- [ ] Add course versioning/history
- [ ] Batch module/lesson updates
- [ ] Publish/unpublish within edit flow
- [ ] Add course preview during editing
