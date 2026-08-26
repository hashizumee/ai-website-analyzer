"use client";

import { useState } from "react";
import { PieChart, Search, ArrowRight, Loader2, SearchCheck, Zap, BarChart3, ShieldCheck, Trophy, AlertTriangle } from "lucide-react";
import { AnalysisResult } from "@/lib/scoring";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ComparePage() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [result1, setResult1] = useState<AnalysisResult | null>(null);
  const [result2, setResult2] = useState<AnalysisResult | null>(null);

  const fetchAnalysis = async (targetUrl: string) => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: targetUrl }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `Gagal menganalisis ${targetUrl}`);
    }
    return res.json();
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url1 || !url2) return;
    
    setLoading(true);
    setError(null);
    setResult1(null);
    setResult2(null);

    try {
      // Fetch both simultaneously to save time
      const [data1, data2] = await Promise.all([
        fetchAnalysis(url1),
        fetchAnalysis(url2)
      ]);
      setResult1(data1);
      setResult2(data2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWinnerClass = (score1: number, score2: number) => {
    if (score1 > score2) return "ring-2 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
    return "";
  };

  const renderComparisonRow = (title: string, icon: React.ReactNode, getScore: (res: AnalysisResult) => number) => {
    if (!result1 || !result2) return null;
    
    const s1 = getScore(result1);
    const s2 = getScore(result2);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_1fr] gap-4 items-center p-4 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
        <div className={`p-4 rounded-xl bg-[#111827] flex items-center justify-between ${s1 > s2 ? 'border-emerald-500/50 border bg-emerald-500/5' : 'border border-slate-800'}`}>
          <div className="text-3xl font-black text-white">{s1}</div>
          {s1 > s2 && <Trophy className="w-5 h-5 text-yellow-400" />}
        </div>
        
        <div className="flex flex-col items-center justify-center text-center py-2 md:py-0">
          <div className="bg-slate-800/50 p-2 rounded-full mb-2">{icon}</div>
          <span className="font-semibold text-slate-300">{title}</span>
        </div>
        
        <div className={`p-4 rounded-xl bg-[#111827] flex items-center justify-between ${s2 > s1 ? 'border-emerald-500/50 border bg-emerald-500/5' : 'border border-slate-800'}`}>
          {s2 > s1 && <Trophy className="w-5 h-5 text-yellow-400" />}
          <div className="text-3xl font-black text-white text-right w-full">{s2}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
            <PieChart className="w-8 h-8 mr-3 text-blue-400" />
            Komparasi Website
          </h1>
          <p className="text-slate-400">Bandingkan metrik teknis dua website secara langsung *(head-to-head)*.</p>
        </div>

        {/* Compare Form */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
          <form onSubmit={handleCompare} className="relative z-10 flex flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Website A</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <Input 
                    placeholder="https://kompetitor1.com"
                    value={url1}
                    onChange={(e) => setUrl1(e.target.value)}
                    className="pl-12 h-14 bg-[#0b0f19] border-slate-700 text-white rounded-xl focus-visible:ring-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Website B</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <Input 
                    placeholder="https://kompetitor2.com"
                    value={url2}
                    onChange={(e) => setUrl2(e.target.value)}
                    className="pl-12 h-14 bg-[#0b0f19] border-slate-700 text-white rounded-xl focus-visible:ring-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center text-red-400">
                <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading || !url1 || !url2}
              className="h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sedang Mengadu... (Bisa memakan waktu s/d 30 detik)
                </>
              ) : (
                "Bandingkan Sekarang"
              )}
            </Button>
          </form>
        </div>

        {/* Comparison Results */}
        {result1 && result2 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Result */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center p-4 bg-[#111827] border border-slate-800 rounded-2xl">
                <div className="text-sm text-slate-400 mb-1">Website A</div>
                <div className="font-bold text-white truncate px-2" title={result1.url}>{result1.url.replace(/^https?:\/\//, '')}</div>
              </div>
              <div className="text-center p-4 bg-[#111827] border border-slate-800 rounded-2xl">
                <div className="text-sm text-slate-400 mb-1">Website B</div>
                <div className="font-bold text-white truncate px-2" title={result2.url}>{result2.url.replace(/^https?:\/\//, '')}</div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-[#05070a] border border-slate-800 rounded-3xl overflow-hidden">
              <div className="p-4 bg-slate-800/30 border-b border-slate-800 text-center font-bold text-white">
                RINGKASAN SKOR
              </div>
              
              {renderComparisonRow("Overall Score", <Trophy className="w-5 h-5 text-slate-300" />, r => r.overallScore)}
              {renderComparisonRow("SEO", <SearchCheck className="w-5 h-5 text-slate-300" />, r => r.categories.seo.score)}
              {renderComparisonRow("Performance", <Zap className="w-5 h-5 text-slate-300" />, r => r.categories.performance.score)}
              {renderComparisonRow("Accessibility", <BarChart3 className="w-5 h-5 text-slate-300" />, r => r.categories.accessibility.score)}
              {renderComparisonRow("Security", <ShieldCheck className="w-5 h-5 text-slate-300" />, r => r.categories.security.score)}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm">Ingin penjelasan AI detail? Cek satu persatu di beranda.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
