import { createFileRoute, Link } from "@tanstack/react-router";
import CollegeAdmissionHero from "@/components/college-admissions/CollegeAdmissionHero";
import ConsultationService from "@/components/college-admissions/ConsultationService";
import WhyCollegePlanning from "@/components/college-admissions/WhyCollegePlanning";
import FooterTwo from "@/components/FooterTwo";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_frontend/college-admissions")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <CollegeAdmissionHero />
      <WhyCollegePlanning />
      <div className="bg-[#F8F8F9] py-8 md:py-16">
        <div className="container px-4 md:px-0 mx-auto">
          <div className="gradient flex items-center justify-between px-12 py-6 rounded-[12px]">
            <div className="text-left">
              <h3 className="bold_h4 font-semibold! text-white!">
                Get clarity on your college goals, SAT plan, and <br />{" "}
                application strategy before you begin.
              </h3>
            </div>
            <Link to="/contact-us" className="">
              <Button
                variant={"outline"}
                className="h-[48px] bg-white text-[#141B34] w-fit"
              >
                Book a Consultation
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <ConsultationService />
      <FAQSectionTwo />
      <FooterTwo />
    </div>
  );
}
