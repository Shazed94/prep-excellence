import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Loader2, Save } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import {
  useGetStudentProfile,
  useUpdateStudent,
} from "@/hooks/user-management";

export const Route = createFileRoute("/student-dashboard/profile")({
  component: ProfilePage,
});

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

function ProfilePage() {
  const { data: profileData, isLoading } = useGetStudentProfile();
  const student = profileData?.data;
  console.log("student", student);
  const fileRef = useRef<HTMLInputElement>(null);
  const emailId = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { mutate: updateStudent, isPending: saving } = useUpdateStudent();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "", address: "" },
  });

  // Populate form when data arrives
  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name ?? "",
        phone: student.phone ?? "",
        address: student.address ?? "",
      });
    }
  }, [student, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = (values: ProfileForm) => {
    if (!student?.id) return;

    if (avatarFile) {
      const fd = new FormData();
      fd.append("name", values.name);
      if (values.phone) fd.append("phone", values.phone);
      if (values.address) fd.append("address", values.address);
      fd.append("image", avatarFile);
      updateStudent({ id: student.id, data: fd });
    } else {
      updateStudent({ id: student.id, data: values as any });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  const avatarSrc = preview ?? student?.image ?? undefined;
  const initials = (student?.name ?? "S")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-switzer font-bold text-foreground">
          My Profile
        </h1>
        <p className="text-muted text-sm mt-0.5">
          Manage your personal information
        </p>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-lg border border-border/60 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatarSrc} alt={student?.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow hover:bg-primary/80 transition-colors"
            >
              <Camera size={13} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <p className="font-bold text-base">{student?.name}</p>
            <p className="text-sm text-muted">{student?.email}</p>
            <p className="text-xs text-muted mt-0.5">
              Role:{" "}
              <span className="text-primary font-medium">
                {student?.role?.name ?? "Student"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-lg border border-border/60 shadow-sm p-6">
        <h2 className="font-switzer font-semibold text-sm mb-4">
          Personal Information
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your full name"
                      {...field}
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email — read-only */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium text-foreground"
                htmlFor={emailId}
              >
                Email Address
              </label>
              <Input
                id={emailId}
                value={student?.email ?? ""}
                disabled
                className="text-sm bg-muted/10 text-muted"
              />
              <p className="text-[10px] text-muted">Email cannot be changed</p>
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+880 1700 000000"
                      {...field}
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your address"
                      {...field}
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary/90 gap-2 text-sm"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Account info */}
      {/* <div className="bg-white rounded-lg border border-border/60 shadow-sm p-5">
        <h2 className="font-switzer font-semibold text-sm mb-3">
          Account Details
        </h2>
        <div className="space-y-2 text-sm">
          {[
            {
              label: "Member since",
              value: student?.createdAt
                ? new Date(student?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })
                : "—",
            },
            {
              label: "Verification",
              value: student?.isVerified ? "Verified ✓" : "Not verified",
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-1.5 border-b last:border-0"
            >
              <span className="text-muted text-xs">{row.label}</span>
              <span
                className={`text-xs font-medium ${
                  row.label === "Verification" && student?.isVerified
                    ? "text-emerald-600"
                    : "text-foreground"
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
