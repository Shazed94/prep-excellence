import { DataTable } from "@/components/DataTable";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/data_table/")({
  component: RouteComponent,
});

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
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Student" },
    {
      id: 5,
      name: "Charlie Davis",
      email: "charlie@example.com",
      role: "Student",
    },
    {
      id: 6,
      name: "David Miller",
      email: "david@example.com",
      role: "Student",
    },
    { id: 7, name: "Eve Wilson", email: "eve@example.com", role: "Student" },
    {
      id: 8,
      name: "Frank Taylor",
      email: "frank@example.com",
      role: "Student",
    },
    {
      id: 9,
      name: "Grace Anderson",
      email: "grace@example.com",
      role: "Student",
    },
    { id: 10, name: "Hank Thomas", email: "hank@example.com", role: "Student" },
    {
      id: 11,
      name: "Isabella White",
      email: "isabella@example.com",
      role: "Student",
    },
    { id: 12, name: "Jack Black", email: "jack@example.com", role: "Student" },
    { id: 13, name: "Kate Green", email: "kate@example.com", role: "Student" },
    { id: 14, name: "Liam Brown", email: "liam@example.com", role: "Student" },
    { id: 15, name: "Mia Davis", email: "mia@example.com", role: "Student" },
    { id: 16, name: "Noah Wilson", email: "noah@example.com", role: "Student" },
    {
      id: 17,
      name: "Olivia Taylor",
      email: "olivia@example.com",
      role: "Student",
    },
    {
      id: 18,
      name: "Peter Anderson",
      email: "peter@example.com",
      role: "Student",
    },
    {
      id: 19,
      name: "Quincy Thomas",
      email: "quincy@example.com",
      role: "Student",
    },
    {
      id: 20,
      name: "Rachel White",
      email: "rachel@example.com",
      role: "Student",
    },
    { id: 21, name: "Sam Black", email: "sam@example.com", role: "Student" },
    { id: 22, name: "Tina Green", email: "tina@example.com", role: "Student" },
    {
      id: 23,
      name: "Ursula Brown",
      email: "ursula@example.com",
      role: "Student",
    },
  ];

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
  ];
  const addButton = () => {
    return (
      <button
        type="button"
        className="bg-[#0086c5] hover:bg-[#0086c5]/90 text-white px-4 py-2 rounded-md"
      >
        Add User
      </button>
    );
  };
  return (
    <div>
      <DataTable columns={columns} data={data} title="User Table" searchKey="name"  Component={addButton}   />
    </div>
  );
}
