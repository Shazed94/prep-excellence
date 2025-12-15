# Quick Reference: Standardized API Usage

## Query Parameters

All GET list endpoints now support these standard query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (min: 1) |
| `limit` | number | 10 | Items per page (min: 1, max: 100) |
| `sortBy` | string | "createdAt" | Field to sort by |
| `orderBy` | "asc"\|"desc" | "desc" | Sort direction |
| `search` | string | - | Full-text search query |
| `filters[key]` | string | - | Field-specific filters |

## API Examples by Module

### LMS Courses
```bash
# Get all courses with pagination
GET /api/lms/courses?page=1&limit=20

# Search courses
GET /api/lms/courses?search=JavaScript

# Filter by category and level
GET /api/lms/courses?filters[category]=PROGRAMMING&filters[level]=INTERMEDIATE

# Published courses only
GET /api/lms/courses?filters[isPublished]=true

# Combined
GET /api/lms/courses?page=2&limit=10&sortBy=title&orderBy=asc&search=Web&filters[category]=PROGRAMMING
```

### LMS Modules
```bash
# Get modules for a course
GET /api/lms/courses/:courseId/modules?page=1&limit=10

# Search modules
GET /api/lms/courses/:courseId/modules?search=introduction
```

### LMS Lessons
```bash
# Get lessons for a module
GET /api/lms/modules/:moduleId/lessons?page=1&limit=10

# Filter by content type
GET /api/lms/modules/:moduleId/lessons?filters[contentType]=VIDEO

# For a specific student (with unlock logic)
GET /api/lms/modules/:moduleId/lessons?filters[studentId]=ck...
```

### LMS Quiz Attempts
```bash
# Get quiz attempts
GET /api/lms/quizzes/:quizId/attempts?page=1&limit=10

# Filter by enrollment and passed status
GET /api/lms/quizzes/:quizId/attempts?filters[enrollmentId]=ck...&filters[isPassed]=true
```

### LMS Enrollments
```bash
# Get student enrollments
GET /api/lms/enrollments?filters[studentId]=ck...

# Filter by status
GET /api/lms/enrollments?filters[studentId]=ck...&filters[status]=ACTIVE
```

### LMS Discussions
```bash
# Get discussions for a lesson
GET /api/lms/courses/:courseId/discussions?filters[lessonId]=ck...

# Search discussions
GET /api/lms/courses/:courseId/discussions?filters[lessonId]=ck...&search=homework
```

### Coaching Courses
```bash
# Get all coaching courses
GET /api/coaching/courses?page=1&limit=20

# Search coaching courses
GET /api/coaching/courses?search=SAT Prep

# Filter by category and published status
GET /api/coaching/courses?filters[category]=TEST_PREP&filters[isPublished]=true

# Sort by start date
GET /api/coaching/courses?sortBy=startDate&orderBy=asc
```

### One-to-One Sessions (Student)
```bash
# Get student sessions
GET /api/onetoone/sessions?filters[studentId]=ck...

# Filter by status
GET /api/onetoone/sessions?filters[studentId]=ck...&filters[status]=SCHEDULED

# Search sessions
GET /api/onetoone/sessions?filters[studentId]=ck...&search=Math tutoring
```

### One-to-One Sessions (Teacher)
```bash
# Get teacher sessions
GET /api/onetoone/teachers/:teacherId/sessions?page=1&limit=20

# Filter by status
GET /api/onetoone/teachers/:teacherId/sessions?filters[status]=COMPLETED
```

### Teacher Search
```bash
# Search teachers
GET /api/onetoone/teachers/search?page=1&limit=20

# Filter by subject and level
GET /api/onetoone/teachers/search?subject=Mathematics&level=HIGH_SCHOOL

# Filter by hourly rate range
GET /api/onetoone/teachers/search?minHourlyRate=20&maxHourlyRate=50

# Filter by minimum rating
GET /api/onetoone/teachers/search?minRating=4.5

# Available teachers only
GET /api/onetoone/teachers/search?isAvailable=true
```

