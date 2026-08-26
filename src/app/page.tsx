import AnalyzerForm from "@/components/AnalyzerForm";
import { BarChart3, SearchCheck, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mb-12">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-4">
            AI-Powered Website Analysis
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Audit Website Anda <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Lebih Cepat & Pintar
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Pahami masalah SEO, performa, aksesibilitas, dan keamanan website Anda dalam hitungan detik. 
            Dapatkan rekomendasi perbaikan instan!
          </p>
        </div>

        {/* Input Form */}
        <div className="w-full mb-20 z-10">
          <AnalyzerForm />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center w-full">
          <FeatureCard 
            icon={<SearchCheck className="w-8 h-8 text-blue-500" />}
            title="SEO Analysis"
            description="Periksa meta tag, struktur heading, dan elemen kritis SEO lainnya."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-yellow-500" />}
            title="Performance"
            description="Evaluasi metrik kecepatan dan optimasi resource halaman."
          />
          <FeatureCard 
            icon={<BarChart3 className="w-8 h-8 text-green-500" />}
            title="Accessibility"
            description="Pastikan website dapat diakses dengan baik oleh semua pengguna."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-red-500" />}
            title="Security"
            description="Verifikasi konfigurasi keamanan dasar dan sertifikat SSL."
          />
        </div>

      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 bg-muted rounded-full">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
