"use client";

import { useState, useEffect } from "react";
import { Settings, Key, CheckCircle2, Webhook, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveWebhookSettings, getWebhookSettings } from "./webhook-actions";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [threshold, setThreshold] = useState("80");
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedKey = localStorage.getItem("GOOGLE_PAGESPEED_API_KEY");
    if (savedKey) {
      setApiKey(savedKey);
    }
    
    // Fetch webhook
    getWebhookSettings().then(res => {
      if (res && res.url) {
        setWebhookUrl(res.url);
        setThreshold(res.threshold.toString());
      }
    });
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

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveWebhookSettings(webhookUrl, parseInt(threshold) || 80);
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 3000);
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-teal-400" />
            Pengaturan (Settings)
          </h1>
          <p className="text-muted-foreground">Atur preferensi aplikasi dan konfigurasi kunci API Anda di sini.</p>
        </div>

        <Card className="bg-card border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center">
              <Key className="w-5 h-5 mr-2 text-teal-500" />
              API Key Google PageSpeed
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Aplikasi ini menggunakan API gratis Google PageSpeed yang memiliki limit (kuota) ketat. 
              Jika kuota habis, aplikasi terpaksa menampilkan <b>Layar Error Limit API</b>. <br/><br/>
              Untuk menghindari hal ini, Anda dapat memasukkan kunci API PageSpeed Anda sendiri. Kunci ini hanya disimpan di peramban (browser) Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Google PageSpeed API Key</label>
                <Input
                  type="password"
                  placeholder="Masukkan Kunci API Anda (mulai dengan AIzaSy...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-background border-border text-foreground focus-visible:ring-teal-500"
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

        {/* Webhook Settings */}
        <Card className="bg-card border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center">
              <Webhook className="w-5 h-5 mr-2 text-teal-500" />
              Notifikasi Webhook
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Terima pemberitahuan saat skor analisis kurang dari batas tertentu (Threshold). Berguna untuk monitoring berkelanjutan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveWebhook} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Webhook URL (Discord/Slack/dll)</label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="bg-background border-border text-foreground focus-visible:ring-teal-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Batas Minimal Skor (Threshold)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="bg-background border-border text-foreground focus-visible:ring-teal-500"
                />
                <p className="text-xs text-muted-foreground">Notifikasi dikirim jika skor di bawah angka ini.</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white font-semibold">
                  <Bell className="w-4 h-4 mr-2" />
                  Simpan Webhook
                </Button>
                {webhookSaved && (
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
