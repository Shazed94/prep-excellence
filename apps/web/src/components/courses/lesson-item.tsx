import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Zod validation schema
const lessonFormSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  description: z.string().optional().default(""),
  orderIndex: z.number().int().min(0, "Order index must be 0 or greater"),
  content: z.string().optional().default(""),
  contentType: z.enum([
    "VIDEO_RECORDED",
    "VIDEO_LIVE",
    "VIDEO_SCHEDULED",
    "QUIZ",
    "ASSIGNMENT",
    "TEST",
    "READING_MATERIAL",
    "DISCUSSION",
  ]),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

export interface LocalLesson {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  contentType:
    | "VIDEO_RECORDED"
    | "VIDEO_LIVE"
    | "VIDEO_SCHEDULED"
    | "QUIZ"
    | "ASSIGNMENT"
    | "TEST"
    | "READING_MATERIAL"
    | "DISCUSSION";
  content?: string;
  attachments: string[];
  moduleId: string;
}

interface LessonItemProps {
  lesson: LocalLesson;
  lessonNumber: number;
  totalLessons: number;
  isLiveCourseModule?: boolean;
  handleDeleteLesson: (id: string) => Promise<void>;
  handleUpdateLesson: (
    id: string,
    field: keyof Omit<LocalLesson, "id" | "moduleId">,
    value: any,
  ) => Promise<void>;
  handleSaveLesson: (lessonId: string) => Promise<void>;
  handleAddAttachment: (lessonId: string, filename: string) => void;
  handleRemoveAttachment: (lessonId: string, index: number) => void;
  handleMoveLessonUp: (lessonId: string, moduleId: string) => void;
  handleMoveLessonDown: (lessonId: string, moduleId: string) => void;
  handleContentTypeChange: (lessonId: string, value: string) => void;
  courseTitle?: string;
  moduleTitle?: string;
  createLessonMutation: any;
  updateLessonMutation: any;
}

