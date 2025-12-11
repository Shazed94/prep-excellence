"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type TCreateCourseSchema,
  ZCreateCourseSchema,
} from "@prepexcellence/shared-validators";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronDownIcon,
  ChevronLeft,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitCourses } from "@/hooks/course-management";

// ---------- Route ----------
export const Route = createFileRoute("/dashboard/course-management/create")({
  component: RouteComponent,
});

// ---------- Component ----------
function RouteComponent() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "details">("basic");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const form = useForm<TCreateCourseSchema>({
    resolver: zodResolver(ZCreateCourseSchema),
    defaultValues: {
      title: "",
      short_description: "",
      long_description: "",
      startDate: undefined,
      durationDays: 0,
      capacity: 30,
      price: 0,
      thumbnail: "",
      category: "",
      level: "BEGINNER",
      tags: [],
      sessions: [
        {
          day: "sunday",
          startTime: "13:00",
          endTime: "14:00",
        },
      ],
    },
  });

  const { control } = form;

  const {
    fields: sessionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "sessions",
  });

  // ---------- Duration / sessions logic ----------
  const durationStr = form.watch("durationDays");
  const duration = durationStr ? Number(durationStr) : NaN;
  const durationValid = !Number.isNaN(duration) && duration > 0;

  // Watch tags to display them reactively
  const tags = form.watch("tags");

  // Can add only if:
  //  - duration is valid
  //  - number of sessions is less than duration
  const canAddSession = durationValid && sessionFields.length < duration;

  // When duration decreases, auto-remove extra sessions
  useEffect(() => {
    if (!durationValid) return;

    if (sessionFields.length > duration) {
      // Remove from the end until sessions.length === duration
      for (let i = sessionFields.length - 1; i >= duration; i--) {
        remove(i);
      }
    }
  }, [durationValid, duration, sessionFields.length, remove]);

  // ---------- Handlers ----------
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setThumbnailPreview(preview);
      form.setValue("thumbnail", preview);
    };
    reader.readAsDataURL(file);
  };

  const coachingCourseMutation = useSubmitCourses();

  const handleSubmit = async (data: TCreateCourseSchema) => {
    coachingCourseMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Course created successfully!");
        form.reset();
      },
      onError: (error) => {
        toast.error(
          error?.message || "An error occurred while submitting the form."
        );
      },
    });
  };

  // ---------- UI ----------
  return (
    <div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Create Course
          </h1>
          <p className="text-slate-600">
            Define the course structure, schedule, and details your students
            will see.
          </p>
        </div>
        <Link
          to="/dashboard/course-management"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-slate-200">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "basic"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Basic Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Details & Schedule
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* TAB 1: Basic Info */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                    Basic Information
                  </h2>
                  <p className="text-slate-600">
                    Enter your course title and basic details.
                  </p>
                </div>

                {/* Course Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-base">
                        Course Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Full Stack Web Development (Beginner to Advanced)"
                          {...field}
                          className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500 text-base"
                        />
                      </FormControl>
                      <FormDescription className="text-slate-500">
                        This will be shown in the course catalog and on the
                        course page.
                      </FormDescription>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Short Description */}
                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-base">
                        Short Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what students will learn, prerequisites, outcomes, and any projects included..."
                          {...field}
                          rows={6}
                          className="py-3 px-4 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500 resize-none text-base"
                        />
                      </FormControl>
                      <FormDescription className="text-slate-500">
                        Use clear language and structure to describe the course
                        content.
                      </FormDescription>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Category, Level & Tags (on Basic tab) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-800 text-base">
                          Category
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Web Development"
                            {...field}
                            className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          Course category for organization.
                        </FormDescription>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-800 text-base">
                          Level
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-base focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-500"
                          >
                            <option value="BEGINNER">Beginner</option>
                            <option value="INTERMEDIATE">Intermediate</option>
                            <option value="ADVANCED">Advanced</option>
                            <option value="EXPERT">Expert</option>
                          </select>
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          Course difficulty level.
                        </FormDescription>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-800 text-base">
                          Tags
                        </FormLabel>
                        <FormControl>
                          <div>
                            {/* Tag Input */}
                            <Input
                              placeholder="Type a tag and press Enter"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const inputValue =
                                    e.currentTarget.value.trim();
                                  if (
                                    inputValue.length > 0 &&
                                    !tags?.includes(inputValue)
                                  ) {
                                    field.onChange([
                                      ...(tags || []),
                                      inputValue,
                                    ]);
                                    e.currentTarget.value = "";
                                  }
                                }
                              }}
                              className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
                            />

                            {/* Tag Display - Only show when tags exist */}
                            {tags && tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                  >
                                    <span>{tag}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedTags = tags.filter(
                                          (_, i) => i !== index
                                        );
                                        field.onChange(updatedTags);
                                      }}
                                      className="text-blue-600 hover:text-blue-800 font-bold ml-1 cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          Type a tag and press Enter to add. Click × to remove.
                        </FormDescription>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Details & Schedule */}
            {activeTab === "details" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                    Details & Schedule
                  </h2>
                  <p className="text-slate-600">
                    Add course description, dates, pricing, and schedule.
                  </p>
                </div>

                {/* Long Description (Jodit) */}
                <FormField
                  control={form.control}
                  name="long_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-base">
                        Long Description
                      </FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          height="400px"
                          minHeight="200px"
                        />
                      </FormControl>

                      <FormDescription className="text-slate-500">
                        Use clear language and structure to describe the course
                        content.
                      </FormDescription>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Duration & date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-slate-800 text-base">
                          Start Date
                        </FormLabel>
                        <FormControl>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between font-normal"
                              >
                                {form.getValues("startDate")
                                  ? form
                                      .getValues("startDate")
                                      .toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              {/* <Calendar
																mode="single"
																selected={field.value}
																onSelect={field.onChange}
																className="rounded-md border shadow-sm"
																captionLayout="dropdown"
															/> */}
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          First day of the course.
                        </FormDescription>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="durationDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-800 text-base">
                          Duration (days)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="e.g., 40"
                            {...field}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? 0 : Number(val));
                            }}
                            value={field.value === 0 ? "" : field.value}
                            className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          Total length of the course (e.g., 40 days).
                        </FormDescription>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-800 text-base">
                          Price
                        </FormLabel>

                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="e.g., 99"
                            value={field.value === 0 ? "" : field.value}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? 0 : Number(val));
                            }}
                            className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
                          />
                        </FormControl>

                        <FormDescription className="text-slate-500">
                          Set 0 for a free course.
                        </FormDescription>

                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Capacity & thumbnail */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-800 text-base">
                          Max Students
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="e.g., 50"
                            {...field}
                            value={field.value === 0 ? "" : field.value}
                            className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={() => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-slate-800 text-base">
                          Course Thumbnail
                        </FormLabel>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4 hover:border-blue-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                          />
                          <label
                            htmlFor="thumbnail-upload"
                            className="cursor-pointer flex items-center gap-3"
                          >
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                              <Upload className="w-6 h-6 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                {thumbnailPreview
                                  ? "Change thumbnail"
                                  : "Upload thumbnail"}
                              </p>
                              <p className="text-sm text-slate-500">
                                PNG, JPG up to 5MB. Recommended ratio 16:9.
                              </p>
                            </div>
                          </label>

                          {thumbnailPreview && (
                            <div className="w-full md:w-56">
                              <img
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                className="w-full h-32 object-cover rounded-lg border border-slate-200"
                              />
                            </div>
                          )}
                        </div>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Weekly Sessions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Weekly Class Schedule
                      </h3>
                      <p className="text-sm text-slate-600">
                        Example: Sunday 1:00 PM - 2:00 PM, Monday 1:00 PM - 2:00
                        PM (every week).
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!canAddSession) return;
                        append({
                          day: "sunday",
                          startTime: "13:00",
                          endTime: "14:00",
                        });
                      }}
                      disabled={!canAddSession}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Day
                    </Button>
                  </div>

                  {/* Helper / warning messages */}
                  {!durationValid && (
                    <p className="text-sm text-slate-500">
                      Please enter a valid course duration (days) before adding
                      weekly sessions.
                    </p>
                  )}

                  {durationValid && sessionFields.length >= duration && (
                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2">
                      ⚠️ You&apos;ve reached the maximum weekly sessions for
                      this course duration ({duration}).
                    </p>
                  )}

                  <div className="space-y-3">
                    {sessionFields.map((session, index) => (
                      <div
                        key={session.id}
                        className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-slate-50 border border-slate-200 rounded-lg p-3"
                      >
                        <FormField
                          control={form.control}
                          name={`sessions.${index}.day`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-slate-800 text-sm">
                                Day of Week
                              </FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                >
                                  <option value="">Select day</option>
                                  <option value="monday">Monday</option>
                                  <option value="tuesday">Tuesday</option>
                                  <option value="wednesday">Wednesday</option>
                                  <option value="thursday">Thursday</option>
                                  <option value="friday">Friday</option>
                                  <option value="saturday">Saturday</option>
                                  <option value="sunday">Sunday</option>
                                </select>
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`sessions.${index}.startTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-800 text-sm">
                                Start Time
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  {...field}
                                  className="h-10 border border-slate-300 rounded-md text-sm"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`sessions.${index}.endTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-800 text-sm">
                                End Time
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  {...field}
                                  className="h-10 border border-slate-300 rounded-md text-sm"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="self-center text-slate-500 hover:text-red-500 md:mt-5"
                          disabled={sessionFields.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <FormMessage className="text-red-500 text-sm">
                    {form.formState.errors.sessions?.message?.toString()}
                  </FormMessage>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col md:flex-row gap-3 justify-between pt-4 border-t border-slate-200">
              {activeTab === "basic" ? (
                <div className="w-full flex justify-end">
                  <Button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 rounded-lg"
                    onClick={() => setActiveTab("details")}
                  >
                    Next
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("basic")}
                    className="h-11 rounded-lg border-2 border-slate-300"
                  >
                    Previous
                  </Button>

                  <Button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 rounded-lg"
                    disabled={coachingCourseMutation.isPending}
                  >
                    {coachingCourseMutation.isPending
                      ? "Creating..."
                      : "Create Course"}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default RouteComponent;
