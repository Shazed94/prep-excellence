"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, GripVertical, Pencil, Trash2 } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BaseItem } from "./lib-data/types";

interface DataTableProps<T extends BaseItem> {
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  columns?: ColumnDef<T>[];
}

export function DataTable<T extends BaseItem>({
  data,
  onEdit,
  onDelete,
  onReorder,
  columns: additionalColumns,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const draggedIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    draggedIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const startIndex = draggedIndexRef.current;
    if (startIndex !== null && startIndex !== dropIndex) {
      onReorder(startIndex, dropIndex);
    }
    draggedIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    draggedIndexRef.current = null;
    setDragOverIndex(null);
  };

  const baseColumns: ColumnDef<T>[] = [
    {
      id: "drag",
      size: 40,
      header: () => null,
      cell: () => (
        <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-all duration-200 group-hover:scale-110">
          <GripVertical className="h-5 w-5" />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent font-bold text-foreground/90 hover:text-foreground transition-colors"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            {row.getValue("name")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm line-clamp-2">
          {(row.original as { description?: string }).description || (
            <span className="italic opacity-50">No description</span>
          )}
        </span>
      ),
    },
  ];

  const actionColumn: ColumnDef<T> = {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row.original);
          }}
          className="h-9 w-9 hover:bg-primary-dark/10 hover:text-primary-dark hover:scale-110 transition-all duration-200 rounded-lg"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row.original);
          }}
          className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive hover:scale-110 transition-all duration-200 rounded-lg"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    ),
  };

  const allColumns = additionalColumns
    ? [...baseColumns, ...additionalColumns, actionColumn]
    : [...baseColumns, actionColumn];

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className="rounded-sm border border-border/50 bg-card overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-gradient-to-r from-muted/10 via-muted/10 to-muted/10 hover:bg-muted/10 border-b-2 border-border/50"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs uppercase tracking-wider text-muted-foreground font-bold py-2"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, idx) => (
              <TableRow
                key={row.id}
                draggable
                onDragStart={() => handleDragStart(row.index)}
                onDragOver={(e) => handleDragOver(e, row.index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, row.index)}
                onDragEnd={handleDragEnd}
                className={`
                  transition-all duration-200 cursor-grab active:cursor-grabbing
                  ${
                    dragOverIndex === row.index
                      ? "bg-primary-dark/10 border-t-2 border-primary-dark shadow-lg scale-[1.02]"
                      : ""
                  }
                  hover:bg-muted/10 hover:shadow-md
                  ${idx % 2 === 0 ? "bg-background/50" : "bg-background/30"}
                  group
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-2 transition-all duration-200"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={allColumns.length}
                className="h-64 text-center"
              >
                <div className="flex flex-col items-center gap-4 text-muted-foreground animate-in fade-in-50 duration-700">
                  <div className="h-20 w-20 rounded-sm bg-gradient-to-br from-muted to-muted/10 flex items-center justify-center shadow-inner">
                    <span className="text-4xl">📋</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-foreground/80">
                      No items yet
                    </p>
                    <p className="text-sm">
                      Create your first item to get started
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
