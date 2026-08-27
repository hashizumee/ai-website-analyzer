"use client";

import { useState, useEffect } from "react";
import { Settings, Key, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedKey = localStorage.getItem("GOOGLE_PAGESPEED_API_KEY");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim() === "") {
      localStorage.removeItem("GOOGLE_PAGESPEED_API_KEY");
    } else {
      localStorage.setItem("GOOGLE_PAGESPEED_API_KEY", apiKey.trim());
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#0b0f19] p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-teal-400" />
            Pengaturan (Settings)
          </h1>
          <p className="text-slate-400">Atur preferensi aplikasi dan konfigurasi kunci API Anda di sini.</p>
        </div>

        <Card className="bg-[#111827] border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Key className="w-5 h-5 mr-2 text-teal-500" />
              Kunci API Kustom (Bring Your Own Key)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Aplikasi ini menggunakan API gratis Google PageSpeed yang memiliki limit (kuota) ketat. 
              Jika kuota habis, aplikasi terpaksa merender <b>Simulation Mode (dummy data)</b>. <br/><br/>
              Untuk menghindari hal ini, Anda dapat memasukkan kunci API PageSpeed Anda sendiri. Kunci ini hanya disimpan di peramban (browser) Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Google PageSpeed API Key</label>
                <Input
                  type="password"
                  placeholder="Masukkan Kunci API Anda (mulai dengan AIzaSy...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white focus-visible:ring-teal-500"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white font-semibold">
                  Simpan Kunci API
                </Button>
                {saved && (
                  <span className="flex items-center text-green-400 text-sm animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Tersimpan!
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
