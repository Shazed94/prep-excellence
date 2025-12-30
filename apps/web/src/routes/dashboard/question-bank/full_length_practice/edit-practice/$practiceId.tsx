import { createFileRoute } from "@tanstack/react-router";
import { SATBuilderPage } from "@/components/admin-sat-tabs/sats-builder-form";

export const Route = createFileRoute(
  "/dashboard/question-bank/full_length_practice/edit-practice/$practiceId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { practiceId } = Route.useParams();
  return (
    <div>
      <SATBuilderPage practiceId={practiceId} />
    </div>
  );
}
