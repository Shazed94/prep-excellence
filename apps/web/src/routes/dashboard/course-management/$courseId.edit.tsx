import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetCourse, useUpdateCourse } from "@/hooks/course-management";
import {
  type TCreateCourseSchema,
  ZCreateCourseSchema,
} from "@prepexcellence/shared-validators";
import {
  ChevronDownIcon,
  ChevronLeft,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute(
  "/dashboard/course-management/$courseId/edit",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: course, isLoading, isError } = useGetCourse(courseId);

  const queryClient = useQueryClient();
  const updateCourseMutation = useUpdateCourse();

  const [open, setOpen] = useState(false);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const form = useForm<TCreateCourseSchema>({
    resolver: zodResolver(ZCreateCourseSchema),
    defaultValues: {
      title: "",
      sortDescription: "",
      longDescription: "",
      startDate: new Date(),
      duration: 0,
      capacity: 30,
      regular_price: 0,
      offer_price: 0,
      thumbnail: "",
      video: "",
      category: "",
      level: "BEGINNER",
      tags: [],
      schedule: [],
    },
  });

  const { control } = form;
  const {
    fields: sessionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "schedule",
  });

  // Populate form when course data loads
  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title ?? "",
        sortDescription: course.sortDescription ?? "",
        longDescription: course.longDescription ?? "",
        startDate: course.startDate ? new Date(course.startDate) : new Date(),
        duration: Number(course.duration) ?? 0,
        capacity: Number(course.capacity ?? 0),
        regular_price: Number(course.regular_price ?? 0),
        offer_price: Number(course.offer_price ?? 0),
        thumbnail: course.thumbnail ?? "",
        video: course.video ?? "",
        category: course.category ?? "",
        level: course.level ?? "BEGINNER",
        tags: course.tags ?? [],
        schedule: course.schedule ?? [],
      });
      setThumbnailPreview(course.thumbnail || null);
      setVideoPreview(course.video || null);
    }
  }, [form, course]);

  // Duration logic similar to create page
  const durationStr = form.watch("duration");
  const duration = durationStr ? Number(durationStr) : NaN;
  const durationValid = !Number.isNaN(duration) && duration > 0;
  const canAddSession = durationValid && sessionFields.length < duration;

  // Watch tags to display them reactively
  const tags = form.watch("tags");

  useEffect(() => {
    if (!durationValid) return;
    if (sessionFields.length > duration) {
      for (let i = sessionFields.length - 1; i >= duration; i--) {
        remove(i);
      }
    }
  }, [durationValid, duration, sessionFields.length, remove]);

  // Update thumbnail handler
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Thumbnail must be less than 5MB");
      return;
    }

    // Store the actual file
    setThumbnailFile(file);

    // Still create preview for UI
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Update video handler
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (500MB)
    if (file.size > 500 * 1024 * 1024) {
      toast.error("Video must be less than 500MB");
      return;
    }

    // Store the actual file
    setVideoFile(file);

    // Still create preview for UI
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (data: TCreateCourseSchema) => {
    // Create FormData
    const formData = new FormData();

    // Append all text fields
    formData.append("title", data.title);
    formData.append("sortDescription", data.sortDescription);
    formData.append("longDescription", data.longDescription);
    formData.append("startDate", data.startDate.toISOString());
    formData.append("duration", data.duration.toString());
    formData.append("capacity", data.capacity.toString());
    formData.append("regular_price", data.regular_price.toString());
    formData.append("offer_price", data.offer_price.toString());
    formData.append("category", data.category);
    formData.append("level", data.level);
    formData.append("tags", JSON.stringify(data.tags));
    formData.append("schedule", JSON.stringify(data.schedule));

    // Append files if they exist
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    if (videoFile) {
      formData.append("video", videoFile);
    }
    updateCourseMutation.mutate(
      { courseId, data: formData },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Course updated successfully!");
          queryClient.invalidateQueries({
            queryKey: ["coaching-courses"],
          });
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to update course");
        },
      },
    );
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError)
    return <div className="p-8 text-red-500">Error loading course.</div>;

  return (
    <div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Edit Course
          </h1>
          <p className="text-slate-600">Update the course information.</p>
        </div>
        <Link
          to="/dashboard/course-management"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </div>

      {/* Form – reuse layout from create page */}
      <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* Basic Info Tab – always show (no tab switching for edit) */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                Basic Information
              </h2>
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Course title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Short Description */}
              <FormField
                control={form.control}
                name="sortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category, Level, Tags – similar to create */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Web Development" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3"
                        >
                          <option value="BEGINNER">Beginner</option>
                          <option value="INTERMEDIATE">Intermediate</option>
                          <option value="ADVANCED">Advanced</option>
                          <option value="EXPERT">Expert</option>
                        </select>
                      </FormControl>
                      <FormMessage />
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
                                const inputValue = e.currentTarget.value.trim();
                                if (
                                  inputValue.length > 0 &&
                                  !tags?.includes(inputValue)
                                ) {
                                  field.onChange([...(tags || []), inputValue]);
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
                                        (_, i) => i !== index,
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

            {/* Details & Schedule – similar to create */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                Details & Schedule
              </h2>
              {/* Long Description */}
              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        height="400px"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Grid for startDate, duration, capacity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => {
                    const dateValue = field.value
                      ? new Date(field.value)
                      : undefined;
                    return (
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
                                {dateValue
                                  ? dateValue.toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={dateValue}
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date);
                                    setOpen(false);
                                  }
                                }}
                                className="rounded-md border shadow-sm"
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormDescription className="text-slate-500">
                          First day of the course.
                        </FormDescription>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="duration"
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
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? 0 : Number(val));
                          }}
                          className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>
              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="regular_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Price</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="offer_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Price</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Media Uploads */}
              <div className="space-y-6">
                {/* Thumbnail Upload */}
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-base">
                        Course Thumbnail
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <label htmlFor="thumbnail-upload">
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                              <div className="flex items-center gap-4">
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
                              </div>
                            </div>
                          </label>
                          <input
                            id="thumbnail-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                          />

                          {thumbnailPreview && (
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-2">
                                Preview:
                              </p>
                              <img
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                className="w-full max-w-xs h-auto object-cover rounded-lg border border-slate-200 shadow-sm"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Video Upload */}
                <FormField
                  control={form.control}
                  name="video"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-base">
                        Course Intro Video
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <label htmlFor="video-upload">
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                  <Upload className="w-6 h-6 text-slate-500" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">
                                    {videoPreview
                                      ? "Change video"
                                      : "Upload video"}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    MP4, WebM up to 500MB. Recommended ratio
                                    16:9.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </label>
                          <input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleVideoUpload}
                          />

                          {videoPreview && (
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-2">
                                Preview:
                              </p>
                              <video
                                src={videoPreview}
                                controls
                                className="w-full max-w-xs h-auto rounded-lg border border-slate-200 shadow-sm bg-slate-900"
                              >
                                <track
                                  kind="captions"
                                  src="/captions/video-en.vtt"
                                  srcLang="en"
                                  label="English"
                                  default
                                />
                              </video>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>
              {/* Weekly Sessions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">
                    Weekly Class Schedule
                  </h3>
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
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Day
                  </Button>
                </div>
                {!durationValid && (
                  <p className="text-sm text-slate-500">
                    Enter a valid duration to add sessions.
                  </p>
                )}
                {durationValid && sessionFields.length >= duration && (
                  <p className="text-sm text-amber-600">
                    Maximum sessions reached for this duration.
                  </p>
                )}
                <div className="space-y-3">
                  {sessionFields.map((session, index) => (
                    <div
                      key={session.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-slate-50 border border-slate-200 rounded-lg p-4"
                    >
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.day`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Day</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="h-10 w-full rounded-md border"
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.startTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.endTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={sessionFields.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FormMessage>
                  {form.formState.errors.schedule?.message?.toString()}
                </FormMessage>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="mr-3"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateCourseMutation.isPending}>
                {updateCourseMutation.isPending
                  ? "Updating..."
                  : "Update Course"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
