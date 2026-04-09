import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { MoveRight } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import HeaderTwo from "@/components/HeaderTwo";
import ChooseProgramSection from "@/components/homepage/ChooseProgramSection";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import FreeSeminarsSection from "@/components/homepage/two/Freeseminarssection";
import InstructorsSection from "@/components/homepage/two/InstructorsSection";
import TestimonialCarousel from "@/components/homepage/two/Testimonials";
import UpcomingCoursesSectionTwo from "@/components/homepage/two/UpcomingCoursesTwo";
import WhyPrepExcellence from "@/components/homepage/two/WhyPrepExcellence";
import { Subtitle } from "@/components/SectionSubtitle";
import { HeroHomeSvg } from "@/components/SvgComponents";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  fadeLeft,
  fadeRight,
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";
import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";

export const Route = createFileRoute("/home-two/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openLoginPopup } = useLoginPopupStore();
  return (
    <main>
      <HeaderTwo />
      {/* Hero Section */}
      <section className=" relative pb-20">
        <div className="container mx-auto  px-4 md:px-10 lg:px-16 py-14 md:py-[84px] z-20">
          <motion.h1
            className="text-center h1 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Build stronger SAT scores with{" "}
            <span className="text-[#1552FD]">expert guidance</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Subtitle className="text-center p max-w-xl mx-auto">
              Live SAT courses, expert instructors, and a clear weekly plan that
              helps students improve scores with confidence.{" "}
            </Subtitle>
          </motion.div>
          <motion.div
            className="flex items-center justify-center gap-[14px] h-[50px] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Button variant="gradient" className="h-full">
              Explore SAT Program
            </Button>
            <Button
              onClick={() => {
                if (user?.role === "Student") {
                  navigate({ to: "/sat-practice" });
                } else {
                  if (!user) {
                    openLoginPopup("/sat-practice");
                    return;
                  }
                  toast("You must be a student to access this page", {
                    style: {
                      background: "#fff",
                      position: "relative",
                      zIndex: 9999,
                    },
                  });
                }
              }}
              variant="outline"
              className="h-full"
            >
              Try a Mock Test
            </Button>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <AvatarGroup className="w-fit">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </AvatarGroup>
            <Subtitle className="text-center mb-0 w-fit">
              4.9 out of 5.00 by 14,000 people worldwide.
            </Subtitle>
          </motion.div>
        </div>
        <motion.div
          className="container mx-auto relative w-full z-20"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/leader-bg.png"
            alt=""
            className="w-full h-[620px] rounded-2xl min-h-96 object-cover object-top"
          />
          <div className="absolute top-0 left-0 w-full h-full rounded-2xl">
            {/* floating nav section */}
            <div className="">
              <div className="absolute left-1/2 top-6 -translate-x-1/2 z-30 px-4 sm:px-0 w-full sm:w-[min(80%,1200px)] lg:w-[min(45%,1000px)]">
                <div className="bg-white/60 backdrop-blur-[30px] rounded-[16px] shadow-[0_4px_4px_0_rgb(0,0,0,0.25)] border border-[#EBEBEB] px-3 py-3 ">
                  <nav className="w-full flex items-center justify-between gap-1 md:gap-4">
                    <a
                      href="#home"
                      className="flex items-center rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <span className="w-7 h-7 p-1 rounded-[6px] bg-white text-primary-dark flex items-center justify-center text-xs">
                        <HeroHomeSvg />
                      </span>
                    </a>
                    <a
                      href="#programs"
                      className="flex items-center px-3 py-1 rounded-md text-[11px] sm:text-sm text-[#141B34] hover:bg-gray-100 transition"
                    >
                      <span className="inline">Explore Programs</span>
                    </a>

                    <a
                      href="#seminars"
                      className="flex items-center px-3 py-1 rounded-md text-[11px] sm:text-sm text-[#141B34] hover:bg-gray-100 transition"
                    >
                      <span className="inline">Free Seminars</span>
                    </a>

                    <a
                      href="#live-chat"
                      className="flex items-center px-3 py-1 rounded-md text-[11px] sm:text-sm text-[#141B34] hover:bg-gray-100 transition"
                    >
                      <span className="inline">Live Chat</span>
                    </a>
                    <Button
                      onClick={() =>
                        router.navigate({
                          to: "/test",
                        })
                      }
                      size="sm"
                      className="text-[11px] sm:text-sm px-4 py-2 rounded-[6px] bg-white text-primary"
                    >
                      Free Mock Test
                    </Button>
                  </nav>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 z-30 ">
                <div className="bg-white px-5 py-[18px] rounded-[6px]">
                  <div className="flex justify-between items-center ">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-[6px] bg-white text-primary-dark flex items-center justify-center text-xs">
                        🗓️
                      </span>
                      <div className="flex flex-col text-sm text-gray-700 ml-2">
                        <span>Dr. Kaiser Alam</span>
                        <span className="text-[#6C7179] text-[12px] leading-[18px] -tracking-[0.64]">
                          Founder • Biomedical Engineer • 15+ Years of Teaching
                          Experience
                        </span>
                      </div>
                    </div>
                    <Button variant={"outline"}>
                      About Prep Excellence <MoveRight />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* <img
          src="/bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 27.07%, rgba(201,220,255,0.6) 60%, #ECF1FE 83%, rgba(21,82,253,0.2) 100%)",
          }}
        /> */}
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <h2 className="h2">About Prep Excellence</h2>
            <Subtitle>
              Helping students improve scores with clarity and structure
            </Subtitle>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-cente mb-10">
            {/* Left Content */}
            <motion.div
              className="space-y-8"
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <p className="text-[24px] sm:text-[32px]  text-[#141B34] leading-[32px] sm:leading-[40px] -tracking-[1.5px]">
                Prep Excellence was built to remove confusion from SAT
                preparation. Too many students study without a plan, practice
                randomly, and don't see the results they're capable of.
              </p>

              <p className="text-[24px] sm:text-[32px]  text-[#141B34] leading-[32px] sm:leading-[40px] -tracking-[1.5px]">
                We designed a system where students follow a clear path,
                practice consistently, and improve with confidence. Every week
                has a goal. Every session has a purpose.
              </p>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              className="bg-blue-50 rounded-2xl p-3 sm:p-5  lg:p-[55px] h-full border border-blue-100"
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <motion.div
                className="grid grid-cols-2 gap-10 h-full"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
              >
                {[
                  { label: "Avg. Score Improvement", value: "150+" },
                  { label: "2000 Reviews", value: "4.9" },
                  { label: "Students Worldwide", value: "2000+" },
                  { label: "Expert Instructors", value: "32+" },
                ].map((stat) => (
                  <motion.div key={stat.label} variants={fadeUp}>
                    <div className="text-[#070420] text-[14px] leading-[20px] font-inter -tracking-[-0.5px] mb-6">
                      <span className="inline-block bg-primary size-3 rounded-full me-1.5" />
                      {stat.label}
                    </div>
                    <div className="text-5xl font-bold text-primary">
                      {stat.value}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            className="block mx-auto"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            viewport={viewportOnce}
          >
            <Button
              variant="outline"
              className="group flex items-center justify-center gap-2 w-fit h-[44px] mx-auto"
            >
              Learn More About Us
              <MoveRight />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Courses Section */}
      <UpcomingCoursesSectionTwo />
      {/* why prep excellence */}
      <WhyPrepExcellence />
      {/* Testimonials Section */}
      <TestimonialCarousel />
      {/* Choose Program Section */}
      <ChooseProgramSection />

      {/* Free seminar Section */}
      <FreeSeminarsSection />
      {/* Instructors Section */}
      <InstructorsSection />
      {/* FAQ Section */}
      <FAQSectionTwo />
      <Footer />
    </main>
  );
}
