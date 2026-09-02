"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AnalysisResult } from "@/lib/scoring";
import { saveToHistory } from "@/lib/history";
import ScoreCard from "@/components/ScoreCard";
import AIRecommendations from "@/components/AIRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchCheck, Zap, BarChart3, ShieldCheck, Loader2, AlertCircle, CheckCircle2, XCircle, Printer } from "lucide-react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const prdContext = searchParams.get("prdContext");
  const isDeepCrawl = searchParams.get("deepCrawl") === "true";
  const apiKey = searchParams.get("apiKey");

  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent infinite save loop
  const hasSaved = useRef(false);

  useEffect(() => {
    if (!url) {
      setError("URL tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, prdContext, isDeepCrawl, apiKey }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Gagal melakukan analisis.");
        }

        const resultData = await res.json();
        setData(resultData);

        if (!hasSaved.current) {
          saveToHistory(resultData);
          hasSaved.current = true;
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan yang tidak terduga.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <h2 className="text-xl font-medium">Menganalisis {url}...</h2>
        <p className="text-muted-foreground text-sm">Ini mungkin memakan waktu beberapa detik.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 bg-red-50/50 border border-red-200 rounded-xl text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-red-700">Gagal Menganalisis</h2>
          <p className="text-red-600/80 text-sm">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md font-medium hover:bg-red-200 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="p-8 space-y-8 max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Hasil Analisis</h1>
            <p className="text-sm text-muted-foreground truncate max-w-full">
              {data.url}
            </p>
          </div>

          <button 
            onClick={() => window.print()}
            className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/80 text-foreground px-4 py-2 rounded-lg transition-colors border border-border w-fit"
          >
            <Printer className="w-4 h-4" />
            <span className="font-medium text-sm">Cetak Laporan</span>
          </button>
        </div>

        {/* Top Section: Overall Score & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ScoreCard 
              title="Overall Score" 
              score={data.overallScore} 
              size="lg" 
            />
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <ScoreCard 
              title="SEO" 
              score={data.categories.seo.score} 
              icon={<SearchCheck className="w-4 h-4 text-slate-400" />} 
            />
            <ScoreCard 
              title="Performance" 
              score={data.categories.performance.score} 
              icon={<Zap className="w-4 h-4 text-slate-400" />} 
            />
            <ScoreCard 
              title="Accessibility" 
              score={data.categories.accessibility.score} 
              icon={<BarChart3 className="w-4 h-4 text-slate-400" />} 
            />
            <ScoreCard 
              title="Security & Best Practices" 
              score={data.categories.security.score} 
              icon={<ShieldCheck className="w-4 h-4 text-slate-400" />} 
            />
          </div>
        </div>

        {/* Detailed Findings */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Detail Temuan</h3>
          
          <CategorySection title="SEO Analysis" result={data.categories.seo} />
          <CategorySection title="Performance" result={data.categories.performance} />
          <CategorySection title="Accessibility" result={data.categories.accessibility} />
          <CategorySection title="Security & Best Practices" result={data.categories.security} />
        </div>

        {/* AI Recommendations */}
        <div className="mt-12">
          <AIRecommendations analysisResult={data} />
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <h2 className="text-xl font-medium">Memuat...</h2>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

function CategorySection({ title, result }: { title: string, result: any }) {
  if (!result || !result.findings) return null;

  return (
    <Card>
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle className="text-lg flex justify-between items-center">
          {title}
          <span className="text-sm font-normal bg-background px-2 py-1 border rounded-md">Score: {result.score}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {result.findings.map((finding: any, i: number) => (
            <div key={i} className="p-4 flex items-start gap-3">
              <div className="mt-0.5">
                {finding.status === "pass" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : finding.status === "fail" ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{finding.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{finding.description}</p>
              </div>
              {finding.priority && finding.status !== 'pass' && (
                <div className={`text-xs px-2 py-1 rounded border font-medium ${
                  finding.priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
                  finding.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                  'bg-yellow-100 text-yellow-700 border-yellow-200'
                }`}>
                  {finding.priority}
                </div>
              )}
            </div>
          ))}
          {result.findings.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Tidak ada temuan.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
