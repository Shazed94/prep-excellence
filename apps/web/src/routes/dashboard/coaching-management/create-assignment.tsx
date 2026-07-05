"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  ZCCoachingAssignmentSchema,
  type CoachingAssignmentFormValues,
} from "../../../lib/assignment-schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { useCreateAssignment } from "@/hooks/coaching";

export const Route = createFileRoute(
  "/dashboard/coaching-management/create-assignment"
)({
  component: CreateAssignmentPage,
});

function CreateAssignmentPage() {
  const lessonId = "";

  const form = useForm<CoachingAssignmentFormValues>({
    resolver: zodResolver(ZCCoachingAssignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      instructions: "",
      totalPoints: 100,
      allowLateSubmission: false,
      lateSubmissionPenalty: undefined,
      dueDate: undefined,
    },
  });

  const allowLateSubmission = form.watch("allowLateSubmission");

  const { mutate: createAssignment, isPending } =
    useCreateAssignment(lessonId);

  const onSubmit = (values: CoachingAssignmentFormValues) => {
    createAssignment(values, {
      onSuccess: () => {
        toast.success("Assignment created");
        form.reset();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ??
            "Couldn't create the assignment."
        );
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-6">
      <h1 className="mb-6 text-2xl font-bold">Create Assignment</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Chapter 3 Practice Set"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Assignment description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Instructions */}
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Instructions for students"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />

                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a due date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date <
                        new Date(
                          new Date().setHours(0, 0, 0, 0)
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormDescription>
                  Leave empty if there is no deadline.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total Points */}
          <FormField
            control={form.control}
            name="totalPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Points</FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Allow Late Submission */}
          <FormField
            control={form.control}
            name="allowLateSubmission"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);

                      if (!checked) {
                        form.setValue(
                          "lateSubmissionPenalty",
                          undefined
                        );
                      }
                    }}
                  />
                </FormControl>

                <div>
                  <FormLabel>
                    Allow late submission
                  </FormLabel>

                  <FormDescription>
                    Students may submit after the due
                    date.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {allowLateSubmission && (
            <FormField
              control={form.control}
              name="lateSubmissionPenalty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Late Penalty (%)
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Assignment"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
