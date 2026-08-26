"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AIRecommendations({ analysisResult }: { analysisResult: any }) {
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!analysisResult) return;

    const fetchAI = async () => {
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

    fetchAI();
  }, [analysisResult]);

  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium text-blue-700 animate-pulse">Gemini AI sedang menganalisis temuan dan menyusun rekomendasi...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/30">
        <CardContent className="p-6 flex items-center space-x-3 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 overflow-hidden shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span>Rekomendasi AI Gemini</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose prose-sm md:prose-base max-w-none prose-blue prose-headings:font-semibold prose-a:text-blue-600">
          <ReactMarkdown>{recommendations}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
