"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu,
  X,
  Home, 
  History, 
  Settings, 
  Sparkles, 
  PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Beranda",
      href: "/",
      icon: <Home className="w-5 h-5" />,
      description: "Halaman Utama & Analisis"
    },
    {
      name: "Riwayat Analisis",
      href: "/history",
      icon: <History className="w-5 h-5" />,
      description: "Arsip Data Tersimpan"
    },
    {
      name: "Komparasi",
      href: "/compare",
      icon: <PieChart className="w-5 h-5" />,
      description: "Bandingkan 2 Website"
    }
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-[#0b0f19]/80 border-b border-slate-800">
        <div className="flex h-16 items-center px-4 md:px-8">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 mr-4 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-[0_0_10px_rgba(45,212,191,0.5)]">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
              AI Analyzer <span className="text-[10px] bg-teal-900/50 text-teal-400 px-1.5 py-0.5 rounded border border-teal-700/50 align-top ml-1">PRO</span>
            </span>
          </div>
        </div>
      </header>

      {/* Backdrop for mobile sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-72 bg-[#05070a] border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.5)] shrink-0">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Menu
              </h1>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith('/results') && item.href === '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                    isActive 
                      ? "bg-teal-500 text-[#05070a] shadow-[0_0_20px_rgba(20,184,166,0.3)] font-medium" 
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "mr-3 shrink-0",
                    isActive ? "text-[#05070a]" : "text-slate-400 group-hover:text-teal-400"
                  )}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px] font-semibold">{item.name}</div>
                    <div className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-teal-950/70 font-medium" : "text-slate-500"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
