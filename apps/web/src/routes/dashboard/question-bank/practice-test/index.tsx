import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArchiveX, Eye, Loader2, Pencil, X } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  useCreateSATPracticeTest,
  useGetSATPracticeTests,
  useGetSubjects,
} from "@/hooks/sat-practice";
import { SearchableSelect } from "@/components/ui/searchable-select";

export const Route = createFileRoute("/dashboard/question-bank/practice-test/")(
  {
    component: RouteComponent,
  }
);

// Types
interface TestPractice {
  id: string;
  testName: string;
  subject: string;
  questionCount: number;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt: string;
  status: "Active" | "Draft" | "Archived";
  active?: boolean;
}

function RouteComponent() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch subjects for filter dropdown
  const { data: subjectsRes } = useGetSubjects({ limit: 100 });
  const subjects = subjectsRes?.data || [];

  // Fetch SAT practice tests from API (backend-driven pagination + search + filters)
  const { data: testsRes, isLoading: testsLoading } = useGetSATPracticeTests({
    page,
    limit,
    search,
    filters: {
      ...(subjectFilter && { subjectId: subjectFilter }),
      ...(difficultyFilter && { difficulty: difficultyFilter }),
      ...(statusFilter && { status: statusFilter }),
    },
  });

  const testPracticeData: TestPractice[] = React.useMemo(() => {
    const items = testsRes?.data || [];
    return items.map((item: any) => {
      const sections = item.sections || item.section || [];
      const questionCount = sections.reduce((sAcc: number, section: any) => {
        const modules = section.modules || [];
        return (
          sAcc +
          modules.reduce(
            (mAcc: number, m: any) =>
              mAcc +
              (m.questionsSetOne?.length || 0) +
              (m.questionsSetTwo?.length || 0),
            0
          )
        );
      }, 0);
      const duration = sections.reduce(
        (acc: number, s: any) => acc + (s.duration || 0),
        0
      );
      const difficultyRaw = item.difficulty?.name || item.difficulty;
      const difficulty = difficultyRaw
        ? String(difficultyRaw).charAt(0).toUpperCase() +
          String(difficultyRaw).slice(1).toLowerCase()
        : "Medium";
      const createdAt = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "";
      const status =
        item.status === "PUBLISHED"
          ? "Active"
          : item.status === "ARCHIVED"
          ? "Archived"
          : "Draft";

      return {
        id: item.id,
        testName: item.name || "",
        subject: item.subject?.name || item.subjectId || "",
        questionCount,
        duration,
        difficulty,
        createdAt,
        status,
      } as TestPractice;
    });
  }, [testsRes]);

  // Mutation to update/create practice test (used to change status)
  const updatePractice = useCreateSATPracticeTest();
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  const handleArchive = (id: string) => {
    setTogglingId(id);
    updatePractice.mutate(
      { id, status: "ARCHIVED" },
      {
        onError: () => setTogglingId(null),
        onSettled: () => setTogglingId(null),
      }
    );
  };

  const handleToggleStatus = (id: string, status: string) => {
    setTogglingId(id);
    updatePractice.mutate(
      { id, status },
      {
        onError: () => setTogglingId(null),
        onSettled: () => setTogglingId(null),
      }
    );
  };
  // Test Practice Columns
  const testPracticeColumns: ColumnDef<TestPractice>[] = [
    {
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) => {
        const item = row.original as TestPractice & {
          id: string;
          status: string;
        };
        const checked = item.status === "Active";
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={checked}
              aria-label={`Toggle active ${item.id}`}
              onCheckedChange={(val: boolean) =>
                handleToggleStatus(item.id, val ? "PUBLISHED" : "DRAFT")
              }
              disabled={togglingId !== null && togglingId !== item.id}
            />
            {togglingId === item.id && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "testName",
      header: "Test Name",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate font-medium">
          {row.getValue("testName")}
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => <div>{row.getValue("subject")}</div>,
    },
    {
      accessorKey: "questionCount",
      header: "Questions",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("questionCount")}</div>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration (min)",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("duration")}</div>
      ),
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => {
        const difficulty = row.getValue("difficulty") as string;
        return (
          <Badge
            variant={
              difficulty === "Easy"
                ? "default"
                : difficulty === "Medium"
                ? "secondary"
                : "destructive"
            }
          >
            {difficulty}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "Active"
                ? "default"
                : status === "Draft"
                ? "secondary"
                : "outline"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const test = row.original;

        return (
          <div className="flex justify-end gap-2">
            <Link
              to={
                `/dashboard/question-bank/practice-test/edit-practice/${test.id}` as "/"
              }
            >
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>

            <Link
              to={`/dashboard/question-bank/practice-test/${test.id}` as "/"}
            >
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleArchive(test.id)}
            >
              <ArchiveX className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const testPracticeCreate = () => {
    return (
      <Button
        asChild
        className="bg-primary-dark hover:bg-primary-dark/90 text-white px-4 py-2 rounded-md"
      >
        <Link to="/dashboard/question-bank/practice-test/create-practice">
          Create Practice
        </Link>
      </Button>
    );
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice Tests</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize practice tests and full-length practice exams
          </p>
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-4 mb-6">
          {/* Search and Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="w-full sm:flex-1">
              <Input
                placeholder="Search by test name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset to first page when searching
                }}
              />
            </div>

            {/* Subject Filter */}

            <SearchableSelect
              options={subjects.map((subject: any) => ({
                value: subject.id,
                label: subject.name,
              }))}
              value={subjectFilter}
              onValueChange={(value) => {
                setSubjectFilter(value);
                setPage(1); // Reset page when filter changes
              }}
              placeholder="All Subjects"
              emptyText="No subject found."
              searchPlaceholder="Search subjects..."
              className="w-full sm:w-60"
            />

            {/* Difficulty Filter */}
            <Select
              value={difficultyFilter}
              onValueChange={(val) => {
                setDifficultyFilter(val);
                setPage(1); // Reset page when filter changes
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulty</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1); // Reset page when filter changes
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {(search || subjectFilter || difficultyFilter || statusFilter) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSubjectFilter("");
                  setDifficultyFilter("");
                  setStatusFilter("");
                  setPage(1);
                }}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {(search || subjectFilter || difficultyFilter || statusFilter) && (
            <div className="flex flex-wrap gap-2">
              {search && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  Search: {search}
                  <button
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {subjectFilter && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  Subject:{" "}
                  {subjects.find((s: any) => s.id === subjectFilter)?.name}
                  <button
                    onClick={() => {
                      setSubjectFilter("");
                      setPage(1);
                    }}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {difficultyFilter && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  Difficulty: {difficultyFilter}
                  <button
                    onClick={() => {
                      setDifficultyFilter("");
                      setPage(1);
                    }}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {statusFilter && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  Status:{" "}
                  {statusFilter === "PUBLISHED"
                    ? "Active"
                    : statusFilter === "DRAFT"
                    ? "Draft"
                    : "Archived"}
                  <button
                    onClick={() => {
                      setStatusFilter("");
                      setPage(1);
                    }}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        <DataTable
          data={testPracticeData}
          columns={testPracticeColumns}
          title="Test Practice"
          Component={testPracticeCreate}
          isLoading={testsLoading}
          manualPagination
          pageIndex={page - 1}
          pageCount={testsRes?.meta?.totalPages || 0}
          onPaginationChange={(paginationState) => {
            const state =
              typeof paginationState === "function"
                ? paginationState({ pageIndex: page - 1, pageSize: limit })
                : paginationState;

            const { pageIndex: newPageIndex, pageSize: newPageSize } =
              state as any;

            if (newPageSize !== limit) {
              setLimit(newPageSize);
              setPage(1);
            } else {
              setPage(newPageIndex + 1);
            }
          }}
          hasNext={testsRes?.meta?.hasNext || false}
          hasPrev={testsRes?.meta?.hasPrev || false}
          total={testsRes?.meta?.total || 0}
          pageSize={limit}
        />
      </div>
    </div>
  );
}
