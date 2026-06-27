import { Link, useNavigate } from "@tanstack/react-router";
import {
	BookOpen,
	GraduationCap,
	LayoutDashboard,
	LogOut,
	User,
	UserRound,
	Video,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";
import { CartDrawer } from "./CartDrawer.tsx";
import Topnav from "./header/Topnav.tsx";
import LoginPopup from "./LoginPopup.tsx";
import SignupPopup from "./SignupPopup.tsx.tsx";
import { HamburgerMenu } from "./SvgComponents.tsx";
import { Button } from "./ui/button.tsx";

export default function HeaderTwo() {
	const [open, setOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);

	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const { isLoginPopupOpen, isSignupPopupOpen, toggleSignupPopup } =
		useLoginPopupStore();

	const profileRef = useRef<HTMLDivElement>(null);

	const navigation = [
		{ name: "Home", href: "/" },
		{ name: "SAT Courses", href: "/sat-courses" },
		{ name: "College Admissions", href: "/college-admissions" },
		{ name: "About", href: "/about-us" },
		{ name: "Tutoring", href: "/tutoring" },
		{ name: "Blog", href: "/blog" },
		{ name: "Contact", href: "/contact-us" },
	];

	const getDashboardLinks = () => {
		if (user?.role === "Teacher") {
			return [
				{
					label: "Dashboard",
					href: "/teacher-dashboard",
					icon: LayoutDashboard,
				},
				{
					label: "LMS Courses",
					href: "/teacher-dashboard/lms-courses",
					icon: BookOpen,
				},
				{
					label: "Coaching Programs",
					href: "/teacher-dashboard/coaching",
					icon: GraduationCap,
				},
				{
					label: "1-on-1 Sessions",
					href: "/teacher-dashboard/sessions",
					icon: Video,
				},
				{ label: "My Profile", href: "/teacher-dashboard/profile", icon: User },
			];
		}
		if (user?.role === "Student") {
			return [
				{
					label: "Dashboard",
					href: "/student-dashboard",
					icon: LayoutDashboard,
				},
				{
					label: "My Courses",
					href: "/student-dashboard/my-courses",
					icon: BookOpen,
				},
				{
					label: "Coaching",
					href: "/student-dashboard/coaching",
					icon: GraduationCap,
				},
				{
					label: "My Sessions",
					href: "/student-dashboard/sessions",
					icon: Video,
				},
				{
					label: "Find a Tutor",
					href: "/student-dashboard/find-tutor",
					icon: User,
				},
			];
		}
		return [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }];
	};

	const handleLogout = () => {
		logout();
		setProfileOpen(false);
		navigate({ to: "/" });
		toast.success("Logged out successfully");
	};

	// Close profile dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileRef.current &&
				!profileRef.current.contains(event.target as Node)
			) {
				setProfileOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<>
			<Topnav />
			<header className="bg-[#FEFEFE]">
				<nav className="container mx-auto px-4 md:px-0 py-5">
					<div className="flex items-center justify-between ">
						{/* Logo */}
						<a href="/" className="flex items-center">
							<img
								src="/logo.png"
								alt="PrepExcellence Logo"
								className="w-full max-w-40 h-auto"
							/>
						</a>
						<div
							className={`${user?.email ? "xl:gap-40" : "xl:gap-16"} flex items-center gap-5 `}
						>
							{/* Desktop Navigation */}
							<div className="hidden lg:flex items-center gap-6 bg-[#F8F8F9] border border-[#EBEBEB] rounded-sm px-6 py-3.5 ">
								{navigation.map((item) => (
									<Link
										key={item.name}
										to={item.href}
										// use a group so children can respond to parent's data-status
										className="group transition-colors duration-200 flex items-center gap-[6px]"
									>
										{/* keep the dot present (fixed size) and animate only color/opacity to avoid layout reflow */}
										<span
											aria-hidden="true"
											className="hidden group-data-[status=active]:block w-2.5 h-2.5  rounded-full  bg-transparent opacity-0 group-data-[status=active]:bg-primary group-data-[status=active]:opacity-100 transition-all duration-200"
										/>
										<span className="data-[status=active]:font-medium font-medium! f14 font-inter text-black ">
											{item.name}
										</span>
									</Link>
								))}
							</div>

							{/* Desktop Auth / Profile */}
							<div
								className="hidden lg:flex items-center gap-1.5 relative"
								ref={profileRef}
							>
								{!user ? (
									<>
										<Button
											onClick={() => {
												// toggleLoginPopup
												navigate({ to: "/login" });
											}}
											variant="outline"
											className="w-[122px] h-[48px] gap-3"
										>
											<UserRound className="size-[20px]" strokeWidth={1.5} />
											<span className="f14 font-medium -tracking-[0.5px]!">
												Sign In{" "}
											</span>
										</Button>
										<Button
											onClick={toggleSignupPopup}
											variant="gradient"
											className="px-[32px] py-[11.5px] text-[17px] leading-[24.4px] -tracking-[0.78px]  h-[48px]"
										>
											Book a Consultation
										</Button>
									</>
								) : (
									<div className="relative flex items-center gap-2">
										{user.name}
										<button
											onClick={() => setProfileOpen(!profileOpen)}
											type="button"
											className="w-10 h-10 rounded-full bg-primary-dark text-white flex items-center justify-center hover:cursor-pointer"
										>
											{user.image ? (
												<img
													src={user.image}
													alt={user.name}
													className="w-10 h-10 rounded-full"
												/>
											) : (
												<User size={20} />
											)}
										</button>
										{profileOpen && (
											<div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border/60 shadow-xl rounded-2xl overflow-hidden z-50">
												{/* User info header */}
												<div className="px-4 py-3 border-b border-border/40 bg-primary/4">
													<p className="text-sm font-semibold font-switzer truncate">
														{user.name}
													</p>
													<p className="text-xs text-muted truncate">
														{user.email}
													</p>
												</div>
												{/* Role-aware nav links */}
												<div className="py-1.5">
													{getDashboardLinks().map((link) => (
														<button
															key={link.href}
															onClick={() => {
																setProfileOpen(false);
																navigate({ to: link.href });
															}}
															type="button"
															className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/8 hover:text-primary transition-colors cursor-pointer"
														>
															<link.icon
																size={15}
																className="shrink-0 text-muted"
															/>
															{link.label}
														</button>
													))}
												</div>
												{/* Divider + logout */}
												<div className="border-t border-border/40 py-1.5">
													<button
														onClick={handleLogout}
														type="button"
														className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
													>
														<LogOut size={15} className="shrink-0" />
														Logout
													</button>
												</div>
											</div>
										)}
									</div>
								)}
								<CartDrawer />
							</div>

							{/* Mobile Menu */}
							<div className="lg:hidden">
								<Sheet open={open} onOpenChange={setOpen}>
									<div className="flex">
										<CartDrawer />
										<SheetTrigger asChild className="">
											<div className="group bg-transparent hover:bg-gradient-to-b hover:from-primary hover:to-primary-dark p-3 rounded-[12px]">
												<HamburgerMenu className="text-black group-hover:text-white transition-colors" />
											</div>
										</SheetTrigger>
									</div>

									<SheetContent
										side="right"
										className="w-full max-w-xs bg-white"
									>
										<SheetHeader className="mb-8">
											<SheetTitle>
												<img src="/logo.png" className="max-w-32" alt="Logo" />
											</SheetTitle>
										</SheetHeader>

										<div className="flex flex-col gap-6 px-3">
											{navigation.map((item) => (
												<a
													key={item.name}
													href={item.href}
													onClick={() => setOpen(false)}
													className="text-lg font-medium border-b"
												>
													{item.name}
												</a>
											))}

											{!user ? (
												<>
													<Button
														variant="outline"
														onClick={() => {
															// setOpen(false);
															// toggleLoginPopup();
															navigate({ to: "/login" });
														}}
													>
														Login
													</Button>
													<Button
														onClick={() => {
															setOpen(false);
															toggleSignupPopup();
														}}
													>
														Sign Up
													</Button>
												</>
											) : (
												<>
													<div className="bg-primary/5 rounded-xl px-3 py-2">
														<p className="font-semibold text-sm">{user.name}</p>
														<p className="text-xs text-muted">{user.email}</p>
													</div>
													{getDashboardLinks().map((link) => (
														<Button
															key={link.href}
															variant="outline"
															onClick={() => {
																setOpen(false);
																navigate({ to: link.href });
															}}
															className="justify-start gap-2"
														>
															<link.icon size={15} />
															{link.label}
														</Button>
													))}
													<Button
														variant="destructive"
														onClick={handleLogout}
														className="gap-2"
													>
														<LogOut size={15} />
														Logout
													</Button>
												</>
											)}
										</div>
									</SheetContent>
								</Sheet>
							</div>
						</div>
					</div>
				</nav>
			</header>

			<AnimatePresence>
				{isLoginPopupOpen && <LoginPopup />}
				{isSignupPopupOpen && <SignupPopup />}
			</AnimatePresence>
		</>
	);
}
