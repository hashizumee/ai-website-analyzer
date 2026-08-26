"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HistoryItem, getHistory, clearHistory } from "@/lib/history";
import { History, ArrowRight, Trash2, Globe, Clock, LayoutDashboard } from "lucide-react";

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setHistoryData(getHistory());
  }, []);

  const handleClear = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat analisis?")) {
      clearHistory();
      setHistoryData([]);
    }
  };

  if (!isClient) return null; // Prevents hydration mismatch

  return (
    <div className="min-h-screen bg-[#0b0f19] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <History className="w-8 h-8 mr-3 text-teal-400" />
              Riwayat Analisis
            </h1>
            <p className="text-slate-400">Daftar website yang pernah Anda audit sebelumnya. Data ini disimpan aman secara lokal di perangkat Anda.</p>
          </div>
          
          {historyData.length > 0 && (
            <button 
              onClick={handleClear}
              className="inline-flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg transition-colors w-fit"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-medium text-sm">Hapus Riwayat</span>
            </button>
          )}
        </div>

        {historyData.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center">
            <LayoutDashboard className="w-16 h-16 text-slate-700 mb-4" />
            <h2 className="text-xl font-bold text-slate-300 mb-2">Belum ada riwayat</h2>
            <p className="text-slate-500 mb-6">Mulai audit website pertama Anda sekarang untuk melihat riwayat di sini.</p>
            <Link 
              href="/"
              className="bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold px-6 py-2.5 rounded-lg transition-colors"
            >
              Ke Halaman Utama
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyData.map((item, index) => {
              const date = new Date(item.timestamp);
              const scoreColor = item.overallScore >= 90 ? "text-emerald-400" : item.overallScore >= 50 ? "text-amber-400" : "text-rose-400";
              
              return (
                <div key={index} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 hover:border-teal-500/30 transition-all group flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="truncate">
                        <h3 className="text-lg font-bold text-slate-200 truncate" title={item.url}>
                          {item.url.replace(/^https?:\/\//, '')}
                        </h3>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Skor Terakhir</div>
                      <div className={`text-2xl font-black ${scoreColor}`}>{item.overallScore}</div>
                    </div>
                    <Link 
                      href={`/results?url=${encodeURIComponent(item.url)}`}
                      className="inline-flex items-center text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors group-hover:translate-x-1"
                    >
                      Buka Laporan
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
