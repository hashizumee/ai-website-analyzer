"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  History, 
  Settings, 
  Sparkles, 
  PieChart,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
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
      href: "#", // Placeholder
      icon: <History className="w-5 h-5" />,
      description: "Arsip Data Tersimpan"
    },
    {
      name: "Komparasi",
      href: "#", // Placeholder
      icon: <PieChart className="w-5 h-5" />,
      description: "Bandingkan 2 Website"
    },
    {
      name: "Pengaturan",
      href: "#", // Placeholder
      icon: <Settings className="w-5 h-5" />,
      description: "Konfigurasi API Key"
    }
  ];

  return (
    <aside className="w-72 bg-[#05070a] border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/50 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.5)] shrink-0">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
            AI Analyzer <span className="ml-2 text-[10px] font-black bg-teal-900/50 text-teal-400 px-1.5 py-0.5 rounded uppercase border border-teal-700/50">PRO</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Navigasi & Pengaturan</p>
        </div>
      </div>

      {/* Menu Area */}
      <div className="p-4 flex-1">
        <h2 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider ml-2">Menu Utama</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith('/results') && item.href === '/');
            return (
              <Link
                key={item.name}
                href={item.href}
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
                <div className={cn(
                  "opacity-0 transition-opacity",
                  !isActive && "group-hover:opacity-100 text-slate-500"
                )}>
                  &rsaquo;
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area */}
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-orange-500/20 transition-colors">
           <div className="flex items-center space-x-2">
             <Sparkles className="w-5 h-5 text-orange-400" />
             <span className="font-bold text-orange-400 text-sm">Upgrade Plan</span>
           </div>
           <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Tap</span>
        </div>
      </div>
    </aside>
  );
}
