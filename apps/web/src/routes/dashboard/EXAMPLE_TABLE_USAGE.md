# DataTable with Zustand Store - Usage Guide

This guide shows how to use the DataTable component with the centralized Zustand store for pagination, search, and sorting.

## Benefits

- **No repetitive state declarations** - All table state is managed in one place
- **Consistent behavior** - All tables work the same way
- **Less boilerplate** - Just import and use the store
- **Column-level sorting** - Sort icons appear in each sortable column header
- **No hardcoded sort fields** - sortBy starts as undefined until user clicks a column

## Quick Start

### 1. Import the store

```typescript
import { useTableStore } from "@/store/usePagination";
```

### 2. Use the store in your component

```typescript
function YourComponent() {
  // Get state and actions from the store
  const {
    pagination, // { pageIndex: number, pageSize: number }
    setPagination, // Function to update pagination
    searchTerm, // Current search term
    setSearchTerm, // Function to update search
    sorting, // { sortBy: string | undefined, sortOrder: "asc" | "desc" }
  } = useTableStore();

  // Use the store values in your API call
  const { data, isLoading } = useYourQuery(
    pagination.pageIndex + 1,
    pagination.pageSize,
    searchTerm,
    sorting.sortBy || "id", // ← Fallback to default field if user hasn't clicked any column
    sorting.sortOrder // ← Always "asc" initially, changes when user clicks sort icon
  );

  // Define columns with sortable headers
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "email",
      header: createSortableHeader("Email", "email"), // ← Makes this column sortable
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "name",
      header: createSortableHeader("Name", "name"), // ← Makes this column sortable
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At", // ← Not sortable (no icon will appear)
      cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
    },
  ];

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      // Search props
      searchKey="email"
      searchPlaceholder="Search..."
      searchValue={searchTerm}
      onSearch={setSearchTerm}
      // Pagination props
      manualPagination
      pageIndex={pagination.pageIndex}
      pageCount={data?.pagination?.totalPages}
      onPaginationChange={setPagination}
      hasNext={data?.pagination?.hasNext}
      hasPrev={data?.pagination?.hasPrev}
      total={data?.pagination?.total}
      // Other props
      isLoading={isLoading}
    />
  );
}
```

## Store API Reference

### State Properties

| Property     | Type                                             | Description                   |
| ------------ | ------------------------------------------------ | ----------------------------- |
| `pagination` | `{ pageIndex: number, pageSize: number }`        | Current pagination state      |
| `searchTerm` | `string`                                         | Current search query          |
| `sorting`    | `{ sortBy: string, sortOrder: "asc" \| "desc" }` | Current sorting configuration |

### Actions

| Action            | Parameters                                       | Description                                   |
| ----------------- | ------------------------------------------------ | --------------------------------------------- |
| `setPagination`   | `PaginationState \| ((prev) => PaginationState)` | Update pagination (supports updater function) |
| `setPageIndex`    | `number`                                         | Set page index directly                       |
| `setPageSize`     | `number`                                         | Set page size (resets to page 0)              |
| `setSearchTerm`   | `string`                                         | Set search term (resets pagination)           |
| `setSorting`      | `SortingState \| ((prev) => SortingState)`       | Update sorting state                          |
| `setSortBy`       | `string`                                         | Change sort field (resets to page 0)          |
| `setSortOrder`    | `"asc" \| "desc"`                                | Change sort direction                         |
| `toggleSortOrder` | `void`                                           | Toggle between asc/desc                       |
| `resetTable`      | `void`                                           | Reset all state to defaults                   |

## Column-Level Sorting

Sorting is now handled at the column level using `createSortableHeader`:

```typescript
import { createSortableHeader, DataTable } from "@/components/DataTable";

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "email",
    header: createSortableHeader("Email", "email"), // First param: Display text, Second param: Field name for API
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
];
```

**How it works:**

- Click the sort icon in a column header to sort by that field
- First click: sorts ascending (↑)
- Second click: sorts descending (↓)
- The active column's icon is fully visible; inactive columns have semi-transparent icons
- The Zustand store automatically updates `sorting.sortBy` and `sorting.sortOrder`
- Your API hook receives these values and fetches sorted data

## Complete Example

See `/routes/dashboard/content-management/newsletter.tsx` for a complete working example.

## Resetting State

If you want to reset the table state (e.g., when navigating away):

```typescript
useEffect(() => {
  return () => {
    useTableStore.getState().resetTable();
  };
}, []);
```

## Custom Initial Values

The store initializes with these defaults:

- Page index: 0
- Page size: 10
- Sort by: undefined (no sorting until user clicks a column)
- Sort order: "asc"

You can modify these in `/store/usePagination.ts` if needed.

## Important Notes

1. **sortBy is undefined initially** - Your API call should provide a fallback:

   ```typescript
   useYourQuery(
     page,
     pageSize,
     search,
     sorting.sortBy || "id", // ← Provide a default field
     sorting.sortOrder
   );
   ```

2. **Each column controls its own sorting** - Use `createSortableHeader("Title", "fieldName")` to make a column sortable

3. **Visual feedback** - Active sort column has 100% opacity icon, inactive columns have 50% opacity
