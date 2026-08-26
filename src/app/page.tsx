import AnalyzerForm from "@/components/AnalyzerForm";
import { BarChart3, SearchCheck, Zap, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0f19] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh] relative z-10">
        
        {/* Header/Logo Area */}
        <div className="flex items-center space-x-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.5)]">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            AI Website Analyzer <span className="text-xs bg-teal-900/50 text-teal-400 px-2 py-0.5 rounded-full border border-teal-700/50 align-top ml-1">PRO</span>
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100">
            Audit Website Anda <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">
              Lebih Cepat & Pintar
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Pahami masalah SEO, performa, aksesibilitas, dan keamanan website Anda dalam hitungan detik. 
            Dapatkan rekomendasi perbaikan instan berbasis AI!
          </p>
        </div>

        {/* Input Form */}
        <div className="w-full max-w-2xl mb-24">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-slate-800 to-[#0b0f19] shadow-2xl">
            <div className="bg-[#111827] rounded-[22px] p-2">
              <AnalyzerForm />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
          <FeatureCard 
            icon={<SearchCheck className="w-7 h-7 text-teal-400" />}
            title="SEO Analysis"
            description="Periksa meta tag, heading, dan elemen kritis SEO."
          />
          <FeatureCard 
            icon={<Zap className="w-7 h-7 text-teal-400" />}
            title="Performance"
            description="Evaluasi metrik kecepatan standar industri (Lighthouse)."
          />
          <FeatureCard 
            icon={<BarChart3 className="w-7 h-7 text-teal-400" />}
            title="Accessibility"
            description="Pastikan website dapat diakses oleh semua pengguna."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-7 h-7 text-teal-400" />}
            title="Security"
            description="Verifikasi best practices dan keamanan website."
          />
        </div>

      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group flex flex-col p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-teal-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(45,212,191,0.1)] hover:-translate-y-1">
      <div className="w-14 h-14 rounded-xl bg-slate-800/50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
