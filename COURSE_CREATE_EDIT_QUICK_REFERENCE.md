# Quick Reference: Course Create/Edit Feature

## URLs

### Create New Course
```
/dashboard/instructor-portal/create-course
```

### Edit Existing Course
```
/dashboard/instructor-portal/create-course?courseId=<COURSE_ID>
```

## Component Props Changes

### CourseBasicInfo
```tsx
<CourseBasicInfo
  onNext={(data) => {}}
  isLoading={false}
  isEditMode={true}                    // NEW
  initialTitle="Course Title"          // NEW
  initialThumbnailPreview="url"        // NEW
/>
```

### CourseDetails
```tsx
<CourseDetails
  courseTitle="Course Title"
  thumbnailFile={null}
  onNext={(data) => {}}
  onBack={() => {}}
  isLoading={false}
  isEditMode={true}                    // NEW
  initialData={{                       // NEW
    title: "",
    description: "",
    price: 0,
    level: "BEGINNER",
    // ... other fields
  }}
/>
```

### CourseModules
```tsx
<CourseModules
  courseId="123"
  modules={[]}
  allLessons={[]}
  // ... other props
  isEditMode={true}  // NEW
/>
```

## Code Examples

### Linking to Edit Page
```tsx
import { Link } from "@tanstack/react-router";

// From courses list
<Link
  to="/dashboard/instructor-portal/create-course"
  search={{ courseId: course.id }}
>
  Edit Course
</Link>
```

### Route Definition
```tsx
export const Route = createFileRoute(
  "/dashboard/instructor-portal/create-course"
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, any>) => ({
    courseId: search.courseId as string | undefined,
  }),
});
```

### Using Search Parameters
```tsx
const searchParams = useSearch({ from: Route.id });
const editCourseId = searchParams.courseId;
const isEditMode = !!editCourseId;
```

### Conditional Mutations
```tsx
const createCourseMutation = useCreateCourse();
const updateCourseMutation = useUpdateCourse();

const handleDetailsNext = async (data: TcreateLMSCourseSchema) => {
  if (isEditMode && courseId) {
    await updateCourseMutation.mutateAsync({ courseId, data });
  } else {
    const response = await createCourseMutation.mutateAsync(data);
    setCourseId(response.id);
  }
};
```

## State Management

### Mode Detection
```tsx
const searchParams = useSearch({ from: Route.id });
const editCourseId = searchParams.courseId;
const isEditMode = !!editCourseId;
```

### Initial State in Edit Mode
```tsx
const { data: courseData } = useGetCourse(courseId || "");

useEffect(() => {
  if (isEditMode && courseData && !courseState.title) {
    setCourseState({
      title: courseData.title,
      thumbnailFile: null,
      thumbnailPreview: courseData.thumbnail,
    });
    setCourseDataForModules({
      title: courseData.title,
      description: courseData.description,
      // ... other fields
    });
    setStep("modules");
  }
}, [isEditMode, courseData, courseState.title]);
```

### Loading State for Edit Mode
```tsx
if (isEditMode && isCourseLoading) {
  return <LoadingScreen />;
}
```

## API Hooks

### useGetCourse
```tsx
const { data: courseData, isLoading } = useGetCourse(courseId || "");
```

### useCreateCourse
```tsx
const mutation = useCreateCourse();
const response = await mutation.mutateAsync(courseData);
// Returns: { id, title, ... } - new course
```

### useUpdateCourse
```tsx
const mutation = useUpdateCourse();
await mutation.mutateAsync({
  courseId: "123",
  data: { title: "New Title" }
});
// Automatically refetches course data
```

## UI Text Updates

### Headings
```tsx
// Create mode
<h1>Create New Course</h1>
<h1>Course Details</h1>
<h1>Course Modules & Lessons</h1>

// Edit mode
<h1>Edit Course</h1>
<h1>Update Course Details</h1>
<h1>Edit Modules & Lessons</h1>
```

### Button Text
```tsx
// Create mode
<Button>Next</Button>
<Button>Next: Add Modules</Button>

// Edit mode
<Button>Next</Button>
<Button>Save & Next</Button>
```

## Data Flow

### Create Flow
```
User Click "Create"
  → No courseId param
  → Show Step 1: Basic Info
  → Step 2: Course Details
  → Step 3: Modules & Lessons
  → POST /lms/courses
  → Show new courseId
```

### Edit Flow
```
User Click "Edit Course"
  → courseId param provided
  → GET /lms/courses/:id
  → Load course data
  → Skip to Step 3 (modules)
  → User can edit/add modules/lessons
  → PATCH /lms/courses/:id
  → Refetch course data
```

## Error Handling

Both create and update use the same error handling:

```tsx
{
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["courses"] });
    queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
    toast.success("Course created/updated successfully!");
  },
  onError: (error: any) => {
    toast.error(
      error.response?.data?.message || "Failed to create/update course"
    );
  },
}
```

## Debugging

### Check Edit Mode Detection
```tsx
console.log("Edit Mode:", isEditMode);
console.log("Course ID:", editCourseId);
console.log("Course Data:", courseData);
```

### Check Navigation
```tsx
// Verify course ID in URL
console.log(window.location.search);
// Should show: ?courseId=123
```

### Check Mutations
```tsx
console.log("Create loading:", createCourseMutation.isPending);
console.log("Update loading:", updateCourseMutation.isPending);
```
