import { SectionTitle } from "../SectionTitle";
import { Button } from "../ui/button";

export default function UpcomingCourses() {
  return (
    <section className="bg-[#D9E6ED]/40 py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <SectionTitle accentClassName="left-1/2 -translate-x-1/2">
            Upcoming Courses
          </SectionTitle>
          <p className="text-muted text-[17px] max-w-[820px] mx-auto leading-relaxed mb-14">
            Explore our comprehensive catalog of upcoming courses, designed to
            equip you with the most in-demand skills across technology, science,
            and business.
          </p>
        </div>
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button className="bg-[#0086c5] hover:bg-[#0086c5]/90 text-white hover:text-white rounded-md px-6">
            All
          </Button>
          <Button
            variant="outline"
            className="border-[#0086c5]  hover:bg-[#0086c5] text-black hover:text-white rounded-md px-6 bg-transparent"
          >
            Science
          </Button>
          <Button
            variant="outline"
            className="border-[#0086c5]  hover:bg-[#0086c5] text-black hover:text-white rounded-md px-6 bg-transparent"
          >
            Machine Learning
          </Button>
          <Button
            variant="outline"
            className="border-[#0086c5]  hover:bg-[#0086c5] text-black hover:text-white rounded-md px-6 bg-transparent"
          >
            Marketing
          </Button>
          <Button
            variant="outline"
            className="border-[#0086c5]  hover:bg-[#0086c5] text-black hover:text-white rounded-md px-6 bg-transparent"
          >
            Technology
          </Button>
          <Button
            variant="outline"
            className="border-[#0086c5]  hover:bg-[#0086c5] text-black hover:text-white rounded-md px-6 bg-transparent"
          >
            Math
          </Button>
        </div>
        {/* Course Cards Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Previous</title>
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-auto">
                <img
                  src="/home/course-banner.png"
                  alt="SAT Exam 2025"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-[19px] font-semibold text-primary-light mb-2">
                  SAT 1500+ Elite Coaching
                </h3>
                <p className=" mb-7 text-[17px] ">
                  Focused on advanced strategies for top-tier scores. Master the
                  challenges.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-primary-dark font-semibold">
                      Duration:
                    </span>
                    <span className="text-primary-light ml-1">1 month</span>
                  </div>
                  <div>
                    <span className="text-primary-dark font-semibold">
                      Daily:
                    </span>
                    <span className="text-primary-light ml-1">3 Hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-auto">
                <img
                  src="/home/course-banner.png"
                  alt="SAT Exam 2025"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-[19px] font-semibold text-primary-light mb-2">
                  SAT 1500+ Elite Coaching
                </h3>
                <p className=" mb-7 text-[17px] ">
                  Focused on advanced strategies for top-tier scores. Master the
                  challenges.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-primary-dark font-semibold">
                      Duration:
                    </span>
                    <span className="text-primary-light ml-1">1 month</span>
                  </div>
                  <div>
                    <span className="text-primary-dark font-semibold">
                      Daily:
                    </span>
                    <span className="text-primary-light ml-1">3 Hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-auto">
                <img
                  src="/home/course-banner.png"
                  alt="SAT Exam 2025"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-[19px] font-semibold text-primary-light mb-2">
                  SAT 1500+ Elite Coaching
                </h3>
                <p className=" mb-7 text-[17px] ">
                  Focused on advanced strategies for top-tier scores. Master the
                  challenges.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-primary-dark font-semibold">
                      Duration:
                    </span>
                    <span className="text-primary-light ml-1">1 month</span>
                  </div>
                  <div>
                    <span className="text-primary-dark font-semibold">
                      Daily:
                    </span>
                    <span className="text-primary-light ml-1">3 Hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-auto">
                <img
                  src="/home/course-banner.png"
                  alt="SAT Exam 2025"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-[19px] font-semibold text-primary-light mb-2">
                  SAT 1500+ Elite Coaching
                </h3>
                <p className=" mb-7 text-[17px] ">
                  Focused on advanced strategies for top-tier scores. Master the
                  challenges.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-primary-dark font-semibold">
                      Duration:
                    </span>
                    <span className="text-primary-light ml-1">1 month</span>
                  </div>
                  <div>
                    <span className="text-primary-dark font-semibold">
                      Daily:
                    </span>
                    <span className="text-primary-light ml-1">3 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 md:translate-x-6 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Next</title>
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
