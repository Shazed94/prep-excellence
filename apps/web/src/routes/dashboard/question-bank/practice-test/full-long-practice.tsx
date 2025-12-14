import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/question-bank/practice-test/full-long-practice',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/dashboard/question-bank/practice-test/full-long-practice"!
    </div>
  )
}