export function LessonItem({
  lesson,
  lessonNumber,
  totalLessons,
  isLiveCourseModule,
  handleDeleteLesson,
  handleUpdateLesson,
  handleSaveLesson,
  handleAddAttachment,
  handleRemoveAttachment,
  handleMoveLessonUp,
  handleMoveLessonDown,
  handleContentTypeChange,
  courseTitle,
  moduleTitle,
  createLessonMutation,
  updateLessonMutation,
}: LessonItemProps) {
  const navigate = useNavigate();

  // Initialize form with React Hook Form and Zod
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: lesson.title,
      description: lesson.description || "",
      orderIndex: lesson.orderIndex,
      content: lesson.content || "",
      contentType: lesson.contentType,
    },
  });

  // Sync form when lesson prop changes
  useEffect(() => {
    form.reset({
      title: lesson.title,
      description: lesson.description || "",
      orderIndex: lesson.orderIndex,
      content: lesson.content || "",
      contentType: lesson.contentType,
    });
  }, [lesson, form]);

  // Watch contentType changes to update parent
  const contentType = form.watch("contentType");
  useEffect(() => {
    if (contentType !== lesson.contentType) {
      handleContentTypeChange(lesson.id, contentType);
    }
  }, [contentType, lesson.contentType, lesson.id, handleContentTypeChange]);

  // Save form data
  const onSubmit = async (values: LessonFormValues) => {
    try {
      // Update each field that changed
      if (values.title !== lesson.title) {
        await handleUpdateLesson(lesson.id, "title", values.title);
      }
      if (values.description !== (lesson.description || "")) {
        await handleUpdateLesson(lesson.id, "description", values.description);
      }
      if (values.orderIndex !== lesson.orderIndex) {
        await handleUpdateLesson(lesson.id, "orderIndex", values.orderIndex);
      }
      if (values.content !== (lesson.content || "")) {
        await handleUpdateLesson(lesson.id, "content", values.content);
      }

      // Call the save handler (will create if temp ID, update if real ID)
      await handleSaveLesson(lesson.id);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save lesson:", error);
    }
  };

  // Navigate to quiz creation/management
  const handleNavigateToQuiz = () => {
    const isTempId = lesson.id.startsWith("temp-");

    if (isTempId || form.formState.isDirty) {
      alert("Please save the lesson before managing the quiz.");
      return;
    }

    navigate({
      to: "/dashboard/instructor-portal/create-quiz",
      search: {
        moduleId: lesson.moduleId,
        lessonId: lesson.id,
        courseTitle: courseTitle || undefined,
        moduleTitle: moduleTitle || undefined,
        lessonTitle: form.getValues("title") || undefined,
      },
    });
  };

  const isVideo = contentType === "VIDEO_RECORDED";
  const isReading = contentType === "READING_MATERIAL";
  const isAssignment = contentType === "ASSIGNMENT";
  const isQuiz = contentType === "QUIZ";
  const isSaving =
    createLessonMutation.isPending || updateLessonMutation.isPending;

  return (
    <Draggable draggableId={lesson.id} index={lesson.orderIndex}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-white rounded-lg border border-slate-300 p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div
              {...provided.dragHandleProps}
              className="cursor-move text-slate-400 hover:text-slate-600 mt-1"
            >
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-slate-900">
                  Lesson {lessonNumber}:{" "}
                  {form.watch("title") || "Untitled Lesson"}
                </h5>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleMoveLessonUp(lesson.id, lesson.moduleId)
                    }
                    disabled={lessonNumber === 1}
                    title="Move lesson up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleMoveLessonDown(lesson.id, lesson.moduleId)
                    }
                    disabled={lessonNumber === totalLessons}
                    title="Move lesson down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    title="Delete lesson"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Main Fields Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Lesson Title *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Introduction to Components"
                              className="bg-green-50 border-green-200 focus:border-green-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!isLiveCourseModule && (
                      <FormField
                        control={form.control}
                        name="contentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">
                              Content Type *
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="h-10">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="VIDEO_RECORDED">
                                    Video
                                  </SelectItem>
                                  <SelectItem value="READING_MATERIAL">
                                    Reading Material
                                  </SelectItem>
                                  <SelectItem value="ASSIGNMENT">
                                    Assignment
                                  </SelectItem>
                                  <SelectItem value="QUIZ">Quiz</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="orderIndex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Order Index
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              className="bg-green-50 border-green-200 focus:border-green-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isVideo && (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Duration (minutes)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled
                            placeholder="Tracked with video"
                            className="bg-slate-100"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  </div>

                  {/* Attachments and Video */}
                  {!isLiveCourseModule && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Attachments (PDF)
                        </FormLabel>
                        <FormControl>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleAddAttachment(lesson.id, file.name);
                                e.target.value = "";
                              }
                            }}
                            className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                          />
                        </FormControl>
                      </FormItem>

                      {isVideo && (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Lesson Video
                          </FormLabel>
                          <FormControl>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleAddAttachment(lesson.id, file.name);
                                  e.target.value = "";
                                }
                              }}
                              className="block w-full text-sm text-slate-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-green-50 file:text-green-700
                              hover:file:bg-green-100"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    </div>
                  )}

                  {/* Display uploaded attachments */}
                  {lesson.attachments.length > 0 && (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Uploaded Files
                      </FormLabel>
                      <div className="space-y-1">
                        {lesson.attachments.map((file: string, i: number) => (
                          <div
                            key={i}
                            className="flex justify-between items-center bg-slate-100 px-3 py-2 rounded text-sm"
                          >
                            <span className="text-xs truncate">{file}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveAttachment(lesson.id, i)
                              }
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            {...field}
                            placeholder="Add lesson description..."
                            className="bg-green-50 border-green-200 focus:border-green-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content Editor for Reading & Assignment */}
                  {(isReading || isAssignment) && !isLiveCourseModule && (
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Content
                          </FormLabel>
                          <FormControl>
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                              height="180px"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Save Lesson Button */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!form.formState.isDirty || isSaving}
                      className="flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Lesson
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Quiz Management */}
                  {isQuiz && (
                    <div className="p-4 border rounded-lg bg-amber-50 border-amber-200 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-amber-900">
                          Quiz Assessment
                        </h4>
                        <p className="text-xs text-amber-700 mt-1">
                          {form.formState.isDirty ||
                          lesson.id.startsWith("temp-")
                            ? "Save the lesson first to manage quiz questions"
                            : "Add or manage quiz questions for this lesson"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleNavigateToQuiz}
                        disabled={
                          form.formState.isDirty ||
                          lesson.id.startsWith("temp-")
                        }
                        className="whitespace-nowrap"
                      >
                        Manage Quiz
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
