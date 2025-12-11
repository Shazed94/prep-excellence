"use client";

import {
	BookOpen,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	Filter,
	HelpCircle,
	MessageSquare,
	Plus,
	Search,
	Star,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DiscussionBoard() {
	const [activeTab, setActiveTab] = useState("discussion");
	const [sortBy, setSortBy] = useState("recent");
	const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

	const tabs = [
		{ id: "description", label: "Course Description", icon: BookOpen },
		{ id: "discussion", label: "Discussion", icon: MessageSquare },
		{ id: "qa", label: "Q&A", icon: HelpCircle },
		{ id: "reviews", label: "Reviews", icon: Star },
	];

	const courseInfo = {
		title: "Product Management for AI & Data",
		instructor: "Dr. Sarah Johnson",
		enrolled: "2,847 students",
		rating: 4.8,
		reviews: 1247,
		duration: "4h 54m",
		level: "Intermediate",
		lastUpdated: "January 2024",
	};

	const descriptionContent = {
		overview:
			"This comprehensive course bridges the gap between technical AI/data concepts and practical product management. Learn how to lead AI product initiatives, communicate effectively with technical teams, and deliver impactful AI-driven solutions.",
		objectives: [
			"Understand the role of a Product Manager in AI-driven organizations",
			"Master key AI and data technology concepts",
			"Learn to define and measure success for AI products",
			"Develop strategies for stakeholder management",
			"Build and execute AI product roadmaps",
			"Navigate ethical considerations in AI product development",
		],
		requirements: [
			"Basic understanding of software development concepts",
			"Familiarity with business processes",
			"No advanced technical skills required",
			"Open mindset for learning new methodologies",
		],
		targetAudience: [
			"Aspiring AI Product Managers",
			"Traditional PMs transitioning to AI",
			"Technical leads moving into product roles",
			"Entrepreneurs building AI products",
			"Business analysts and data professionals",
		],
	};

	const discussionPosts = [
		{
			id: "1",
			title: "How do you prioritize AI features vs traditional features?",
			author: { name: "Alex Chen", role: "Senior PM", avatar: "AC" },
			content:
				"I'm currently working on a product that has both AI-powered features and traditional functionality. How do you balance the prioritization between developing new AI capabilities versus improving existing traditional features? Our team has limited resources and we're debating whether to invest more in our recommendation engine or improve the core user interface.",
			tags: ["prioritization", "roadmap", "ai-features"],
			likes: 42,
			replies: 18,
			views: 324,
			isResolved: true,
			timestamp: "2 hours ago",
			upvoted: true,
			bookmarked: true,
		},
		{
			id: "2",
			title: "Best practices for measuring AI model performance in production?",
			author: {
				name: "Maria Rodriguez",
				role: "Data Science Lead",
				avatar: "MR",
			},
			content:
				"We've deployed several ML models to production, but I'm struggling to establish comprehensive monitoring. What metrics do you track beyond accuracy? How do you handle concept drift? Are there any tools you recommend for model monitoring?",
			tags: ["monitoring", "metrics", "production"],
			likes: 28,
			replies: 14,
			views: 198,
			isResolved: false,
			timestamp: "5 hours ago",
			upvoted: false,
			bookmarked: true,
		},
		{
			id: "3",
			title:
				"Transitioning from software PM to AI PM - what's the biggest change?",
			author: { name: "James Wilson", role: "Transitioning PM", avatar: "JW" },
			content:
				"I have 5 years of experience as a software product manager and I'm moving into an AI PM role. For those who've made this transition, what was the most significant change in your day-to-day work? How did you bridge the knowledge gap with data scientists?",
			tags: ["career", "transition", "skills"],
			likes: 35,
			replies: 23,
			views: 256,
			isResolved: false,
			timestamp: "1 day ago",
			upvoted: true,
			bookmarked: false,
		},
		{
			id: "4",
			title: "Ethical considerations in AI product development",
			author: {
				name: "Dr. Lisa Park",
				role: "Ethics Researcher",
				avatar: "LP",
			},
			content:
				"As we develop more sophisticated AI products, ethical considerations become increasingly important. What frameworks are you using to ensure ethical AI development? How do you balance innovation with responsible AI practices?",
			tags: ["ethics", "responsible-ai", "governance"],
			likes: 51,
			replies: 32,
			views: 412,
			isResolved: true,
			timestamp: "2 days ago",
			upvoted: true,
			bookmarked: true,
		},
		{
			id: "5",
			title: "How to communicate model limitations to stakeholders?",
			author: { name: "Tom Anderson", role: "AI PM", avatar: "TA" },
			content:
				"I often struggle with setting realistic expectations about what our AI models can and cannot do. Stakeholders sometimes expect perfect accuracy. What strategies have worked for you in communicating limitations while maintaining confidence in the product?",
			tags: ["communication", "stakeholders", "expectations"],
			likes: 29,
			replies: 16,
			views: 187,
			isResolved: false,
			timestamp: "3 days ago",
			upvoted: false,
			bookmarked: false,
		},
	];

	const qaItems = [
		{
			id: "qa1",
			question:
				"What's the difference between machine learning and traditional programming?",
			answer:
				"In traditional programming, you write explicit rules and instructions for the computer to follow. With machine learning, you provide the computer with examples and let it learn the patterns and rules from the data itself.",
			askedBy: { name: "Student123", role: "Beginner" },
			answeredBy: { name: "Instructor", role: "Course Instructor" },
			votes: 45,
			timestamp: "1 week ago",
			isFeatured: true,
		},
		{
			id: "qa2",
			question: "How much coding knowledge is required for this course?",
			answer:
				"While coding knowledge is helpful, it's not required. The course focuses on product management concepts rather than implementation details. We'll cover technical concepts at a high level suitable for PMs.",
			askedBy: { name: "FuturePM", role: "Student" },
			answeredBy: { name: "Teaching Assistant", role: "TA" },
			votes: 32,
			timestamp: "5 days ago",
			isFeatured: false,
		},
		{
			id: "qa3",
			question: "Are there any prerequisites for the course?",
			answer:
				"Basic understanding of software development concepts and business processes is helpful. We provide introductory materials for those new to AI concepts. The course is designed to be accessible to professionals from various backgrounds.",
			askedBy: { name: "NewLearner", role: "Student" },
			answeredBy: { name: "Instructor", role: "Course Instructor" },
			votes: 28,
			timestamp: "3 days ago",
			isFeatured: true,
		},
	];

	const reviews = [
		{
			id: "rev1",
			author: {
				name: "Michael Chen",
				role: "Senior Product Manager",
				avatar: "MC",
			},
			rating: 5,
			title: "Game-changer for AI product management",
			content:
				"This course perfectly bridges the gap between technical AI concepts and practical product management. The case studies were incredibly valuable and the templates provided have already helped me in my work.",
			timestamp: "2 weeks ago",
			helpful: 42,
			comments: 8,
			verified: true,
		},
		{
			id: "rev2",
			author: {
				name: "Sarah Williams",
				role: "Data Science Manager",
				avatar: "SW",
			},
			rating: 4,
			title: "Great content for technical leaders",
			content:
				"As a data science manager transitioning into product, this course provided excellent insights into the PM mindset. The stakeholder management section was particularly valuable. Would love more advanced technical content.",
			timestamp: "1 month ago",
			helpful: 28,
			comments: 3,
			verified: true,
		},
		{
			id: "rev3",
			author: { name: "David Kim", role: "Startup Founder", avatar: "DK" },
			rating: 5,
			title: "Essential for anyone building AI products",
			content:
				"The frameworks and methodologies taught here are practical and immediately applicable. The ethical considerations section opened my eyes to aspects I hadn't considered before.",
			timestamp: "3 weeks ago",
			helpful: 35,
			comments: 5,
			verified: true,
		},
		{
			id: "rev4",
			author: {
				name: "Emma Rodriguez",
				role: "Business Analyst",
				avatar: "ER",
			},
			rating: 4,
			title: "Comprehensive and well-structured",
			content:
				"The course progresses logically from basics to advanced topics. The discussion board is active with helpful peers and instructors. Some sections could use more real-world examples.",
			timestamp: "2 months ago",
			helpful: 19,
			comments: 2,
			verified: true,
		},
	];

	const sortOptions = [
		{ value: "recent", label: "Most Recent" },
		{ value: "popular", label: "Most Popular" },
		{ value: "unanswered", label: "Unanswered" },
		{ value: "resolved", label: "Resolved" },
	];

	const togglePost = (postId: string) => {
		const newExpanded = new Set(expandedPosts);
		if (newExpanded.has(postId)) {
			newExpanded.delete(postId);
		} else {
			newExpanded.add(postId);
		}
		setExpandedPosts(newExpanded);
	};

	const ratingDistribution = [
		{ stars: 5, percentage: 72, count: 897 },
		{ stars: 4, percentage: 18, count: 224 },
		{ stars: 3, percentage: 6, count: 75 },
		{ stars: 2, percentage: 3, count: 37 },
		{ stars: 1, percentage: 1, count: 14 },
	];

	return (
		<Card className="container mx-auto p-4 md:p-10">
			<div className="">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid grid-cols-4 mb-6">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
									className="flex items-center gap-2"
								>
									<Icon className="h-4 w-4" />
									{tab.label}
								</TabsTrigger>
							);
						})}
					</TabsList>

					{/* Description Tab */}
					<TabsContent value="description" className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-3">Course Overview</h3>
							<p className="text-muted-foreground">
								{descriptionContent.overview}
							</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
							<ul className="space-y-2">
								{descriptionContent.objectives.map((obj, idx) => (
									<li key={idx} className="flex items-start gap-2">
										<CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
										<span>{obj}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="text-lg font-semibold mb-3">Requirements</h3>
								<ul className="space-y-2">
									{descriptionContent.requirements.map((req, idx) => (
										<li key={idx} className="flex items-start gap-2">
											<div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
											<span className="text-muted-foreground">{req}</span>
										</li>
									))}
								</ul>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-3">
									Who This Course Is For
								</h3>
								<ul className="space-y-2">
									{descriptionContent.targetAudience.map((audience, idx) => (
										<li key={idx} className="flex items-start gap-2">
											<div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
											<span className="text-muted-foreground">{audience}</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="pt-4 border-t">
							<h3 className="text-lg font-semibold mb-3">Course Curriculum</h3>
							<div className="space-y-2">
								<div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
									<span className="font-medium">7 Comprehensive Modules</span>
									<span className="text-sm text-muted-foreground">
										4h 54m total
									</span>
								</div>
								<div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
									<span className="font-medium">68 Practical Lectures</span>
									<span className="text-sm text-muted-foreground">
										Including case studies
									</span>
								</div>
								<div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
									<span className="font-medium">12 Downloadable Resources</span>
									<span className="text-sm text-muted-foreground">
										Templates & guides
									</span>
								</div>
							</div>
						</div>
					</TabsContent>

					{/* Discussion Tab */}
					<TabsContent value="discussion" className="space-y-6">
						<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
							<div className="flex-1">
								<h3 className="text-lg font-semibold mb-2">
									Join the Discussion
								</h3>
								<p className="text-sm text-muted-foreground">
									Connect with {courseInfo.enrolled} peers and instructors
								</p>
							</div>
							<Button className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								New Discussion
							</Button>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input placeholder="Search discussions..." className="pl-10" />
							</div>
							<div className="flex items-center gap-2">
								<Filter className="h-4 w-4 text-muted-foreground" />
								<select
									className="bg-background border rounded-md px-3 py-2 text-sm"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
								>
									{sortOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="space-y-4">
							{discussionPosts.map((post) => {
								const isExpanded = expandedPosts.has(post.id);
								const Icon = isExpanded ? ChevronUp : ChevronDown;
								return (
									<Card key={post.id} className="overflow-hidden">
										<div className="p-5">
											<div className="flex justify-between items-start mb-3">
												<div className="flex items-center gap-3">
													<Avatar>
														<AvatarFallback>
															{post.author.avatar}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-semibold">
															{post.author.name}
														</div>
														<div className="text-xs text-muted-foreground">
															{post.author.role}
														</div>
													</div>
												</div>
												<div className="flex items-center gap-2">
													{post.isResolved && (
														<Badge
															variant="outline"
															className="bg-green-50 text-green-700 border-green-200"
														>
															<CheckCircle className="h-3 w-3 mr-1" />
															Resolved
														</Badge>
													)}
													<span className="text-sm text-muted-foreground">
														{post.timestamp}
													</span>
												</div>
											</div>

											<h4 className="font-bold text-lg mb-3">{post.title}</h4>

											<div className="mb-4">
												<p
													className={`text-muted-foreground ${!isExpanded && "line-clamp-2"}`}
												>
													{post.content}
												</p>
											</div>

											<Separator className="my-4" />
										</div>
									</Card>
								);
							})}
						</div>

						<div className="flex justify-center mt-6">
							<Button variant="outline">Load More Discussions</Button>
						</div>
					</TabsContent>

					{/* Q&A Tab */}
					<TabsContent value="qa" className="space-y-6">
						<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
							<div>
								<h3 className="text-lg font-semibold mb-2">
									Questions & Answers
								</h3>
								<p className="text-sm text-muted-foreground">
									Have questions? Get answers from instructors and peers
								</p>
							</div>
							<Button className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								Ask a Question
							</Button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
							<Card className="p-4 bg-blue-50 border-blue-200">
								<div className="flex items-start gap-3">
									<HelpCircle className="h-6 w-6 text-blue-600 mt-1" />
									<div>
										<h4 className="font-semibold text-blue-900">
											Top Questions
										</h4>
										<p className="text-sm text-blue-700 mt-1">
											Browse the most frequently asked questions and their
											answers
										</p>
									</div>
								</div>
							</Card>
							<Card className="p-4 bg-green-50 border-green-200">
								<div className="flex items-start gap-3">
									<CheckCircle className="h-6 w-6 text-green-600 mt-1" />
									<div>
										<h4 className="font-semibold text-green-900">
											Featured Answers
										</h4>
										<p className="text-sm text-green-700 mt-1">
											Verified answers from instructors and experts
										</p>
									</div>
								</div>
							</Card>
						</div>

						<div className="space-y-4">
							{qaItems.map((item) => (
								<Card
									key={item.id}
									className={`p-5 ${item.isFeatured ? "border-l-4 border-l-primary" : ""}`}
								>
									<div className="p-4 rounded-lg mb-4">
										<p className="text-sm">{item.answer}</p>
									</div>

									<div className="flex flex-wrap items-center justify-between gap-2 text-sm">
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-2">
												<span className="text-muted-foreground">Asked by:</span>
												<span className="font-medium">{item.askedBy.name}</span>
												<Badge variant="outline">{item.askedBy.role}</Badge>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-muted-foreground">
													Answered by:
												</span>
												<span className="font-medium">
													{item.answeredBy.name}
												</span>
												<Badge
													variant="outline"
													className="bg-green-50 text-green-700"
												>
													{item.answeredBy.role}
												</Badge>
											</div>
										</div>
										<span className="text-muted-foreground">
											{item.timestamp}
										</span>
									</div>
								</Card>
							))}
						</div>

						<div className="flex items-center justify-between mt-6 pt-6 border-t">
							<div className="text-sm text-muted-foreground">
								<span className="font-medium">3 featured questions</span> • 128
								total questions
							</div>
							<Button variant="outline">View All Questions</Button>
						</div>
					</TabsContent>

					{/* Reviews Tab */}
					<TabsContent value="reviews" className="space-y-6">
						<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
							<div>
								<h3 className="text-lg font-semibold mb-2">Student Reviews</h3>
								<div className="flex items-center gap-2">
									<div className="flex items-center">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`h-5 w-5 ${
													i < Math.floor(courseInfo.rating)
														? "text-yellow-500 fill-yellow-500"
														: "text-gray-300"
												}`}
											/>
										))}
									</div>
									<span className="font-bold text-2xl">
										{courseInfo.rating}
									</span>
									<span className="text-muted-foreground">
										({courseInfo.reviews} reviews)
									</span>
								</div>
							</div>
							<Button className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								Write a Review
							</Button>
						</div>

						<div className="space-y-4">
							{reviews.map((review) => (
								<Card key={review.id} className="p-5">
									<div className="flex justify-between items-start mb-4">
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarFallback>{review.author.avatar}</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-semibold flex items-center gap-2">
													{review.author.name}
													{review.verified && (
														<Badge
															variant="outline"
															className="bg-green-50 text-green-700 text-xs"
														>
															Verified Student
														</Badge>
													)}
												</div>
												<div className="text-sm text-muted-foreground">
													{review.author.role}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<div className="flex items-center">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`h-4 w-4 ${
															i < review.rating
																? "text-yellow-500 fill-yellow-500"
																: "text-gray-300"
														}`}
													/>
												))}
											</div>
											<span className="text-sm text-muted-foreground">
												{review.timestamp}
											</span>
										</div>
									</div>

									<h4 className="font-bold text-lg mb-3">{review.title}</h4>
									<p className="text-muted-foreground mb-4">{review.content}</p>

									<Separator className="my-4" />
								</Card>
							))}
						</div>

						<div className="flex items-center justify-between mt-6 pt-6 border-t">
							<div className="text-sm text-muted-foreground">
								Showing 4 of {courseInfo.reviews} reviews
							</div>
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm">
									Most Helpful
								</Button>
								<Button variant="outline" size="sm">
									Most Recent
								</Button>
								<Button variant="outline" size="sm">
									Highest Rated
								</Button>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</Card>
	);
}
