import type { TFreeSeminarEnrollmentForm } from "@prepexcellence/shared-validators";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import parse from "html-react-parser";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { FreeSeminarEnrollmentDialog } from "@/components/FreeSeminarEnrollmentDialog";
import { CalenderNewSvg } from "@/components/SvgComponents";
import {
	type FreeSeminar,
	useFreeSeminarEnrolement,
	useGetActiveFreeSeminar,
} from "@/hooks/content-management";
import {
	fadeUp,
	scaleIn,
	staggerContainer,
	viewportOnce,
} from "@/lib/animations";
import { Subtitle } from "../../SectionSubtitle";
import { Button } from "../../ui/button";

function SeminarCard({
	seminar,
	onEnroll,
}: {
	seminar: FreeSeminar;
	onEnroll: (seminar: FreeSeminar) => void;
}) {
	const hasSeatsRemaining = seminar.capacity - seminar._count.enrollments > 0;
	return (
		<div className="bg-white p-3 md:p-6 border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full">
			{/* Image */}
			<div className="h-[385px] overflow-hidden">
				<img
					src={seminar.image}
					alt={seminar.title}
					className="w-full h-full object-cover rounded-[6px]"
				/>
			</div>

			{/* Body */}
			<div className="pt-6 flex flex-col flex-1">
				{/* Date badge */}
				<div className="flex items-center gap-2 bg-[#F8F8F9] border border-gray-200 rounded-[6px] px-2 md:px-4 py-[9px] mb-4 w-fit">
					<CalenderNewSvg className="size-[14px] md:size-[27px]" />
					<span className="p mb-0!">
						{format(new Date(seminar.startDate), "MMMM d")} -{" "}
						{format(new Date(seminar.endDate), "d, yyyy")}
						{" • "}
						{format(new Date(seminar.startDate), "EEEE,")}{" "}
						{format(new Date(seminar.startTime), "hh:mm a")} -{" "}
						{format(new Date(seminar.endTime), "hh:mm a")}
					</span>
				</div>

				{/* Title */}
				<div>
					<h3 className="text-[24px] leading-[32px] -tracking-[1px] font-semibold mb-[6px]">
						{seminar.title}
					</h3>
					<div className="p mb-4!">{parse(seminar.description)}</div>
				</div>

				{/* CTA */}
				<div className="mt-auto pt-2">
					{hasSeatsRemaining ? (
						<Button
							variant={"outline"}
							onClick={() => onEnroll(seminar)}
							className="w-full border border-primary text-primary rounded-[6px] h-[42px] text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
						>
							Join Free Seminar
						</Button>
					) : (
						<button
							type="button"
							disabled
							className="w-full bg-[#EBEBEB] text-[#A3A3A3] rounded-[6px] py-3 text-sm font-semibold cursor-not-allowed"
						>
							No Seats Remaining
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default function FreeSeminarsSection() {
	const { data: seminarsData, isLoading } = useGetActiveFreeSeminar();
	const seminarEnrolementMutation = useFreeSeminarEnrolement();
	const [selectedSeminar, setSelectedSeminar] = useState<FreeSeminar | null>(
		null,
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const queryClient = useQueryClient();
	const handleEnroll = (seminar: FreeSeminar) => {
		setSelectedSeminar(seminar);
		setIsDialogOpen(true);
	};

	const handleEnrollmentSubmit = async (data: TFreeSeminarEnrollmentForm) => {
		try {
			seminarEnrolementMutation.mutate(data, {
				onSuccess: () => {
					toast.success("Successfully registered for the seminar!", {
						description:
							"We'll send you a confirmation email with the seminar details.",
					});
					queryClient.invalidateQueries({
						queryKey: ["free-seminars", "active"],
					});

					setIsDialogOpen(false);
					setSelectedSeminar(null);
				},
				onError: (error: any) => {
					toast.error(
						error?.response?.data?.message ||
							"Registration failed. Please try again.",
					);
				},
			});

			setIsDialogOpen(false);
			setSelectedSeminar(null);
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			toast.error(
				err?.response?.data?.message ||
					"Registration failed. Please try again.",
			);
			throw error; // Re-throw so the dialog can catch it
		}
	};

	return (
		<section className="bg-[#F8F8F9] py-8 md:py-16 px-4">
			<div className="container mx-auto">
				{/* Header */}
				<motion.div
					className="text-center mb-12"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<h2 className="h2">Free Strategic Seminars</h2>
					<Subtitle className="">
						Pick ongoing strategy seminars to know the process first
					</Subtitle>
				</motion.div>

				{/* Loading state */}
				{isLoading && (
					<div className="flex justify-center py-20">
						<Loader2 className="size-10 animate-spin text-primary" />
					</div>
				)}

				{/* Cards */}
				{!isLoading && (
					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 gap-6"
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						{seminarsData?.data?.map((seminar: FreeSeminar) => (
							<motion.div key={seminar.id} variants={scaleIn}>
								<SeminarCard seminar={seminar} onEnroll={handleEnroll} />
							</motion.div>
						))}
					</motion.div>
				)}

				{/* No seminars state */}
				{!isLoading && seminarsData?.data?.length === 0 && (
					<div className="text-center py-20">
						<p className="text-gray-500 text-lg">
							No active seminars available at the moment. Check back soon!
						</p>
					</div>
				)}

				{/* Enrollment Dialog */}
				{selectedSeminar && (
					<FreeSeminarEnrollmentDialog
						open={isDialogOpen}
						onOpenChange={(open) => {
							setIsDialogOpen(open);
							if (!open) setSelectedSeminar(null);
						}}
						seminarId={selectedSeminar.id}
						seminarTitle={selectedSeminar.title}
						onSubmit={handleEnrollmentSubmit}
						isLoading={seminarEnrolementMutation.isPending}
					/>
				)}
			</div>
		</section>
	);
}
