import { Award, BookOpen, CalendarIcon, Clock, Star } from "lucide-react";
import { useState } from "react";
import { SectionTitle } from "../SectionTitle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
// import { Calendar } from "../ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const TeacherDetail = () => {
	const teacherData = {
		id: "1",
		name: "Dr. Alam",
		designation: "Senior Mathematics Instructor",
		image: "...",
		rating: 4.8,
		totalReviews: 127,
		hourlyRate: 50,
		subjects: ["Mathematics", "Physics", "SAT Prep"],
		experience: "10+ years",
		description:
			"Master advanced SAT strategies through a structured, results-driven course...",

		availability: {
			"2025-01-15": ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"],
			"2025-01-16": ["09:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"],
			"2025-01-17": ["10:00 AM", "02:00 PM", "03:00 PM", "05:00 PM"],
		} as Record<string, string[]>,

		education: "Ph.D. in Mathematics Education...",
		languages: ["English", "Bengali", "Hindi"],
	};

	const [selectedDate, _setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
	const [duration, setDuration] = useState<string>("60");

	// Format date key
	const formatDate = (date: Date | undefined) => {
		if (!date) return "";
		return date.toISOString().split("T")[0];
	};

	// Slots for selected date
	const availableSlots = selectedDate
		? teacherData.availability[formatDate(selectedDate)] || []
		: [];

	// Calculate price
	const totalPrice =
		(teacherData.hourlyRate * Number.parseInt(duration, 10)) / 60;

	const handleBooking = () => {
		if (!selectedDate || !selectedTimeSlot) {
			alert("Please select a date and time slot");
			return;
		}
		console.log({
			teacherId: teacherData.id,
			date: formatDate(selectedDate),
			timeSlot: selectedTimeSlot,
			duration: duration,
			totalPrice: totalPrice,
		});
		alert("Booking confirmed! (This is a demo)");
	};

	return (
		<div className=" py-8 md:py-20 container mx-auto px-3 md:px-4">
			<SectionTitle>Teacher Details</SectionTitle>

			<div className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* LEFT COLUMN */}
				<div className="lg:col-span-2 space-y-6">
					{/* PROFILE CARD */}
					<Card>
						<CardHeader>
							<div className="flex flex-col md:flex-row gap-6">
								<Avatar className="h-32 w-32">
									<AvatarImage src={teacherData.image} alt={teacherData.name} />
									<AvatarFallback>{teacherData.name.charAt(0)}</AvatarFallback>
								</Avatar>

								<div className="flex-1">
									<CardTitle className="text-2xl mb-2">
										{teacherData.name}
									</CardTitle>
									<CardDescription className="text-base mb-3">
										{teacherData.designation}
									</CardDescription>

									<div className="flex flex-wrap gap-2 mb-3">
										{teacherData.subjects.map((subject) => (
											<Badge key={subject} variant="secondary">
												{subject}
											</Badge>
										))}
									</div>

									<div className="flex items-center gap-4 flex-wrap">
										<div className="flex items-center gap-1">
											<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
											<span className="font-semibold">
												{teacherData.rating}
											</span>
											<span className="text-muted-foreground text-sm">
												({teacherData.totalReviews} reviews)
											</span>
										</div>

										<Separator orientation="vertical" className="h-5" />

										<div className="flex items-center gap-2 text-sm">
											<Award className="h-4 w-4 text-muted-foreground" />
											<span>{teacherData.experience}</span>
										</div>
									</div>
								</div>

								<div className="text-center md:text-right">
									<div className="text-3xl font-bold text-primary">
										${teacherData.hourlyRate}
									</div>
									<div className="text-sm text-muted-foreground">per hour</div>
								</div>
							</div>
						</CardHeader>
					</Card>

					{/* TABS */}
					<Card>
						<Tabs defaultValue="about" className="w-full">
							<CardHeader>
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="about">About</TabsTrigger>
									<TabsTrigger value="education">Education</TabsTrigger>
									<TabsTrigger value="reviews">Reviews</TabsTrigger>
								</TabsList>
							</CardHeader>

							<CardContent>
								{/* ABOUT */}
								<TabsContent value="about" className="space-y-4">
									<div>
										<h3 className="font-semibold mb-2">About Me</h3>
										<p className="text-muted-foreground leading-relaxed">
											{teacherData.description}
										</p>
									</div>

									<Separator />

									<div>
										<h3 className="font-semibold mb-2">Languages</h3>
										<div className="flex gap-2">
											{teacherData.languages.map((lang) => (
												<Badge key={lang} variant="outline">
													{lang}
												</Badge>
											))}
										</div>
									</div>
								</TabsContent>

								{/* EDUCATION */}
								<TabsContent value="education">
									<div className="space-y-3">
										<div className="flex items-start gap-3">
											<BookOpen className="h-5 w-5 text-primary mt-1" />
											<div>
												<p className="font-medium">Education</p>
												<p className="text-sm text-muted-foreground">
													{teacherData.education}
												</p>
											</div>
										</div>
									</div>
								</TabsContent>

								{/* REVIEWS */}
								<TabsContent value="reviews">
									<div className="space-y-4">
										<div className="text-center">
											<div className="text-4xl font-bold">
												{teacherData.rating}
											</div>
											<div className="flex gap-0.5 mt-1 justify-center">
												{[1, 2, 3, 4, 5].map((star) => (
													<Star
														key={star}
														className="h-4 w-4 fill-yellow-400 text-yellow-400"
													/>
												))}
											</div>
											<div className="text-sm text-muted-foreground mt-1">
												{teacherData.totalReviews} reviews
											</div>
										</div>

										<p className="text-sm text-muted-foreground text-center">
											Review details would be displayed here
										</p>
									</div>
								</TabsContent>
							</CardContent>
						</Tabs>
					</Card>
				</div>

				{/* RIGHT COLUMN — BOOKING */}
				<div className="lg:col-span-1">
					<Card className="sticky top-4">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CalendarIcon className="h-5 w-5" />
								Book a Session
							</CardTitle>
							<CardDescription>Select date, time, and duration</CardDescription>
						</CardHeader>

						<CardContent className="space-y-4">
							{/* DATE PICKER */}
							<div>
								<div className="text-sm font-medium mb-2 block">
									Select Date
								</div>
								{/* <Calendar
									mode="single"
									selected={selectedDate}
									onSelect={setSelectedDate}
									className="rounded-md border"
									disabled={(date) => !!date && date < new Date()}
								/> */}
							</div>

							<Separator />

							{/* DURATION */}
							<div>
								<div className="text-sm font-medium mb-2 block">Duration</div>
								<Select value={duration} onValueChange={setDuration}>
									<SelectTrigger>
										<SelectValue placeholder="Select duration" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="30">30 minutes</SelectItem>
										<SelectItem value="60">1 hour</SelectItem>
										<SelectItem value="90">1.5 hours</SelectItem>
										<SelectItem value="120">2 hours</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* TIME SLOTS */}
							<div>
								<div className="text-sm font-medium mb-2 block">
									Available Time Slots
								</div>

								{availableSlots.length > 0 ? (
									<div className="grid grid-cols-2 gap-2">
										{availableSlots.map((slot) => (
											<Button
												key={slot}
												variant={
													selectedTimeSlot === slot ? "default" : "outline"
												}
												size="sm"
												onClick={() => setSelectedTimeSlot(slot)}
												className="w-full"
											>
												<Clock className="h-3 w-3 mr-1" />
												{slot}
											</Button>
										))}
									</div>
								) : (
									<p className="text-sm text-muted-foreground text-center py-4">
										No slots available for this date
									</p>
								)}
							</div>

							<Separator />

							{/* PRICE SUMMARY */}
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Base Rate</span>
									<span>${teacherData.hourlyRate}/hour</span>
								</div>

								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Duration</span>
									<span>{duration} minutes</span>
								</div>

								<Separator />

								<div className="flex justify-between font-semibold text-lg">
									<span>Total</span>
									<span className="text-primary">${totalPrice.toFixed(2)}</span>
								</div>
							</div>
						</CardContent>

						<CardFooter>
							<Button
								className="w-full"
								size="lg"
								onClick={handleBooking}
								disabled={!selectedDate || !selectedTimeSlot}
							>
								Book Session
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default TeacherDetail;
