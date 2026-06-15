import { Link } from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  DollarSign,
  MoveRight,
  Play,
  Timer,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import { Subtitle } from "../../SectionSubtitle";
import { Button } from "../../ui/button";
import { CalenderSVG } from "@/components/SvgComponents";

// corsedata type
type CourseData = {
  id: number;
  title: string;
  description: string;
  price: string;
  oldPrice: string;
  date: string;
  duration: string;
  schedule: string;
  instructor: string;
  seats: number;
  discount: string;
  image: string;
};

const coursesData: CourseData[] = [
  {
    id: 1,
    title: "SAT Comprehensive — Summer 2026",
    description:
      "Full-length preparation covering all SAT sections with weekly mock tests and personalized feedback.",
    price: "$125 USD",
    oldPrice: "$150 USD",
    date: "June 15, 2026",
    duration: "08 weeks",
    schedule: "Mon, Wed, Fri — 6:00 PM",
    instructor: "Sara Mitchel",
    seats: 4,
    discount: "15% Off",
    image: "home/course-1.jpg",
  },
  {
    id: 2,
    title: "SAT Fast Track — August 2026",
    description:
      "Accelerated program focused on high-impact strategies for students with limited prep time.",
    price: "$100 USD",
    oldPrice: "$120 USD",
    date: "August 15, 2026",
    duration: "04 weeks",
    schedule: "Sun, Sat — 6:00 PM",
    instructor: "Karoline",
    seats: 4,
    discount: "15% Off",
    image: "home/course-2.jpg",
  },
  {
    id: 3,
    title: "SAT Weekend Intensive",
    description:
      "Weekend-only classes designed for busy students balancing school and SAT preparation.",
    price: "$70 USD",
    oldPrice: "$120 USD",
    date: "April 15, 2026",
    duration: "06 weeks",
    schedule: "Sun, Sat — 6:00 PM",
    instructor: "Sarah Mitchel",
    seats: 0,
    discount: "15% Off",
    image: "home/course-3.jpg",
  },
];

function CourseCard({ course }: { course: CourseData }) {
  const hasSeats = course.seats > 0;

  return (
    <div className="bg-white p-4 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover rounded-[6px]"
        />
        <span className="absolute top-3 left-3 bg-[#1BA75C] text-white text-xs leading-[18px] -tracking-[0.3px] font-medium px-2.5 py-1 rounded-md">
          {course.discount}
        </span>
        <div className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 rounded-[6px] flex items-center justify-center cursor-pointer shadow-md">
          <Play className="size-5 text-primary" />
        </div>
      </div>

      {/* Body */}
      <div className="py-4  flex flex-col flex-1">
        <h3 className="font-semibold text-[#0d1b2a] text-[20px]  leading-[28px] -tracking-[1px] mb-[5px]">
          {course.title}
        </h3>
        <p className="font-inter text-[14px] text-[#141B34] leading-[20px] -tracking-[0.64px] mb-3">
          {course.description}
        </p>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-[#141B34]">
            <img
              src="/icons/dollar-circle.png"
              alt=""
              className="size-6  shrink-0"
            />
            <span className="text-[#0d1b2a]">{course.price}</span>
            <span className="text-[#A3A3A3] line-through text-xs">
              {course.oldPrice}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#141B34]">
            <CalenderSVG width="24" height="24" />
            <span>{course.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#141B34]">
            <img
              src="/icons/hourglass.png"
              alt=""
              className="size-6  shrink-0"
            />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#141B34]">
            <img
              src="/icons/clock-icon.png"
              alt=""
              className="size-6  shrink-0"
            />
            <span>{course.schedule}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#141B34]">
            <img
              src="/icons/user-circle-icon.png"
              alt=""
              className="size-6  shrink-0"
            />
            <span>{course.instructor}</span>
          </div>
        </div>

        <div
          className={`text-center text-xs font-semibold rounded-md py-2 mb-3 ${
            hasSeats
              ? "bg-primary-light text-primary"
              : "bg-red-50 text-red-500"
          }`}
        >
          {hasSeats ? `0${course.seats} Seats Remaining` : "No Seats Remaining"}
        </div>

        <Button
          variant="gradient"
          disabled={!hasSeats}
          className={`w-full py-3 rounded-[6px] text-[14px] leading-[20px] -tracking-[0.5px] transition-all duration-200 ${
            hasSeats
              ? ""
              : "bg-[#EBEBEB] text-[#A3A3A3] disabled:cursor-not-allowed"
          }`}
        >
          Book Your Seat
        </Button>
      </div>
    </div>
  );
}

export default function UpcomingCoursesSectionTwo() {
  return (
    <section className="bg-[#F8F8F9] py-8 md:py-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <h2 className="h2">Upcoming SAT Courses</h2>
          <Subtitle className="mx-auto max-w-[600px] ">
            Choose a cohort based on your schedule and target exam date. Seats
            are limited to maintain small group quality.
          </Subtitle>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {coursesData.map((course) => (
            <motion.div key={course.id} variants={scaleIn}>
              <CourseCard course={course} />
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
          <Link to="/sat-courses">
            <Button
              variant="outline"
              className="group flex items-center justify-center gap-2 border bg-transparent shadow-xs cursor-pointer text-[#141B34] w-fit h-[44px] mx-auto"
            >
              View More Courses <MoveRight />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
