import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import AIRecommendations from "@/components/AIRecommendations";
import { ArrowLeft, Share2, Download } from "lucide-react";
import Link from "next/link";
import ScoreCard from "@/components/ScoreCard";
import ReportActions from "./ReportActions";

export default async function ReportPage({ params }: { params: { id: string } }) {
  const data = db.read();
  const report = data.reports.find(r => r.id === params.id);

  if (!report) {
    notFound();
  }

  // The categories object is saved in JSON db
  const cats = report.categories as any;
  const metrics = [
    { label: "Performa", value: cats.performance?.score || 0 },
    { label: "Aksesibilitas", value: cats.accessibility?.score || 0 },
    { label: "SEO", value: cats.seo?.score || 0 },
    { label: "Keamanan", value: cats.security?.score || 0 }
  ];

  return (
    <div className="min-h-screen bg-background p-8 text-foreground font-sans relative">
      {/* Background decorations */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 dark:bg-teal-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-900/20 blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10" id="report-content">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Link href="/history" className="inline-flex items-center text-muted-foreground hover:text-teal-500 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Riwayat
          </Link>
          
          <ReportActions />
        </div>

        {/* Main Content */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3">
              <ScoreCard title="Skor Keseluruhan" score={report.overallScore} size="lg" />
            </div>
            
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold text-white mb-2 truncate" title={report.url}>
                {report.url}
              </h1>
              <p className="text-slate-400 mb-6 flex items-center">
                Dianalisis pada {new Date(report.createdAt).toLocaleString("id-ID")}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, i) => (
                  <div key={i} className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-center">
                    <div className="text-sm font-medium text-slate-400 mb-1">{metric.label}</div>
                    <div className={`text-2xl font-black ${
                      metric.value >= 90 ? "text-emerald-400" :
                      metric.value >= 50 ? "text-amber-400" : "text-rose-400"
                    }`}>
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <AIRecommendations 
          analysisResult={report}
        />
      </div>
    </div>
  );
}
