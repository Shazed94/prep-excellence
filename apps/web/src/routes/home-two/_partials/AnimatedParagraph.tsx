import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home-two/_partials/AnimatedParagraph')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/home-two/_partials/AnimatedParagraph"!</div>
}
