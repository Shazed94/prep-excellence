import { zodResolver } from "@hookform/resolvers/zod";
import {
  type TCContactUsSchema,
  ZCContactUsSchema,
} from "@prepexcellence/shared-validators";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePostContactUs } from "@/hooks/content-management";
import { CustomPhoneInput } from "@/utils/CustomPhoneInput";
import FooterTwo from "../FooterTwo";
import FAQSectionTwo from "../homepage/two/FAQSectionTwo";
import { Subtitle } from "../SectionSubtitle";
import { CallSvg, MailSvg, NavigationSvg } from "../SvgComponents";
import { Textarea } from "../ui/textarea";

export default function ContactSection() {
  const postContactUs = usePostContactUs();

  const form = useForm<TCContactUsSchema>({
    resolver: zodResolver(ZCContactUsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      query: "",
    },
  });

  console.log("form", form.formState.errors);

  const onSubmit = (data: TCContactUsSchema) => {
    postContactUs.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message || "Contact form submitted successfully!");
        form.reset();
      },
      onError: (error: any) => {
        toast.error(
          error.message || "Failed to submit form. Please try again.",
        );
      },
    });
  };

  return (
    <>
      <section className="py-10 md:py-16  ">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="h2">Send Us A Message</h2>
            <Subtitle alignment="center">
              If you have any queries, please let us know by completing the form
              to the right
            </Subtitle>
          </motion.div>
          <div className="flex flex-col md:flex-row gap-14">
            <div className="md:w-[45%] flex flex-col items-start gap-6 w-full">
              <div className="bg-primary rounded-[12px] p-6 text-white flex flex-col items-start gap-3 w-full">
                <h3 className="h6_class text-white!">Prep Excellence HQ</h3>
                <p className="flex items-center gap-2 text-[20px] leading-[22px] -tracking-[0.64px] ">
                  <strong>
                    <MailSvg width={"32"} height={"32"} />
                  </strong>{" "}
                  info@prepexcellence.com
                </p>
                <p className="flex items-center gap-2 text-[20px] leading-[22px] -tracking-[0.64px] ">
                  <strong>
                    <CallSvg width={"32"} height={"32"} />
                  </strong>{" "}
                  +1 (214) 503-2254 <br /> or +1 (848) 448-3331
                </p>
                <p className="flex items-center gap-2 text-[20px] leading-[22px] -tracking-[0.64px] ">
                  <strong>
                    <NavigationSvg width={"32"} height={"32"} />
                  </strong>{" "}
                  645 Broad St, Suite 18, Clifton, NJ 07013
                </p>
              </div>

              <div className="bg-[#FAFAFA] rounded-[12px] p-6 flex flex-col items-start gap-3 w-full text-[#141B34]!">
                <h3 className="h6_class text-[#141B34]!">Prep Excellence BD</h3>
                <p className="flex items-center gap-2 text-[20px] leading-[22px] -tracking-[0.64px] ">
                  <strong>
                    <MailSvg width={"32"} height={"32"} />
                  </strong>{" "}
                  info@prepexcellence.com
                </p>
                <p className="flex items-center gap-2 text-[20px] leading-[22px] -tracking-[0.64px] ">
                  <strong>
                    <CallSvg width={"32"} height={"32"} />
                  </strong>{" "}
                  +1 (214) 503-2254 <br /> or +1 (848) 448-3331
                </p>
                <p className="flex items-center gap-2 text-[20px] leading-[22px] -tracking-[0.64px] ">
                  <strong>
                    <NavigationSvg width={"32"} height={"32"} />
                  </strong>{" "}
                  New Eskaton Rd, Dhaka
                </p>
              </div>
            </div>

            <div className="md:w-[55%] ">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="border border-[#EBEBEB] rounded-[12px] p-6 space-y-6"
                >
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1  md:grid-cols-2 gap-6 ">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="f14 font-medium  mb-0.5 block">
                            First Name{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name here"
                              {...field}
                              className="bg-[#F8F8F9] border border-[#EBEBEB] rounded-[6px] h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="f14 font-medium  mb-0.5 block">
                            Last Name{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name here"
                              {...field}
                              className="bg-[#F8F8F9] border border-[#EBEBEB] rounded-[6px]  h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="f14 font-medium  mb-0.5 block">
                            Email <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email address here"
                              {...field}
                              className="bg-[#F8F8F9] border border-[#EBEBEB] rounded-[6px]  h-12 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="f14 font-medium  mb-0.5 block">
                            Phone <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="">
                              <PhoneInput
                                countrySelectProps={{ unicodeFlags: true }}
                                international
                                defaultCountry="US"
                                placeholder="Enter phone number"
                                value={field.value}
                                onChange={field.onChange}
                                inputComponent={CustomPhoneInput}
                                className=""
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Query */}
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="f14 font-medium  mb-0.5 block">
                          Message <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your message"
                            {...field}
                            className="min-h-[120px] bg-[#F8F8F9] border border-[#EBEBEB] rounded-[6px] px-4 py-3 text-[14px] placeholder:text-[#999] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-center md:justify-start">
                    <Button
                      type="submit"
                      variant={"gradient"}
                      className="w-full text-white h-11 px-8 rounded-md text-[15px] font-medium"
                      disabled={postContactUs.isPending}
                    >
                      {postContactUs.isPending
                        ? "Submitting..."
                        : "Send a Message"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      <FAQSectionTwo />

      <FooterTwo />
    </>
  );
}
