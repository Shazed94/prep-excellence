import { Link } from "@tanstack/react-router";
import { Home, Star } from "lucide-react";
import { Button } from "./ui/button";

export default function NotFound() {
	return (
		<section className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden px-4">
			{/* Grid background effect */}
			<div className="absolute inset-0 opacity-10 pointer-events-none">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							"linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)",
						backgroundSize: "60px 60px",
					}}
				/>
			</div>

			{/* Floating accent lights */}
			<div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl opacity-20 pointer-events-none" />
			<div className="absolute bottom-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl opacity-20 pointer-events-none" />

			{/* Content */}
			<div className="relative z-10 max-w-2xl mx-auto text-center space-y-8 md:space-y-10">
				{/* Badge */}
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50">
					<Star className="w-4 h-4" />
					<span className="text-sm text-muted-foreground">
						Something amazing is coming
					</span>
				</div>

				{/* Main heading */}
				<div className="space-y-4">
					<h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
						We're almost ready
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed">
						We're working hard to bring you something extraordinary. Stay tuned
						for the big reveal!
					</p>
				</div>

				{/* Email signup form */}
				<Link to="/">
					<Button className="h-12 px-8 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 flex items-center gap-2 mx-auto">
						<Home className="w-5 h-5" />
						Back to Home
					</Button>
				</Link>
			</div>

			<style>{`
        @keyframes slide {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
		</section>
	);
}
