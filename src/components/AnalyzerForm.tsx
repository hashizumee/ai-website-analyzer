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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="Masukkan URL website (contoh: https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pl-12 pr-32 h-14 text-lg rounded-full shadow-sm"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !url}
          className="absolute right-1.5 h-11 rounded-full px-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </Button>
      </div>
      {error && (
        <p className="text-red-500 text-sm px-4 font-medium">{error}</p>
      )}
    </form>
  );
}
