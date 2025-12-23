import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, User } from "lucide-react";
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
import LoginPopup from "./LoginPopup";
import SignupPopup from "./SignupPopup.tsx";
import { Button } from "./ui/button";

export default function Header() {
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
		{ name: "Blog", href: "/blog" },
		{ name: "About Us", href: "/about-us" },
		{ name: "Contact Us", href: "/contact-us" },
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
			<header className="bg-[#FEFEFE]">
				<nav className="container mx-auto px-6 md:px-0 py-4">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<a href="/" className="flex items-center">
							<img
								src="/Logo@3x.png"
								alt="PrepExcellence Logo"
								className="w-full max-w-40 h-auto"
							/>
						</a>

						{/* Desktop Navigation */}
						<div className="hidden lg:flex items-center gap-5 xl:gap-8">
							{navigation.map((item) => (
								<Link
									key={item.name}
									to={item.href}
									className="font-medium py-1 border-b-4 border-transparent text-black transition-all duration-300 data-[status=active]:border-[#ef782e]"
								>
									{item.name}
								</Link>
							))}
						</div>

						{/* Desktop Auth / Profile */}
						<div
							className="hidden lg:flex items-center gap-3 relative"
							ref={profileRef}
						>
							{!user ? (
								<>
									<Button
										onClick={toggleLoginPopup}
										variant="ghost"
										className="px-7 py-2.5 text-white bg-primary-dark"
									>
										Login
									</Button>
									<Button
										onClick={toggleSignupPopup}
										className="px-7 py-2.5 bg-[#ef782e] text-white"
									>
										Sign Up
									</Button>
								</>
							) : (
								<div className="relative">
									<button
										onClick={() => setProfileOpen(!profileOpen)}
										type="button"
										className="w-10 h-10 rounded-full bg-primary-dark text-white flex items-center justify-center hover:cursor-pointer"
									>
										<User size={20} />
									</button>

									{profileOpen && (
										<div className="absolute right-0 mt-1 w-44 bg-gray-300 shadow-lg rounded-md overflow-hidden z-50">
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

								<SheetContent side="right" className="w-full max-w-xs bg-white">
									<SheetHeader className="mb-8">
										<SheetTitle>
											<img src="/Logo@3x.png" className="max-w-32" alt="Logo" />
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
				</nav>
			</header>

			<AnimatePresence>
				{isLoginPopupOpen && <LoginPopup />}
				{isSignupPopupOpen && <SignupPopup />}
			</AnimatePresence>
		</>
	);
}
