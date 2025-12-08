import DataTable from '@/components/data_table'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/data_table/')({
  component: RouteComponent,
})

function RouteComponent() {

  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Student" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Instructor",
    },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Student" },
  ]

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
  ]
  return <div>
    <DataTable columns={columns} data={data} />
  </div>
}
