"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const urlSchema = z.string().url({ message: "URL tidak valid. Harap sertakan http:// atau https://" });

export default function AnalyzerForm() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate URL
    const result = urlSchema.safeParse(url);
    if (!result.success) {
      // If it doesn't have http/https, try adding https:// and revalidating
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
    // In Phase 1 MVP, we navigate to the results page and pass URL as query param
    router.push(`/results?url=${encodeURIComponent(validUrl)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto relative group">
      <div className="relative flex items-center">
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
      {error && (
        <p className="absolute -bottom-8 left-4 text-red-400 text-sm font-medium">{error}</p>
      )}
    </form>
  );
}
