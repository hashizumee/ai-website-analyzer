import AnalyzerForm from "@/components/AnalyzerForm";
import { BarChart3, SearchCheck, Zap, ShieldCheck, Sparkles, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header Dashboard */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Audit Website Baru</h1>
        <p className="text-slate-400">Masukkan URL untuk memulai analisis menyeluruh performa, SEO, aksesibilitas, dan keamanan.</p>
      </div>

      {/* Main Action Area */}
      <div className="mb-12">
        <div className="p-1 rounded-3xl bg-gradient-to-b from-slate-800 to-[#0b0f19] shadow-lg">
          <div className="bg-[#111827] rounded-[22px] p-2">
            <AnalyzerForm />
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center text-slate-200">
            <Activity className="w-5 h-5 mr-2 text-teal-400" /> Metrik yang Dianalisis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureCard 
              icon={<SearchCheck className="w-6 h-6 text-teal-400" />}
              title="SEO Analysis"
              description="Memeriksa kelengkapan meta tag dan heading."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-teal-400" />}
              title="Performance"
              description="Evaluasi kecepatan load & optimasi aset."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-teal-400" />}
              title="Accessibility"
              description="Memastikan aksesibilitas bagi semua user."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-teal-400" />}
              title="Security"
              description="Pengecekan protokol keamanan & HTTP Headers."
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center text-slate-200">
            <Sparkles className="w-5 h-5 mr-2 text-teal-400" /> Didukung oleh AI
          </h2>
          <div className="bg-gradient-to-br from-teal-900/40 to-blue-900/20 border border-teal-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[50px]" />
            <h3 className="font-semibold text-lg text-white mb-3 relative z-10">Laporan Komprehensif</h3>
            <p className="text-sm text-teal-100/70 leading-relaxed relative z-10 mb-4">
              Tidak perlu menebak-nebak lagi arti metrik teknis. Sistem kami yang ditenagai **NaraRouter AI** akan menerjemahkan setiap masalah teknis menjadi langkah perbaikan yang praktis.
            </p>
            <div className="inline-flex text-xs font-bold bg-teal-500/20 text-teal-400 px-3 py-1.5 rounded-full border border-teal-500/30">
              Powered by ox-alpha
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-teal-500/40 transition-all duration-300">
      <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-base text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
