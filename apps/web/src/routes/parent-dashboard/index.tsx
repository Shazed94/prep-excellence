import { useAuth } from "@/store/useAuth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/parent-dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  return (
    <h2 className="text-2xl">
      Hello <span className="font-bold">{user?.name}</span>. Welcome to your
      dashboard.
    </h2>
  );
}
