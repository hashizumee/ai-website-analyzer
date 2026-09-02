import AnalyzerForm from "@/components/AnalyzerForm";
import { BarChart3, SearchCheck, Zap, ShieldCheck, Sparkles, Activity, CheckCircle2, Globe, Cpu } from "lucide-react";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 dark:bg-teal-900/20 blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-emerald-500/10 dark:bg-emerald-900/20 blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-900/10 blur-[120px]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl text-center relative z-10 flex flex-col items-center">
          
          <div className="inline-flex items-center space-x-2 bg-teal-500/10 dark:bg-teal-900/30 border border-teal-500/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-teal-600 dark:text-teal-300">Ditenagai oleh NaraRouter AI & Google Lighthouse</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Audit Website Anda <br className="hidden md:block" />
            Menjadi Lebih <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Pintar</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            AI Website Analyzer PRO memindai ribuan metrik teknis dalam hitungan detik. Dapatkan skor akurat dan instruksi perbaikan langkah-demi-langkah dari kecerdasan buatan.
          </p>

          {/* Form Input */}
          <div className="w-full max-w-3xl mb-8">
            <div className="p-1 rounded-[24px] bg-gradient-to-b from-teal-500/30 to-muted dark:to-slate-800 shadow-[0_0_40px_rgba(20,184,166,0.15)] relative group hover:shadow-[0_0_50px_rgba(20,184,166,0.25)] transition-shadow duration-500">
              <div className="bg-card rounded-[22px] p-2">
                <AnalyzerForm />
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Masukkan URL lengkap (misal: https://google.com)</p>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-24 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Cara Kerja AI Analyzer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Kami menggabungkan mesin audit standar industri dengan analisis bahasa alami untuk memberikan Anda solusi praktis yang siap dieksekusi oleh tim developer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">4 Pilar Audit Utama</h2>
          <p className="text-muted-foreground max-w-2xl">Laporan terstruktur berdasarkan metrik Google Lighthouse terbaru yang akan meningkatkan kualitas website Anda di mata mesin pencari dan pengguna.</p>
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

      {/* Footer / CTA Area */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-20 pb-32">
        <div className="flex flex-col items-center text-center p-8 bg-card rounded-3xl border border-border relative z-10 hover:border-accent transition-colors shadow-sm dark:shadow-none">
          <Sparkles className="w-10 h-10 text-teal-400 mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Siap Memperbaiki Website Anda?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl">
            Jangan biarkan skor performa dan SEO yang buruk menghambat konversi Anda. Mulai analisis gratis sekarang.
          </p>
          <ScrollToTopButton />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>&copy; 2026 AI Website Analyzer PRO. Ditenagai oleh Next.js, Tailwind, & NaraRouter.</p>
      </footer>
    </main>
  );
}

// --- HELPER COMPONENTS --- //

function StepCard({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-card rounded-3xl border border-border relative z-10 hover:border-accent transition-colors">
      <div className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center font-bold text-foreground absolute -top-4 shadow-lg">
        {number}
      </div>
      <div className="mb-6 p-4 bg-muted rounded-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function DetailFeatureCard({ icon, title, description, items }: { icon: React.ReactNode, title: string, description: string, items: string[] }) {
  return (
    <div className="p-8 rounded-3xl bg-card border border-border hover:border-accent transition-colors group">
      <div className="mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-8 h-24">{description}</p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-center text-foreground font-medium">
            <CheckCircle2 className="w-5 h-5 mr-3 text-teal-500/70 group-hover:text-teal-500 transition-colors" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
