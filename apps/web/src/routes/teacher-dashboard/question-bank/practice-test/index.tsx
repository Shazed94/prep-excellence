import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArchiveX, Eye, Loader2, Pencil, X } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  useDeleteSATPracticeTest,
  useGetSATPracticeTests,
} from "@/hooks/sat-practice";

export const Route = createFileRoute(
  "/teacher-dashboard/question-bank/practice-test/",
)({
  component: RouteComponent,
});

interface TestPractice {
  id: string;
  testName: string;
  subject: string;
  questionCount: number;
  duration: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  createdAt: string;
  status: "Active" | "Draft" | "Archived";
  active?: boolean;
}

function RouteComponent() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [testToArchive, setTestToArchive] = useState<string | null>(null);
  const deletePractice = useDeleteSATPracticeTest();

  const { data: testsRes, isLoading: testsLoading } = useGetSATPracticeTests({
    page,
    limit,
    search,
    filters: {
      ...(difficultyFilter && { difficulty: difficultyFilter }),
      ...(statusFilter && { status: statusFilter }),
      practiceType: "TEST_PRACTICE",
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
            0,
          )
        );
      }, 0);
      const duration = sections.reduce(
        (acc: number, s: any) => acc + (s.duration || 0),
        0,
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

  const updatePractice = useCreateSATPracticeTest();
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  const handleArchive = (id: string) => {
    setTestToArchive(id);
    setArchiveDialogOpen(true);
  };

  const confirmArchive = () => {
    if (!testToArchive) return;
    setTogglingId(testToArchive);
    deletePractice.mutate(testToArchive, {
      onError: () => setTogglingId(null),
      onSettled: () => {
        setTogglingId(null);
        setArchiveDialogOpen(false);
        setTestToArchive(null);
      },
    });
  };

  const handleToggleStatus = (id: string, status: string) => {
    setTogglingId(id);
    updatePractice.mutate(
      { id, status, practiceType: "TEST_PRACTICE" },
      {
        onError: () => setTogglingId(null),
        onSettled: () => setTogglingId(null),
      },
    );
  };

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
                `/teacher-dashboard/question-bank/practice-test/edit-practice/${test.id}` as "/"
              }
            >
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>

            <Link
              to={
                `/teacher-dashboard/question-bank/practice-test/${test.id}` as "/"
              }
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
        <Link to="/teacher-dashboard/question-bank/practice-test/create-practice">
          Create Practice
        </Link>
      </Button>
    );
  };

  return (
    <div className="space-y-6">
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
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="w-full sm:flex-1">
              <Input
                placeholder="Search by test name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <Select
              value={difficultyFilter}
              onValueChange={(val) => {
                setDifficultyFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            {(search || difficultyFilter || statusFilter) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
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

      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Practice Test?</AlertDialogTitle>
            <AlertDialogDescription>
              This will change the status to "Delete". The test will be deleted
              and can not be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmArchive}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
