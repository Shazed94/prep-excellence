import { Breadcrumb } from "../breadcrumb";
import { Subtitle } from "../SectionSubtitle";

export default function ContactUsBanner() {
  return (
    <section className=" py-8 md:py-16 relative">
      <div className="">
        <Breadcrumb alignment="center">
          Home /{" "}
          <span className="text-primary! font-medium! hover:underline tracking-[0.5px]!">
            Contact
          </span>
        </Breadcrumb>

        <div className="text-center mb-10">
          <h2 className="h2">Contact Us</h2>
          <Subtitle alignment="center" className=" max-w-2xl">
            You can also call (9 AM to 7 PM Eastern) or email us
            info@prepexcellence.com (24/7).
          </Subtitle>
        </div>
      </div>

      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 27.07%, rgba(236, 241, 254, 0.05) 60%, rgba(236, 241, 254, 0.1) 83%, rgba(21, 82, 253, 0.05) 100%)",
        }}
      />
    </section>
  );
}
