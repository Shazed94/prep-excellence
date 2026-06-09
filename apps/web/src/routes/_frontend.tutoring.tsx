import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import { Pagination } from "@/components/Pagination";
import { Subtitle } from "@/components/SectionSubtitle";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Package {
  id: string;
  price: number;
  duration?: string;
  sessions?: string;
  description: string;
}

interface TutorProfile {
  id: number;
  name: string;
  title: string;
  bio: string;
  image: string;
  rating: number;
  ratingSource: string;
  availability: string;
  packages: Package[];
}

const TUTORS: TutorProfile[] = Array.from({ length: 21 }, (_, i) => ({
  id: i + 1,
  name: `Dr. Ilia Kolmagorov ${i + 1}`,
  title: "PhD",
  bio: "Ilia is a top 1% SAT scorer; he graduated Magna Cum Laude and has taught university-level subjects for English.",
  image:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=80",
  rating: 4.5,
  ratingSource: "PrepExcellence Rating",
  availability: "Available on Next Week",
  packages: [
    {
      id: "pkg-1",
      price: 0,
      description: "Free Session",
    },
    {
      id: "pkg-2",
      price: 99,
      duration: "4hr",
      sessions: "1 Test",
      description: "4hr Session for 1 Test",
    },
    {
      id: "pkg-3",
      price: 89,
      duration: "8hr",
      sessions: "2 Test",
      description: "8hr Session for 2 Test",
    },
    {
      id: "pkg-4",
      price: 89,
      duration: "8hr",
      sessions: "2 Test",
      description: "8hr Session for 2 Test",
    },
  ],
}));

