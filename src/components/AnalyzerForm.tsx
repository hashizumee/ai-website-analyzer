"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, ChevronDown, ChevronUp, UploadCloud, CheckCircle } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
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

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    setFileName(file.name);
    try {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/extract-pdf", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        if (data.text) {
          setPrdContext(data.text);
        } else {
          setError(data.error || "Gagal mengekstrak PDF.");
        }
      } else {
        // Assume text file
        const text = await file.text();
        setPrdContext(text);
      }
    } catch (err) {
      setError("Gagal memproses file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
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
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="w-full border-2 border-dashed border-slate-700 hover:border-teal-500 bg-slate-900/30 rounded-xl p-6 text-center transition-colors flex flex-col items-center justify-center mb-4"
              >
                {isUploading ? (
                  <div className="text-slate-400 flex flex-col items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-400 mb-2" />
                    <span>Membaca file {fileName}...</span>
                  </div>
                ) : fileName ? (
                  <div className="text-emerald-400 flex flex-col items-center">
                    <CheckCircle className="w-8 h-8 mb-2" />
                    <span>File dimuat: {fileName}</span>
                    <button 
                      type="button"
                      onClick={() => { setFileName(""); setPrdContext(""); }}
                      className="text-xs text-slate-400 mt-2 hover:text-red-400 underline"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
                    <p className="text-sm text-slate-400 mb-1">Tarik & Lepas file PRD (PDF, TXT, MD)</p>
                    <p className="text-xs text-slate-500">Atau klik untuk memilih file</p>
                    <input 
                      type="file" 
                      accept=".pdf,.txt,.md"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>

              {!fileName && (
                <>
                  <div className="flex items-center space-x-2 text-slate-500 text-xs uppercase font-bold tracking-widest my-2">
                    <div className="flex-1 h-px bg-slate-800"></div>
                    <span>ATAU PASTE MANUAL</span>
                    <div className="flex-1 h-px bg-slate-800"></div>
                  </div>
                  <textarea
                    value={prdContext}
                    onChange={(e) => setPrdContext(e.target.value)}
                    placeholder="Tempel ringkasan PRD atau deskripsi fitur yang seharusnya ada di aplikasi ini. AI akan mengevaluasi apakah website memenuhi standar tersebut."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[100px] resize-y text-sm"
                    disabled={isLoading}
                  />
                </>
              )}
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
