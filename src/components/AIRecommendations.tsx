"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AIRecommendations({ analysisResult }: { analysisResult: any }) {
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAI = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisResult }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal memuat AI.");
      }

      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!analysisResult) return;
    fetchAI();
  }, [analysisResult]);

  if (loading) {
    return (
      <Card className="border-slate-800 bg-[#111827]">
        <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          <p className="text-sm font-medium text-slate-400 animate-pulse">NaraRouter AI sedang menganalisis temuan dan menyusun rekomendasi...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-slate-800 bg-[#111827]">
        <CardContent className="p-6 flex flex-col items-center space-y-4 text-slate-400">
          <div className="flex items-center space-x-3 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm font-medium">Gagal memuat AI: {error}</p>
          </div>
          <button 
            onClick={fetchAI}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-sm transition-colors"
          >
            Coba Lagi
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 overflow-hidden shadow-2xl bg-[#111827]">
      <CardHeader className="bg-gradient-to-r from-teal-900/50 to-slate-800 border-b border-slate-800/50">
        <CardTitle className="flex items-center space-x-2 text-lg text-white">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <span>Rekomendasi AI</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose prose-sm md:prose-base max-w-none prose-invert prose-headings:font-semibold prose-a:text-teal-400">
          <ReactMarkdown>{recommendations}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
