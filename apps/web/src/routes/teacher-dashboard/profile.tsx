/**
 * Teacher Dashboard – My Profile
 * Route: /teacher-dashboard/profile
 *
 * Edit public-facing teacher profile: bio, hourly rate, timezone, intro video,
 * availability toggle, specializations.
 */

import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Globe,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  Video,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTeacherProfile,
  useGetOwnTeacherProfile,
  useUpdateTeacherProfile,
} from "@/hooks/teacher";
import { getUser } from "@/store/useAuth";

export const Route = createFileRoute("/teacher-dashboard/profile")({
  component: TeacherProfilePage,
});

const TIMEZONES = [
  "Asia/Dhaka",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Dubai",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "SAT Prep",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Economics",
  "History",
];

function TeacherProfilePage() {
  const id = useId();
  const user = getUser();
  const { data, isLoading } = useGetOwnTeacherProfile(user?.id);
  const profile = data?.data;

  const { mutate: create, isPending: creating } = useCreateTeacherProfile();
  const { mutate: update, isPending: updating } = useUpdateTeacherProfile(
    profile?.id,
  );

  const [form, setForm] = useState({
    bio: "",
    onlineHourlyRate: "",
    timezone: "Asia/Dhaka",
    videoUrl: "",
    isAvailable: true,
  });

  const [specializations, setSpecializations] = useState<
    Array<{
      subject: string;
      level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    }>
  >([]);
  const [newSubject, setNewSubject] = useState("Mathematics");
  const [newLevel, setNewLevel] = useState<
    "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  >("INTERMEDIATE");

  useEffect(() => {
    if (profile) {
      setForm({
        bio: profile.bio ?? "",
        onlineHourlyRate: String(profile.onlineHourlyRate ?? ""),
        timezone: profile.timezone ?? "Asia/Dhaka",
        videoUrl: profile.videoUrl ?? "",
        isAvailable: profile.isAvailable ?? true,
      });
      setSpecializations(
        profile.specializations?.map((s) => ({
          subject: s.subject,
          level: s.level,
        })) ?? [],
      );
    }
  }, [profile]);

  const handleSave = () => {
    const basePayload = {
      bio: form.bio,
      onlineHourlyRate: Number(form.onlineHourlyRate),
      timezone: form.timezone,
      videoUrl: form.videoUrl || undefined,
      isAvailable: form.isAvailable,
    };

    if (profile) {
      update({ ...basePayload, specializations });
    } else {
      create({ ...basePayload, specializations });
    }
  };

  const addSpec = () => {
    if (specializations.find((s) => s.subject === newSubject)) return;
    setSpecializations((p) => [...p, { subject: newSubject, level: newLevel }]);
  };

  const removeSpec = (subject: string) => {
    setSpecializations((p) => p.filter((s) => s.subject !== subject));
  };

  const levelColor = (level: string) => {
    const map: Record<string, string> = {
      BEGINNER: "bg-emerald-100 text-emerald-700",
      INTERMEDIATE: "bg-amber-100 text-amber-700",
      ADVANCED: "bg-red-100 text-red-600",
    };
    return map[level] ?? "bg-muted/20 text-muted";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-switzer font-bold">My Profile</h1>
          <p className="text-muted text-sm mt-0.5">
            This is what students see when browsing tutors
          </p>
        </div>
        {profile && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 size={13} />
            Profile active
          </div>
        )}
      </div>

      {/* Profile Card Preview */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 space-y-5">
        {/* Avatar + name preview */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <span className="text-primary font-bold text-xl">
                {(user?.name ?? "T")[0].toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-switzer font-bold">{user?.name}</p>
            <p className="text-xs text-muted">{user?.email}</p>
            {profile && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-medium">
                  {profile.rating.toFixed(1)}
                </span>
                <span className="text-[11px] text-muted">
                  · {profile.totalSessions} sessions
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label htmlFor={`${id}-bio`} className="text-sm font-medium">
            Bio
          </label>
          <Textarea
            id={`${id}-bio`}
            rows={4}
            placeholder="Tell students about your teaching experience, qualifications, and approach…"
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
          />
        </div>

        {/* Hourly Rate + Timezone */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor={`${id}-rate`} className="text-sm font-medium">
              Hourly Rate (৳)
            </label>
            <Input
              id={`${id}-rate`}
              type="number"
              placeholder="e.g. 1500"
              value={form.onlineHourlyRate}
              onChange={(e) =>
                setForm((p) => ({ ...p, onlineHourlyRate: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor={`${id}-tz`}
              className="text-sm font-medium flex items-center gap-1"
            >
              <Globe size={12} /> Timezone
            </label>
            <Select
              value={form.timezone}
              onValueChange={(v) => setForm((p) => ({ ...p, timezone: v }))}
            >
              <SelectTrigger id={`${id}-tz`} className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Intro Video URL */}
        <div className="space-y-1.5">
          <label
            htmlFor={`${id}-video-url`}
            className="text-sm font-medium flex items-center gap-1"
          >
            <Video size={12} /> Intro Video URL
          </label>
          <Input
            id={`${id}-video-url`}
            placeholder="https://… (YouTube, Vimeo, or direct .mp4)"
            value={form.videoUrl}
            onChange={(e) =>
              setForm((p) => ({ ...p, videoUrl: e.target.value }))
            }
          />
          <p className="text-[11px] text-muted">
            An intro video significantly increases booking rates.
          </p>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between rounded-xl bg-muted/5 border border-border/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Available for bookings</p>
            <p className="text-xs text-muted">
              Students can see and book your sessions
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setForm((p) => ({ ...p, isAvailable: !p.isAvailable }))
            }
            className={`relative w-11 h-6 rounded-full transition-colors ${
              form.isAvailable ? "bg-emerald-500" : "bg-muted/40"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                form.isAvailable ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Specializations */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 space-y-4">
        <h2 className="font-switzer font-semibold text-sm">Specializations</h2>
        <p className="text-xs text-muted -mt-2">
          Add subjects and levels you teach — shown as tags on your profile.
        </p>

        {specializations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {specializations.map((s) => (
              <div key={s.subject} className="flex items-center gap-1">
                <Badge
                  className={`border-0 text-[10px] ${levelColor(s.level)}`}
                >
                  {s.subject} ·{" "}
                  {s.level.charAt(0) + s.level.slice(1).toLowerCase()}
                </Badge>
                <button
                  type="button"
                  onClick={() => removeSpec(s.subject)}
                  className="text-muted hover:text-red-500"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <div className="space-y-1.5 flex-1">
            <label
              htmlFor={`${id}-new-subject`}
              className="text-xs font-medium"
            >
              Subject
            </label>
            <Select value={newSubject} onValueChange={setNewSubject}>
              <SelectTrigger id={`${id}-new-subject`} className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex-1">
            <label htmlFor={`${id}-new-level`} className="text-xs font-medium">
              Level
            </label>
            <Select
              value={newLevel}
              onValueChange={(v) =>
                setNewLevel(v as "BEGINNER" | "INTERMEDIATE" | "ADVANCED")
              }
            >
              <SelectTrigger id={`${id}-new-level`} className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs shrink-0"
            onClick={addSpec}
          >
            <Plus size={12} /> Add
          </Button>
        </div>
      </div>

      {/* Save */}
      <Button
        className="bg-primary hover:bg-primary/90 gap-1.5"
        onClick={handleSave}
        disabled={creating || updating || !form.onlineHourlyRate}
      >
        {creating || updating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
        {profile ? "Save Changes" : "Create Profile"}
      </Button>
    </div>
  );
}
