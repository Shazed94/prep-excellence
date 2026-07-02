import { zodResolver } from "@hookform/resolvers/zod";
import {
  type TFreeSeminarEnrollmentForm,
  ZCFreeSeminarEnrollmentForm,
} from "@prepexcellence/shared-validators";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FreeSeminarEnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seminarId: string;
  seminarTitle: string;
  onSubmit: (data: TFreeSeminarEnrollmentForm) => Promise<void>;
  isLoading?: boolean;
}

export function FreeSeminarEnrollmentDialog({
  open,
  onOpenChange,
  seminarId,
  seminarTitle,
  onSubmit,
  isLoading = false,
}: FreeSeminarEnrollmentDialogProps) {
  const form = useForm<TFreeSeminarEnrollmentForm>({
    resolver: zodResolver(ZCFreeSeminarEnrollmentForm),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      address: "",
      seminarId: seminarId,
    },
  });

  const handleSubmit = async (data: TFreeSeminarEnrollmentForm) => {
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch {
      // Error toast is handled by the parent
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header with gradient background */}
        <div className="bg-linear-to-br from-primary/90 to-primary rounded-t-lg px-6 py-8 text-white">
          <DialogHeader className="p-0">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Join Free Seminar
                </DialogTitle>
                <DialogDescription className="text-white/80 mt-1.5 text-sm">
                  Register for "{seminarTitle}"
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Form body */}
        <div className="px-6 py-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          disabled={isLoading}
                          className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                          disabled={isLoading}
                          className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        disabled={isLoading}
                        className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        disabled={isLoading}
                        className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Country & Address row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Country <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="United States"
                          {...field}
                          disabled={isLoading}
                          className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City, State"
                          {...field}
                          disabled={isLoading}
                          className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Hidden seminarId field (handled via defaultValues) */}
              <input type="hidden" name="seminarId" value={seminarId} />

              {/* Submit button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-lg text-base font-semibold gradient text-white transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/30"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin" />
                      Registering...
                    </span>
                  ) : (
                    "Register for Free Seminar"
                  )}
                </Button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  By registering, you agree to our terms and privacy policy
                </p>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