const PAGE_SIZE = 3;

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50/40 transition-all"
      >
        {selected}
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 min-w-[160px]">
          {options.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => {
                setSelected(opt);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tutor Card ──────────────────────────────────────────────────────────────

export function TutorProfileCard({ tutor }: { tutor: TutorProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white rounded-2xl border p-6  shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-stretch gap-4 h-full">
        {/* Left: Profile Image */}
        <div className="w-[300px] h-[192px] flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={tutor.image}
            alt={tutor.name}
            className="w-full h-full object-cover rounded-sm"
          />
        </div>

        {/* Middle: Bio & Info */}
        <div className="flex-1  py-2 flex flex-col justify-center  bg-white min-w-0">
          <div className="mb-1">
            <h6 className="h6 ">
              {tutor.name},
              <span className="font-semibold ml-1">{tutor.title}</span>
            </h6>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {tutor.bio}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-slate-900">
                {tutor.rating}
              </span>
            </div>
            <span className="text-sm text-slate-600">{tutor.ratingSource}</span>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
            <CheckCircle className="w-4 h-4" />
            {tutor.availability}
          </div>
        </div>

        {/* Middle-Right: Packages */}
        <div className="flex-1 flex-shrink-0 px-6 py-2 flex flex-col justify-center gap-2 rounded-[6px] bg-[#F8F8F9] ">
          <h4 className="text-sm font-bold text-slate-900 mb-2">Packages</h4>
          {tutor.packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-center gap-3 text-sm text-slate-700"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 flex-shrink-0">
                <span className="text-[10px] font-bold text-blue-600">$</span>
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-slate-900">
                  ${pkg.price}
                </span>
                {pkg.duration && (
                  <span className="text-slate-600">/hr for {pkg.duration}</span>
                )}
                {!pkg.duration && pkg.price === 0 && (
                  <span className="text-slate-600"> for Free Session</span>
                )}
                {pkg.sessions && (
                  <span className="text-slate-600"> for {pkg.sessions}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex-shrink-0 px-6 py-2 flex flex-col items-center justify-center gap-4 rounded-[6px] bg-[#EBF3FF]">
          <div className="w-full text-center bg-white p-4 rounded-[6px]">
            <a
              href="/"
              className="block text-sm font-semibold text-[#1552FD] hover:text-blue-700 hover:underline transition-colors"
            >
              View Availability →
            </a>

            <a
              href="/"
              className="block text-sm font-semibold text-[#1552FD] hover:text-blue-700 hover:underline transition-colors"
            >
              View Sample Video →
            </a>
          </div>
          <Button
            type="button"
            variant="gradient"
            className="w-full mt-2 h-[42px]"
          >
            Choose Package
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export const Route = createFileRoute("/_frontend/tutoring")({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = TUTORS.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div>
      <section className="relative overflow-hidden px-4 px-0">
        {/* content */}
        <div className="relative z-10 container mx-auto py-16 flex items-center gap-8 md:gap-32 flex-col lg:flex-row">
          {/* left */}
          <div className="flex-1 min-w-0 space-y-4">
            <Breadcrumb alignment="left">
              Home /{" "}
              <span className="text-primary! font-medium! hover:underline tracking-[0.5px]!">
                Private Tutoring
              </span>
            </Breadcrumb>

            <h2 className="h2 text-5xl! leading-[56px]!">
              1-On-1 Private Tutoring
              <br />
              for students
            </h2>

            <Subtitle alignment="left">
              Private 1-On-1 tutoring, expert instructors, and a clear weekly
              plan that helps students improve scores with confidence.
            </Subtitle>

            {/* avatars + rating */}
            <motion.div
              className="flex flex-col sm:flex-row justify-start items-center gap-1 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AvatarGroup className="w-fit *:data-[slot=avatar]:ring-[2.5px]">
                <Avatar className="size-[30px]">
                  <AvatarImage
                    src="home/avatar-group-1.png"
                    alt="@shadcn"
                    className=""
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar className="size-[30px]">
                  <AvatarImage src="home/avatar-group-2.png" alt="@maxleiter" />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <Avatar className="size-[30px]">
                  <AvatarImage
                    src="home/avatar-group-3.png"
                    alt="@evilrabbit"
                  />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </AvatarGroup>
              <Subtitle className="text-center mb-0! w-fit mx-0">
                4.9 out of 5.00 by 14,000 people worldwide.
              </Subtitle>
            </motion.div>
          </div>

          {/* stats card */}
          <div className="flex-shrink-0  bg-primary rounded-2xl p-8 grid grid-cols-2">
            {[
              {
                label: "Avg. Score Improvement",
                sub: "150+",
                border: "border-b border-r",
              },
              { label: "2000 Reviews", sub: "4.9", border: "border-b" },
              { label: "Students Worldwide", sub: "2000+", border: "border-r" },
              { label: "Expert Instructors", sub: "32+", border: "" },
            ].map(({ label, sub }, i) => (
              <div
                key={i}
                className={`${
                  i < 2 ? "pb-6" : "pt-6"
                } ${i % 2 === 0 ? "pr-6" : "pl-6"}`}
              >
                <p className="f14 text-white! tracking-[0.5px]! flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                  {label}
                </p>
                <div className="h-0.5 bg-white mb-2.5  " />
                <p className="h2 text-white! leading-[48px]! -tracking-[2px]!">
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* bg */}
        <img
          src="/bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 27.07%, rgba(201, 220, 255, 0.2) 60%, rgba(236, 241, 254, 0.2) 83%, rgba(21, 82, 253, 0.3) 100%)",
          }}
        />
      </section>

      <section className="py-16 px-6 md:px-0 bg-white min-h-screen">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="h2">Choose SAT Courses</h2>
            <Subtitle alignment="center">
              Choose a course based on your schedule and exam date
            </Subtitle>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B7B7B]" />
              <input
                type="text"
                placeholder="Search Courses"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 bg-white f14 text-[#7B7B7B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <FilterDropdown
                label="Featured"
                options={["Featured", "Newest", "Oldest", "Popular"]}
              />
              <FilterDropdown
                label="On Sale"
                options={["On Sale", "All", "Discounted"]}
              />
              <FilterDropdown
                label="All Categories"
                options={[
                  "All Categories",
                  "SAT Math",
                  "SAT Reading",
                  "SAT Writing",
                ]}
              />
              <FilterDropdown
                label="Price Range"
                options={[
                  "Price Range",
                  "Under $100",
                  "$100–$150",
                  "Over $150",
                ]}
              />

              {/* Reset */}
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-blue-500" />
              </button>

              {/* Filters */}
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Course list */}
          <div className="flex flex-col gap-4 mb-10">
            {paginated.length > 0 ? (
              paginated.map((tutor) => (
                <TutorProfileCard key={tutor.id} tutor={tutor} />
              ))
            ) : (
              <div className="text-center py-20 text-slate-400 text-sm">
                No courses match your search.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>

      <FAQSectionTwo />
    </div>
  );
}
