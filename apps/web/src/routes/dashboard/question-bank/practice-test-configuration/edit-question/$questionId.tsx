import { useGetQuestionById } from '@/hooks/question-back'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/question-bank/practice-test-configuration/edit-question/$questionId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { questionId } = Route.useParams()

  const { data: questionData, isLoading } = useGetQuestionById(questionId)

  return (
    <div>
      Hello {questionId}
    </div>
  )
}
