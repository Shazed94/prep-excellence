import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Loader2, Pencil, Trash2, X } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
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

export const Route = createFileRoute(
  "/dashboard/question-bank/full_length_practice/"
)({
  component: RouteComponent,
});

interface FullLengthPractice {
  id: string;
  practiceName: string;
  totalQuestions: number;
  totalDuration: number;
  sections: number;
  attemptedBy: number;
  avgScore: number;
  createdAt: string;
  status: "Published" | "Draft";
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

  const fullLengthPracticeColumns: ColumnDef<FullLengthPractice>[] = [
    {
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) => {
        const item = row.original as FullLengthPractice & {
          id: string;
          status: string;
        };
        const checked = item.status === "Published";
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
      accessorKey: "practiceName",
      header: "Practice Name",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate font-medium">
          {row.getValue("practiceName")}
        </div>
      ),
    },
    {
      accessorKey: "sections",
      header: "Sections",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("sections")}</div>
      ),
    },
    {
      accessorKey: "totalQuestions",
      header: "Total Questions",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("totalQuestions")}</div>
      ),
    },
    {
      accessorKey: "totalDuration",
      header: "Duration (min)",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("totalDuration")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "Published" ? "default" : "secondary"}>
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
        const practice = row.original;

        return (
          <div className="flex justify-center gap-2">
            <Link
              to={
                `/dashboard/question-bank/full_length_practice/${practice.id}` as "/"
              }
            >
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              to={
                `/dashboard/question-bank/full_length_practice/edit-practice/${practice.id}` as "/"
              }
            >
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleArchive(practice.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const fullLengthPracticeData: FullLengthPractice[] = React.useMemo(() => {
    const items = testsRes?.data || [];
    return items.map((item: any) => {
      const sections = item.sections || item.section || [];
      const totalQuestions = sections.reduce((sAcc: number, section: any) => {
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

      const totalDuration = sections.reduce(
        (acc: number, s: any) => acc + (s.duration || 0),
        0
      );

      const attemptedBy = item.attemptedBy || item.attemptsCount || 0;
      const avgScore = item.avgScore || 0;
      const createdAt = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "";
      const status = item.status === "PUBLISHED" ? "Published" : "Draft";

      return {
        id: item.id,
        practiceName: item.name || "",
        totalQuestions,
        totalDuration,
        sections: sections.length,
        attemptedBy,
        avgScore,
        createdAt,
        status,
      } as FullLengthPractice;
    });
  }, [testsRes]);

  const fullLengthPracticeCreate = () => {
    return (
      <Button
        asChild
        className="bg-primary-dark hover:bg-primary-dark/90 text-white px-4 py-2 rounded-md"
      >
        <Link to="/dashboard/question-bank/practice-test/full-length-practice">
          Create Practice
        </Link>
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Full Length Practice
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage full-length practice exams
          </p>
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-4 mb-6">
          {/* Search and Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="w-full sm:flex-1">
              <Input
                placeholder="Search by practice name..."
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
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
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
        </div>

        <DataTable
          data={fullLengthPracticeData}
          columns={fullLengthPracticeColumns}
          title="Full Length Practice"
          Component={fullLengthPracticeCreate}
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