### Payments
```bash
# Get payment history
GET /api/payments?page=1&limit=20

# Filter by student
GET /api/payments?filters[studentId]=ck...

# Filter by status and provider
GET /api/payments?filters[status]=COMPLETED&filters[provider]=STRIPE

# Filter by date range
GET /api/payments?filters[startDate]=2024-01-01&filters[endDate]=2024-12-31
```

## Response Format

All endpoints return this structure:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Caching Behavior

- All list endpoints cache responses for **60 seconds**
- Cache is automatically invalidated on UPDATE/DELETE operations
- Cached responses include: `"message": "... (from cache)"`

## Frontend Integration Example (React/TypeScript)

```typescript
import { useQuery } from '@tanstack/react-query';
import { ZQueryParams } from '@prepexcellence/shared-validators';

interface CourseFilters {
  category?: string;
  level?: string;
  isPublished?: boolean;
}

function useCourses(page = 1, limit = 10, filters?: CourseFilters, search?: string) {
  return useQuery({
    queryKey: ['courses', page, limit, filters, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: 'createdAt',
        orderBy: 'desc',
      });

      if (search) {
        params.set('search', search);
      }

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.set(`filters[${key}]`, value.toString());
          }
        });
      }

      const response = await fetch(`/api/lms/courses?${params}`);
      return response.json();
    },
  });
}

// Usage
function CoursesPage() {
  const { data, isLoading } = useCourses(1, 20, {
    category: 'PROGRAMMING',
    isPublished: true
  }, 'JavaScript');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Courses</h1>
      {data.data.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
      <Pagination {...data.pagination} />
    </div>
  );
}
```

## Cache Key Patterns

For debugging or manual cache invalidation:

| Resource | Pattern |
|----------|---------|
| LMS Courses | `courses:*` |
| LMS Modules | `modules:{courseId}:*` |
| LMS Lessons | `lessons:{moduleId}:*` |
| LMS Quiz Attempts | `quiz-attempts:{quizId}:*` |
| LMS Enrollments | `enrollments:{studentId}:*` |
| LMS Discussions | `discussions:{lessonId}:*` |
| Coaching Courses | `coaching-courses:*` |
| Student Sessions | `student-sessions:{studentId}:*` |
| Teacher Sessions | `teacher-sessions:{teacherId}:*` |
| Teachers Search | `teachers:*` |
| Payments | `payments:*` |

## Allowed Filters by Endpoint

| Endpoint | Allowed Filters |
|----------|----------------|
| LMS Courses | `category`, `level`, `instructorId`, `isPublished` |
| LMS Modules | None (can be extended) |
| LMS Lessons | `contentType`, `videoStatus` |
| Quiz Attempts | `enrollmentId`, `isPassed` |
| Enrollments | `status` |
| Discussions | None |
| Coaching Courses | `category`, `level`, `isPublished` |
| Student Sessions | `status` |
| Teacher Sessions | `status` |
| Payments | `studentId`, `status`, `provider`, `startDate`, `endDate` |

## Common Filter Values

### Course Category
- `PROGRAMMING`
- `TEST_PREP`
- `MATH`
- etc.

### Course Level
- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`

### Enrollment Status
- `ACTIVE`
- `COMPLETED`
- `EXPIRED`
- `CANCELLED`

### Session Status
- `SCHEDULED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

### Payment Status
- `PENDING`
- `COMPLETED`
- `FAILED`
- `REFUNDED`

### Payment Provider
- `STRIPE`
- `PAYPAL`

## Tips

1. **Always specify page and limit** for predictable pagination
2. **Use filters over search** when you know the exact field
3. **Combine search with filters** for refined results
4. **Cache is your friend** - identical queries return cached results
5. **Monitor hasNext/hasPrev** for pagination UI
6. **Use sortBy wisely** - default is `createdAt`, but you can sort by any field
