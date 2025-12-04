import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import useLoginPopupStore from "@/store/useLoginPopupStore.ts";
import LoginPopup from "./LoginPopup.tsx";
import { Button } from "./ui/button.tsx";

export default function Header() {
	const [open, setOpen] = useState(false);
	const { isLoginPopupOpen, toggleLoginPopup } = useLoginPopupStore();

	const navigation = [
		{ name: "Home", href: "/" },
		{ name: "SAT Courses", href: "/sat-courses" },
		{ name: "College Admissions", href: "/college-admissions" },
		{ name: "Blog", href: "/blog" },
		{ name: "About Us", href: "/about-us" },
		{ name: "Contact Us", href: "/contact-us" },
	];

	return (
		<>
			{/* Navigation */}
			<header className="bg-[#FEFEFE]">
				<nav className="container mx-auto px-6 md:px-0 py-4">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<div className="flex items-center">
							<a href="/" className="flex items-center">
								<img
									src="/Logo@3x.png"
									alt="PrepExcellence Logo"
									className="w-full max-w-40 h-auto"
								/>
							</a>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden lg:flex items-center gap-8">
							{navigation.map((item) => (
								<Link
									key={item.name}
									to={item.href}
									className="
                              font-medium py-1 border-b-4 border-transparent text-black
                              transition-all duration-300
                              data-[status=active]:border-[#ef782e]
                              data-[status=active]:text-black
                            "
								>
									{item.name}
								</Link>
							))}
						</div>

						{/* Desktop Auth Buttons */}
						<div className="hidden lg:flex items-center gap-3">
							<Button
								onClick={toggleLoginPopup}
								variant="ghost"
								className="px-7 py-2.5 text-white bg-primary-dark hover:bg-accent hover:text-white transition-all duration-300 cursor-pointer"
							>
								Login
							</Button>
							<Button className="px-7 py-2.5 bg-[#ef782e] hover:bg-[#ef782e]/90 text-white">
								Sign Up
							</Button>
						</div>

						{/* Mobile Menu Trigger */}
						<div className="lg:hidden">
							<Sheet open={open} onOpenChange={setOpen}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" className="text-black">
										<Menu className="h-6 w-6" />
										<span className="sr-only">Open menu</span>
									</Button>
								</SheetTrigger>

								<SheetContent side="right" className="w-full max-w-xs bg-white">
									<SheetHeader className="mb-8">
										<SheetTitle className="flex items-center justify-between">
											<img
												src="/Logo@3x.png"
												alt="PrepExcellence Logo"
												className="w-full max-w-32 h-auto"
											/>
											{/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button> */}
										</SheetTitle>
									</SheetHeader>

									<div className="flex flex-col gap-6 mt-8 px-3">
										{navigation.map((item) => (
											<a
												key={item.name}
												href={item.href}
												onClick={() => setOpen(false)}
												className="text-lg font-medium text-black hover:text-[#ef782e] transition-colors py-2 border-b border-gray-100"
											>
												{item.name}
											</a>
										))}

										<div className="flex flex-col gap-4 mt-10">
											<Button
												variant="outline"
												className="w-full py-6 text-base border-[#ef782e] text-[#ef782e] hover:bg-[#ef782e] hover:text-white"
												onClick={() => setOpen(false)}
											>
												Login
											</Button>
											<Button
												className="w-full py-6 text-base bg-[#ef782e] hover:bg-[#ef782e]/90"
												onClick={() => setOpen(false)}
											>
												Sign Up
											</Button>
										</div>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</nav>
			</header>

			{isLoginPopupOpen && <LoginPopup />}
		</>
	);
}
