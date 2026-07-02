import { DollarSign, MapPin, Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOwnTeacherProfile, useGetTeacherMe } from "@/hooks/teacher";

export function RatesCard() {
  const { data: teacherMe } = useGetTeacherMe();
  const { data: profileRes, isLoading } = useGetOwnTeacherProfile(
    teacherMe?.id,
  );

  const onlineRate = profileRes?.data?.onlineHourlyRate ?? 0;
  const inPersonRate = profileRes?.data?.offlineHourlyRate ?? 0;

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-3 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-28" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <DollarSign className="size-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            Hourly Rates
          </span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Video className="size-3 text-blue-500" />
            <span className="text-muted-foreground">Online</span>
          </div>
          <span className="font-semibold text-foreground">
            ${Number(onlineRate).toFixed(2)}/hr
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3 text-amber-600" />
            <span className="text-muted-foreground">In-Person</span>
          </div>
          <span className="font-semibold text-foreground">
            ${Number(inPersonRate).toFixed(2)}/hr
          </span>
        </div>
      </div>
    </div>
  );
}
