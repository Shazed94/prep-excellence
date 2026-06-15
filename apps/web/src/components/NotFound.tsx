import { Link } from "@tanstack/react-router";
import { Home, Star } from "lucide-react";
import { Button } from "./ui/button";

export default function NotFound() {
  return (
    <section className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Floating accent lights */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl opacity-20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8 md:space-y-10">
        {/* Main heading */}
        <div className="space-y-4">
          <img
            src="/404.png"
            alt="404 Not Found"
            className="mx-auto w-84 h-auto object-contain"
          />
          <h1 className="text-[48px] leading-[56px] font-semibold text-balance -tracking-[2px]">
            404 Not Found
          </h1>
          <p className="p">The page you were looking for could not be found.</p>
        </div>

        {/* Email signup form */}
        <Link to="/">
          <Button className="h-12 px-8 gradient">
            <Home className="w-5 h-5" />
            Back Back to Homepage
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
