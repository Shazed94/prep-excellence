import {
  Asterisk,
  BookOpenCheck,
  ChartPie,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import { Subtitle } from "../../SectionSubtitle";

const features = [
  {
    id: 1,
    icon: Asterisk,
    title: "Structured system",
    description: "Clear weekly goals keep students on track from day one.",
  },
  {
    id: 2,
    icon: Users,
    title: "Small group instruction",
    description:
      "Focused attention in every session so no student is left behind.",
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Expert Instructors",
    description:
      "We have expert instructors dedicated to every student success.",
  },
  {
    id: 4,
    icon: BookOpenCheck,
    title: "Strategy-focused teaching",
    description:
      "Proven techniques and methods — not random practice or guesswork.",
  },
  {
    id: 5,
    icon: ChartPie,
    title: "Progress Tracking",
    description:
      "Consistent feedback so parents and students see real improvement.",
  },
  {
    id: 6,
    icon: UserRound,
    title: "1:1 Consultation",
    description:
      "Prep Excellence provides one-to-one support or consultation to any students or parents.",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={scaleIn}
      className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <h4 className="h4 mb-[0.5px]">{title}</h4>
        <p className="font-inter text-[14px] leading-[20px] -tracking-[0.4px] text-[#6C7179] ">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function WhyPrepExcellenceTwo() {
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
          <h2 className="h2">Why Prep Excellence</h2>
          <Subtitle className="max-w-[620px] mx-auto ">
            Students follow a clear system that builds skills, strategy, and
            confidence week by week.
          </Subtitle>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
