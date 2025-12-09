import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/one-to-one-session/")({
	component: RouteComponent,
});

function RouteComponent() {
  const cardItems=[
    {
      title:"Total Sessions",
      description:"One to One Session",
      number: "1",
    },
    {
      title:"Total Students",
      description:"Total Students ",
      number: "2",
    },
    {
      title:"Total Hours",
      description:"Total Hours",
      number: "3",
    },
    {
      title:"Total Earnings",
      description:"Total Earnings",
      number: "4",
    },
  ]
	return <div className="p-10">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cardItems.map((item) => (
        <Card className="p-5 bg-primary/30" key={item.number}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">{item.number}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
    <div className="py-10">

    <Tabs defaultValue="account" className="w-full">
  <TabsList className="bg-primary gap-x-8 p-5 px-2">
    <TabsTrigger className="bg-primary/30 p-4" value="schedule">Schedule</TabsTrigger>
    <TabsTrigger className="bg-primary/40 p-4" value="upcoming">Upcoming</TabsTrigger>
    <TabsTrigger className="bg-primary/40 p-4" value="bookings">Bookings</TabsTrigger>
    <TabsTrigger className="bg-primary/40 p-4" value="history">History</TabsTrigger>
  </TabsList>
    <Button className="ml-auto">Add Session</Button>
  <Separator/>
  <TabsContent value="schedule">Make changes to your account here.</TabsContent>
  <TabsContent value="upcoming">Change your password here.</TabsContent>
  <TabsContent value="bookings">Change your password here.</TabsContent>
  <TabsContent value="history">Change your password here.</TabsContent>
</Tabs>
    </div>
  </div>;
}
