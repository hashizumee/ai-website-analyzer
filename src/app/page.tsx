import AnalyzerForm from "@/components/AnalyzerForm";
import { BarChart3, SearchCheck, Zap, ShieldCheck, Sparkles, Activity, CheckCircle2, Globe, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-[#0b0f19] relative overflow-hidden flex flex-col">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10 flex flex-col items-center">
          
          <div className="inline-flex items-center space-x-2 bg-slate-800/50 rounded-full px-4 py-1.5 mb-8 border border-slate-700/50">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-slate-300">Ditenagai oleh NaraRouter AI & Google Lighthouse</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-100 mb-8 leading-tight">
            Audit Website Anda <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">
              Menjadi Lebih Pintar
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            AI Website Analyzer PRO memindai ribuan metrik teknis dalam hitungan detik. 
            Dapatkan skor akurat dan instruksi perbaikan langkah-demi-langkah dari kecerdasan buatan.
          </p>

          {/* Form Input */}
          <div className="w-full max-w-3xl mb-8">
            <div className="p-1 rounded-[24px] bg-gradient-to-b from-teal-500/30 to-slate-800 shadow-[0_0_40px_rgba(20,184,166,0.15)] relative group hover:shadow-[0_0_50px_rgba(20,184,166,0.25)] transition-shadow duration-500">
              <div className="bg-[#111827] rounded-[22px] p-2">
                <AnalyzerForm />
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">Masukkan URL lengkap (misal: https://google.com)</p>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-24 bg-[#070a11] border-y border-slate-800/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Cara Kerja AI Analyzer</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Kami menggabungkan mesin audit standar industri dengan analisis bahasa alami untuk memberikan Anda solusi praktis yang siap dieksekusi oleh tim developer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-teal-500/0 via-teal-500/20 to-teal-500/0 -translate-y-1/2" />
            
            <StepCard 
              number="1"
              icon={<Globe className="w-8 h-8 text-blue-400" />}
              title="Input URL Target"
              description="Sistem akan mengunjungi website Anda layaknya browser sungguhan menggunakan teknologi Puppeteer & Lighthouse."
            />
            <StepCard 
              number="2"
              icon={<Cpu className="w-8 h-8 text-purple-400" />}
              title="Ekstraksi Metrik"
              description="Memeriksa lebih dari 100+ parameter teknis mulai dari TTFB, meta tags, hingga kontras warna aksesibilitas."
            />
            <StepCard 
              number="3"
              icon={<Sparkles className="w-8 h-8 text-teal-400" />}
              title="Rekomendasi AI"
              description="Model NaraRouter ox-alpha menyortir error dan menyusun laporan perbaikan berbahasa manusia yang mudah dipahami."
            />
          </div>
        </div>
      </section>

      {/* --- FEATURES DEEP DIVE --- */}
      <section className="py-24 px-4 container mx-auto max-w-6xl">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">4 Pilar Audit Utama</h2>
          <p className="text-slate-400 max-w-2xl">Laporan terstruktur berdasarkan metrik Google Lighthouse terbaru yang akan meningkatkan kualitas website Anda di mata mesin pencari dan pengguna.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailFeatureCard 
            icon={<SearchCheck className="w-10 h-10 text-emerald-400" />}
            title="SEO (Search Engine Optimization)"
            description="Meningkatkan peringkat pencarian Anda dengan memeriksa elemen kritis seperti Meta Description, struktur Heading (H1-H6), Status Kode HTTP, dan optimasi mobile."
            items={["Crawlable Links", "Mobile Friendly", "Valid Meta Tags", "Indexability"]}
          />
          <DetailFeatureCard 
            icon={<Zap className="w-10 h-10 text-amber-400" />}
            title="Performance (Kecepatan)"
            description="Tidak ada yang suka menunggu lambat. Kami mendeteksi ukuran gambar berlebih, script JS pemblokir render, dan mengukur Core Web Vitals (LCP, FID, CLS)."
            items={["First Contentful Paint", "Time to Interactive", "Optimasi Gambar", "Minifikasi Aset"]}
          />
          <DetailFeatureCard 
            icon={<BarChart3 className="w-10 h-10 text-indigo-400" />}
            title="Accessibility (Aksesibilitas)"
            description="Pastikan website Anda inklusif dan dapat digunakan oleh penyandang disabilitas. Memeriksa atribut ARIA, navigasi keyboard, dan rasio kontras warna."
            items={["ARIA Labels", "Contrast Ratio", "Keyboard Navigation", "Alt Text Gambar"]}
          />
          <DetailFeatureCard 
            icon={<ShieldCheck className="w-10 h-10 text-rose-400" />}
            title="Security & Best Practices"
            description="Melindungi pengguna Anda dengan memastikan website menggunakan HTTPS (SSL), bebas dari error konsol JavaScript, dan menggunakan pustaka frontend yang aman."
            items={["HTTPS Usage", "No Console Errors", "Secure CSP", "Safe Dependencies"]}
          />
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-gradient-to-b from-[#0b0f19] to-[#040608] mt-auto">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Siap Mengoptimasi Website Anda?</h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">Tinggalkan cara lama menganalisis secara manual. Biarkan AI kami yang melakukan pekerjaan beratnya untuk Anda secara gratis.</p>
          <Link 
            href="#top"
            className="inline-flex items-center justify-center space-x-2 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_35px_rgba(20,184,166,0.5)] hover:-translate-y-1"
          >
            <span>Mulai Audit Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; 2026 AI Website Analyzer PRO. Ditenagai oleh Next.js, Tailwind, & NaraRouter.</p>
      </footer>
    </main>
  );
}

// --- HELPER COMPONENTS --- //

function StepCard({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-[#0b0f19] rounded-3xl border border-slate-800 relative z-10 hover:border-slate-700 transition-colors">
      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 absolute -top-4 shadow-lg">
        {number}
      </div>
      <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-200 mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function DetailFeatureCard({ icon, title, description, items }: { icon: React.ReactNode, title: string, description: string, items: string[] }) {
  return (
    <div className="p-8 rounded-3xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-colors group">
      <div className="mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-200 mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed mb-8 h-24">{description}</p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-center text-slate-300 font-medium">
            <CheckCircle2 className="w-5 h-5 mr-3 text-teal-500/70 group-hover:text-teal-400 transition-colors" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
