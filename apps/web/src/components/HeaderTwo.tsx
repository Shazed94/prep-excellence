import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, User, UserRound } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";
import Topnav from "./header/Topnav.tsx";
import LoginPopup from "./LoginPopup.tsx";
import SignupPopup from "./SignupPopup.tsx.tsx";
import { Button } from "./ui/button.tsx";

export default function HeaderTwo() {
	const [open, setOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);

	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const {
		isLoginPopupOpen,
		isSignupPopupOpen,
		toggleLoginPopup,
		toggleSignupPopup,
	} = useLoginPopupStore();

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

	const handleLogout = () => {
		logout(); // 🔹 Use useAuth's logout
		setProfileOpen(false);
		navigate({ to: "/" });
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
							<div className="hidden lg:flex items-center gap-5 xl:gap-6 bg-[#F8F8F9] border border-[#EBEBEB] rounded-sm px-[24px] py-[14px] ps-[40px]">
								{navigation.map((item) => (
									<Link
										key={item.name}
										to={item.href}
										// use a group so children can respond to parent's data-status
										className="group data-[status=active]:font-medium font-normal f14 font-inter text-black transition-colors duration-200 relative"
									>
										{/* keep the dot present (fixed size) and animate only color/opacity to avoid layout reflow */}
										<span
											aria-hidden="true"
											className="w-[10px] h-[10px] rounded-full absolute -left-[18px] top-1/2 -translate-y-1/2 bg-transparent opacity-0 group-data-[status=active]:bg-primary group-data-[status=active]:opacity-100 transition-all duration-200"
										/>
										{item.name}
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
											onClick={toggleLoginPopup}
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
											<User size={20} />
										</button>
										{profileOpen && (
											<div className="absolute right-0 top-full mt-1 w-44 bg-gray-300 shadow-lg rounded-md overflow-hidden z-50">
												<button
													onClick={() => {
														setProfileOpen(false);
														navigate({ to: "/dashboard" });
													}}
													type="button"
													className="w-full text-left px-4 py-3 hover:bg-primary hover:cursor-pointer"
												>
													Dashboard
												</button>
												<button
													onClick={handleLogout}
													type="button"
													className="w-full text-left px-4 py-3 text-red-600 hover:bg-primary hover:cursor-pointer"
												>
													Logout
												</button>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Mobile Menu */}
							<div className="lg:hidden">
								<Sheet open={open} onOpenChange={setOpen}>
									<SheetTrigger asChild>
										<Button variant="ghost" size="icon">
											<Menu className="h-6 w-6" />
										</Button>
									</SheetTrigger>

									<SheetContent
										side="right"
										className="w-full max-w-xs bg-white"
									>
										<SheetHeader className="mb-8">
											<SheetTitle>
												<img
													src="/Logo@3x.png"
													className="max-w-32"
													alt="Logo"
												/>
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
															setOpen(false);
															toggleLoginPopup();
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
													<span>{user.name}</span>
													<Button
														onClick={() => {
															setOpen(false);
															navigate({ to: "/dashboard" });
														}}
													>
														Dashboard
													</Button>
													<Button variant="destructive" onClick={handleLogout}>
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
