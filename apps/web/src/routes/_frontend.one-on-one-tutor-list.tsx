import { FilterCard } from "@/components/one-on-one/FilterCard";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Star, StarIcon } from "lucide-react";

export const Route = createFileRoute("/_frontend/one-on-one-tutor-list")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="py-20 container mx-auto">
      <SectionTitle>One on One Tutor List</SectionTitle>
      <div className="py-10 md:flex w-full gap-5 px-3 md:px-0">
        <div className="md:w-1/4 mb-3 md:mb-0">
          <FilterCard/>
        </div>{" "}
        <div className="flex-1 gap-5">
          <Card className="p-3 pt-0 gap-2">
            <div className="flex md:flex-row flex-col justify-between items-center">
              <div>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-bold text-primary">Dr. Alam</h3>
                  <p className="font-medium text-accent">Designation</p>
                </CardHeader>
                <CardContent>
                  Master advanced SAT strategies through a structured,
                  results-driven course built to boost confidence, accuracy, and
                  speed.
                </CardContent>
                <CardFooter className="font-medium mt-3 pb-3">Instructor Rating: <div className="flex justify-center items-center gap-x-1 pl-3 text-accent"><StarIcon  size={15}/><Star size={15}/><Star size={15}/><Star size={15}/><Star size={15}/></div></CardFooter>
              </div>
              <div className="rounded-lg flex items-center justify-start">
                <img
                  src="https://i.guim.co.uk/img/media/59baecefbc73d3bcf4a47b017453a27f19b55175/331_488_2481_1489/master/2481.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=d201beebc8267e2197eb367488bafd4b"
                  alt="tutor-image"
                  className="max-w-40 rounded-lg mx-auto"
                />
              </div>
              <div className="px-5 mt-3 md:mt-0">
                <Button>Book Now</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
