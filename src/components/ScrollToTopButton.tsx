"use client";

import { ArrowRight } from "lucide-react";

export default function ScrollToTopButton() {
  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Optional: Focus on the input field after a short delay to allow scrolling
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 500);
  };

  return (
    <button 
      onClick={handleScroll}
      className="inline-flex items-center justify-center space-x-2 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_35px_rgba(20,184,166,0.5)] hover:-translate-y-1"
    >
      <span>Mulai Audit Sekarang</span>
      <ArrowRight className="w-5 h-5" />
    </button>
  );
}
