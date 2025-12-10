
import { TeacherDetail } from '@/components/one-on-one/TeacherDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_frontend/teacher-detail-one-to-one')({
  component: RouteComponent,
})

function RouteComponent() {  const mockTeacher = {
    id: "1",
    name: "Dr. Alam",
    designation: "SAT Preparation Specialist",
    bio: "Master advanced SAT strategies through a structured, results-driven course built to boost confidence, accuracy, and speed. With over 8 years of experience helping students achieve their target scores, I provide personalized coaching tailored to each student's unique learning style and goals.",
    image:
      "https://i.guim.co.uk/img/media/59baecefbc73d3bcf4a47b017453a27f19b55175/331_488_2481_1489/master/2481.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=d201beebc8267e2197eb367488bafd4b",
    rating: 4.8,
    reviews: 127,
    price: 55,
    experience: 8,
    specializations: ["SAT Math", "SAT Reading", "Test Strategy", "Time Management"],
  }

  return <TeacherDetail teacher={mockTeacher} />
}
