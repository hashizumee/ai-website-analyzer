"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnalysisReportRecord } from "@/lib/db";
import { History, ArrowRight, Trash2, Globe, Clock, LayoutDashboard, LineChart as LineChartIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<AnalysisReportRecord[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetch("/api/history")
      .then(res => res.json())
      .then(data => {
        setHistoryData(data);
        setLoading(false);
      });
  }, []);

  const handleClear = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat analisis?")) {
      await fetch("/api/history", { method: "DELETE" });
      setHistoryData([]);
    }
  };

  if (!isClient || loading) return null; // Prevents hydration mismatch

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
              <History className="w-8 h-8 mr-3 text-teal-400" />
              Riwayat Analisis
            </h1>
            <p className="text-muted-foreground">Daftar website yang pernah Anda audit sebelumnya. Data ini disimpan aman secara lokal di perangkat Anda.</p>
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
          <div className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center">
            <LayoutDashboard className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Belum ada riwayat</h2>
            <p className="text-muted-foreground mb-6">Mulai audit website pertama Anda sekarang untuk melihat riwayat di sini.</p>
            <Link 
              href="/"
              className="bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold px-6 py-2.5 rounded-lg transition-colors"
            >
              Ke Halaman Utama
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Chart Section */}
            {historyData.length >= 2 && (
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center mb-6">
                  <LineChartIcon className="w-6 h-6 mr-3 text-teal-400" />
                  <h2 className="text-xl font-bold text-white">Tren Performa (Semua Audit)</h2>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...historyData].reverse().map(item => ({
                      name: new Date(item.createdAt).toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
                      Score: item.overallScore,
                      url: item.url.replace(/^https?:\/\//, '')
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#2dd4bf' }}
                        labelStyle={{ color: '#94a3b8' }}
                      />
                      <Line type="monotone" dataKey="Score" stroke="#2dd4bf" strokeWidth={3} dot={{ fill: '#0f172a', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#2dd4bf' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyData.map((item, index) => {
              const date = new Date(item.createdAt);
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
                      href={`/report/${item.id}`}
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
          </div>
        )}
      </div>
    </div>
  );
}
