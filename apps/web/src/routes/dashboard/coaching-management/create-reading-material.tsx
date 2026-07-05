import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, X, Paperclip, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useAddLessonAttachments } from '@/hooks/coaching'

// ---------- Search params (lessonId comes from the URL) ----------

const searchSchema = z.object({
  lessonId: z.string().min(1, 'lessonId is required'),
})

export const Route = createFileRoute(
  '/dashboard/coaching-management/create-reading-material',
)({
  validateSearch: searchSchema,
  component: RouteComponent,
})

// ---------- Validation ----------

const MAX_FILE_SIZE_MB = 25
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

const materialItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(150, 'Title must be under 150 characters'),
  file: z
    .instanceof(File, { message: 'Please choose a file' })
    .refine(
      (f) => f.size <= MAX_FILE_SIZE_BYTES,
      `File must be ${MAX_FILE_SIZE_MB}MB or smaller`,
    ),
})

const formSchema = z.object({
  items: z.array(materialItemSchema).min(1, 'Add at least one reading material'),
})

export type ReadingMaterialFormValues = z.infer<typeof formSchema>
type ReadingMaterialItem = z.infer<typeof materialItemSchema>

// ---------- Helpers ----------

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

const emptyItem: ReadingMaterialItem = { title: '', file: undefined as unknown as File }

// ---------- Component ----------

function RouteComponent() {
  const { lessonId } = Route.useSearch()
  const { mutate, isPending } = useAddLessonAttachments(lessonId)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReadingMaterialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { items: [emptyItem] },
    mode: 'onSubmit',
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const onSubmit = (values: ReadingMaterialFormValues) => {
    mutate(values.items, {
      onSuccess: () => reset({ items: [emptyItem] }),
      // error toast is already handled inside the hook
    })
  }

  return (
    <div className="mx-auto px-4">
      <header className="mb-8">
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Add reading material</h1>
        <p className="mt-1 text-sm text-slate-500">
          Give each file a title, then attach it. Add as many as you need.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {fields.map((field, index) => (
          <ReadingMaterialRow
            key={field.id}
            index={index}
            control={control}
            register={register}
            setValue={setValue}
            error={errors.items?.[index]}
            disabled={isPending}
            onRemove={fields.length > 1 && !isPending ? () => remove(index) : undefined}
          />
        ))}

        {errors.items?.root && (
          <p className="text-xs text-red-600">{errors.items.root.message}</p>
        )}
        {errors.items && !Array.isArray(errors.items) && (
          <p className="text-xs text-red-600">{errors.items.message as string}</p>
        )}

        <button
          type="button"
          onClick={() => append(emptyItem)}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-orange-400 hover:bg-orange-50/50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add more
        </button>

        <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ---------- Row ----------

function ReadingMaterialRow({
  index,
  control,
  register,
  setValue,
  error,
  disabled,
  onRemove,
}: {
  index: number
  control: any
  register: any
  setValue: any
  error?: { title?: { message?: string }; file?: { message?: string } }
  disabled?: boolean
  onRemove?: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const titleId = `title-${index}`
  const fileId = `file-${index}`

  return (
    <div className="flex items-start gap-2">
      <div className="grid flex-1 grid-cols-[60%_40%] gap-3">
        {/* Title */}
        <div>
          <Label htmlFor={titleId} className="mb-1.5 block text-sm font-medium text-slate-700">
            Title
          </Label>
          <Input
            id={titleId}
            type="text"
            placeholder="e.g. Chapter 4 — Photosynthesis notes"
            disabled={disabled}
            {...register(`items.${index}.title` as const)}
            className={error?.title ? 'border-red-400 focus-visible:ring-red-400' : ''}
          />
          {error?.title && <p className="mt-1 text-xs text-red-600">{error.title.message}</p>}
        </div>

        {/* Choose file */}
        <Controller
          control={control}
          name={`items.${index}.file` as const}
          render={({ field }) => (
            <div>
              <Label htmlFor={fileId} className="mb-1.5 block text-sm font-medium text-slate-700">
                File attachment
              </Label>
              <button
                id={fileId}
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  error?.file
                    ? 'border-red-400 text-red-600'
                    : 'border-slate-300 text-slate-600 hover:border-orange-400 hover:bg-orange-50/50 hover:text-orange-600'
                }`}
              >
                <Paperclip className="h-4 w-4 shrink-0" />
                {field.value ? <span className="truncate">{field.value.name}</span> : 'Choose file'}
              </button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setValue(`items.${index}.file`, file, { shouldValidate: true })
                  e.target.value = ''
                }}
              />
              {error?.file && <p className="mt-1 text-xs text-red-600">{error.file.message}</p>}
              {field.value && (
                <p className="mt-1 text-xs text-slate-400">{formatBytes(field.value.size)}</p>
              )}
            </div>
          )}
        />
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove item"
          className="mt-8 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
