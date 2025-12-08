import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/one-to-one-session/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div className="py-10 ">{/* <Card></Card> */}</div>;
}
