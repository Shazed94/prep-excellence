import React from "react";
import { motion } from "motion/react";
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import { InstructorCard } from "../homepage/two/InstructorsSection";
import { Button } from "../ui/button";
import { MoveRight } from "lucide-react";
export default function OurInstructors() {
  type Instructor = {
    id: number;
    name: string;
    rating: string;
    image: string;
  };

  const instructors: Instructor[] = [
    {
      id: 1,
      name: "Elijah Thompson",
      rating: "4.5 Stars",
      image: "home/tutor-1.png",
    },
    {
      id: 2,
      name: "Caleb Odom",
      rating: "4.5 Stars",
      image: "home/tutor-2.png",
    },
    {
      id: 3,
      name: "Julian Hayes",
      rating: "4.5 Stars",
      image: "home/tutor-3.png",
    },
    {
      id: 4,
      name: "Josiah Quinn",
      rating: "4.5 Stars",
      image: "home/tutor-4.png",
    },
  ];
  return (
    <section className="bg-white py-8 md:py-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <h2 className="h2 text-[#0d1b2a] mb-3 ">Meet Our Instructor Team</h2>
          <p className="p">Instructors with proven SAT teaching experience</p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {instructors.map((instructor) => (
            <motion.div key={instructor.id} variants={scaleIn}>
              <InstructorCard {...instructor} />
            </motion.div>
          ))}
        </motion.div>

        {/* View More */}
        <motion.div
          className="flex justify-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          viewport={viewportOnce}
        >
          <Button variant={"outline"} className="h-[44px]">
            View More Instructors
            <MoveRight />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
