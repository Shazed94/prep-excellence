import parse from "html-react-parser";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/breadcrumb";
import { Subtitle } from "@/components/SectionSubtitle";
import { ArrowRightSVG } from "@/components/SvgComponents";
import { useCart } from "@/hooks/useCart";
import type { Course } from "../sat_courses";

export default function CourseBanner({
  data,
  courseId,
}: {
  data: Course | undefined;
  courseId: string;
}) {
  const { addToCart, refetch } = useCart();
  const handleAddToCart = () => {
    const courseData = {
      id: data?.id,
      title: data?.title,
      offer_price: data?.offer_price,
      regular_price: data?.regular_price,
      thumbnail: data?.thumbnail,
    };
    addToCart({ courseId: courseId }, courseData, {
      onSuccess: (res) => {
        toast.success(res.data.message || "Course added to cart");
        refetch();
      },
      // onError: (error) => {
      //   toast.error(error?.message || "Failed to add course to cart");
      // },
    });
  };
  return (
    <section className="relative overflow-hidden px-4 md:px-0 mb-10 md:mb-16">
      {/* content */}
      <div className="relative z-10 container mx-auto py-16 flex items-center gap-8 md:gap-32 flex-col lg:flex-row">
        {/* left */}
        <div className="flex-1 min-w-0 space-y-4">
          <Breadcrumb alignment="left">
            Home / SAT Courses /{" "}
            <span className="text-primary! font-medium! hover:underline tracking-[0.5px]!">
              {data?.title || "SAT Comprehensive Course for Summer 2026"}
            </span>
          </Breadcrumb>

          <h2 className="h2 text-5xl! leading-14!">
            {data?.title || "SAT Comprehensive Course for Summer 2026"}
          </h2>

          <Subtitle alignment="left">
            {parse(data?.sortDescription || "")}
          </Subtitle>
        </div>

        {/* stats card */}

        <div className="shrink-0 rounded-[12px] bg-white border  p-4  w-full max-w-[480px]">
          <div className="bg-[#3B5BFF] rounded-sm p-6">
            {/* Label */}
            <p className="body_lg text-white! mb-4">
              One-time payment • Lifetime access
            </p>

            {/* Price row */}
            <div className="flex items-baseline gap-3 mb-7">
              {
                <span className="text-white text-[32px] font-semibold tracking-[-1px] leading-8">
                  ${data?.offer_price ?? data?.regular_price} USD
                </span>
              }
              {data?.offer_price && (
                <span className="text-[#EBEBEB]! f14 line-through">
                  ${data?.regular_price} USD
                </span>
              )}
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2.5 w-full bg-white! text-primary! rounded-sm py-4 body_lg cursor-pointer border-none font-semibold!"
            >
              Book Your Seat
              <ArrowRightSVG />
            </button>

            {/* Footer note */}
            <p className="text-white! text-center! mt-2.5 body_lg">
              Seats are filling up faster, few seats left.
            </p>
          </div>
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
            "linear-gradient(180deg, #FFFFFF 27.07%, rgba(201,220,255,0.6) 60%, #ECF1FE 85%, rgba(21,82,253,0.35) 100%)",
        }}
      />
    </section>
  );
}
