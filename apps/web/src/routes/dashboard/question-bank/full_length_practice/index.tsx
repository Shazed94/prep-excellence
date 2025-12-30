import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import * as React from "react";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  useCreateSATPracticeTest,
  useGetSATPracticeTests,
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
  const { data: testsRes, isLoading: testsLoading } = useGetSATPracticeTests({
    page: 1,
    limit: 100,
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
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
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
      accessorKey: "attemptedBy",
      header: "Attempted By",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("attemptedBy")} students
        </div>
      ),
    },
    {
      accessorKey: "avgScore",
      header: "Avg Score",
      cell: ({ row }) => (
        <div className="text-center font-semibold text-primary">
          {row.getValue("avgScore")}%
        </div>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link
                  to={
                    `/dashboard/question-bank/full_length_practice/${practice.id}` as "/"
                  }
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={
                    `/dashboard/question-bank/full_length_practice/edit-practice/${practice.id}` as "/"
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Practice
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleArchive(practice.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Archive Practice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <DataTable
          data={fullLengthPracticeData}
          columns={fullLengthPracticeColumns}
          searchKey="practiceName"
          searchPlaceholder="Search by practice name..."
          title="Full Length Practice"
          Component={fullLengthPracticeCreate}
          isLoading={testsLoading}
          
        />
      </div>
    </div>
  );
}
