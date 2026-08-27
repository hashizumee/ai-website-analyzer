"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const urlSchema = z.string().url({ message: "URL tidak valid. Harap sertakan http:// atau https://" });

export default function AnalyzerForm() {
  const [url, setUrl] = useState("");
  const [prdContext, setPrdContext] = useState("");
  const [isDeepCrawl, setIsDeepCrawl] = useState(false);
  const [showPrd, setShowPrd] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate URL
    const result = urlSchema.safeParse(url);
    if (!result.success) {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        const urlWithHttps = `https://${url}`;
        const secondResult = urlSchema.safeParse(urlWithHttps);
        if (secondResult.success) {
          proceedWithUrl(urlWithHttps);
          return;
        }
      }
      setError(result.error.issues[0].message);
      return;
    }

    proceedWithUrl(url);
  };

  const proceedWithUrl = (validUrl: string) => {
    setIsLoading(true);
    let target = `/results?url=${encodeURIComponent(validUrl)}`;
    if (prdContext.trim()) {
      target += `&prdContext=${encodeURIComponent(prdContext.trim())}`;
    }
    if (isDeepCrawl) {
      target += `&deepCrawl=true`;
    }
    const savedKey = localStorage.getItem("GOOGLE_PAGESPEED_API_KEY");
    if (savedKey) {
      target += `&apiKey=${encodeURIComponent(savedKey)}`;
    }
    router.push(target);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto relative group">
      <div className="relative flex flex-col space-y-4">
        {/* Main URL Input */}
        <div className="relative flex items-center bg-transparent">
          <Search className="absolute left-6 text-slate-400 w-6 h-6 transition-colors group-focus-within:text-teal-400" />
          <Input
            type="text"
            placeholder="Masukkan URL website (contoh: https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-16 pr-40 h-20 text-lg rounded-[18px] bg-transparent border-none text-slate-100 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !url}
            className="absolute right-3 h-14 rounded-xl px-8 bg-teal-500 hover:bg-teal-400 text-[#0b0f19] font-bold text-lg shadow-[0_0_15px_rgba(20,184,166,0.4)] hover:shadow-[0_0_25px_rgba(20,184,166,0.6)] transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Menganalisis...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {/* PRD Context Section */}
        <div className="px-4 pb-2 border-t border-slate-800 pt-4 mt-2">
          <button
            type="button"
            onClick={() => setShowPrd(!showPrd)}
            className="flex items-center text-sm text-slate-400 hover:text-teal-400 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Tambahkan Konteks PRD / Info Web App (Opsional)
            {showPrd ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>
          
          {showPrd && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <textarea
                value={prdContext}
                onChange={(e) => setPrdContext(e.target.value)}
                placeholder="Tempel ringkasan PRD atau deskripsi fitur yang seharusnya ada di aplikasi ini. AI akan mengevaluasi apakah website memenuhi standar tersebut."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[100px] resize-y text-sm"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="mt-4 flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="deepCrawl" 
              checked={isDeepCrawl} 
              onChange={(e) => setIsDeepCrawl(e.target.checked)}
              className="w-4 h-4 text-teal-600 bg-slate-900 border-slate-700 rounded focus:ring-teal-500"
              disabled={isLoading}
            />
            <label htmlFor="deepCrawl" className="text-sm text-slate-300 cursor-pointer">
              Gunakan <b>Deep Crawl</b> (Audit Sub-Halaman) <span className="text-xs text-slate-500">- Membutuhkan waktu lebih lama</span>
            </label>
          </div>
        </div>

      </div>
      {error && (
        <p className="absolute -bottom-8 left-4 text-red-400 text-sm font-medium">{error}</p>
      )}
    </form>
  );
}
