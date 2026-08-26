import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { analysisResult } = await req.json();

    if (!analysisResult) {
      return NextResponse.json({ error: "Analysis result is required" }, { status: 400 });
    }

    // Menggunakan API Key yang diberikan (hardcoded untuk kemudahan deploy Netlify)
    const apiKey = process.env.NARA_API_KEY || "sk-nry-acDQg2dz38mhOwno_ttdAQY8ntm4ByTGfluIxPGE1jA";
    
    if (!apiKey) {
      return NextResponse.json({ error: "NARA_API_KEY is not configured" }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://router.bynara.id/v1",
    });

    // Prepare a condensed version of findings to send to AI
    const issuesToFix: any[] = [];
    for (const [category, data] of Object.entries(analysisResult.categories)) {
      const categoryData = data as any;
      categoryData.findings.forEach((finding: any) => {
        if (finding.status === "fail" || finding.status === "warning") {
          issuesToFix.push({ category, ...finding });
        }
      });
    }

    if (issuesToFix.length === 0) {
      return NextResponse.json({ recommendations: "Tidak ada masalah signifikan yang ditemukan. Website Anda dalam kondisi sangat baik!" });
    }

    const prompt = `
Anda adalah seorang pakar Website (SEO, Performance, Security, Accessibility).
Berikut adalah daftar masalah teknis dari website ${analysisResult.url} (Overall Score: ${analysisResult.overallScore}/100):

${JSON.stringify(issuesToFix, null, 2)}

Tugas Anda:
1. Analisis masalah di atas.
2. Kelompokkan masalah berdasarkan prioritas (Critical, High, Medium, Low).
3. Berikan rekomendasi langkah demi langkah cara memperbaikinya dengan bahasa Indonesia yang jelas (gabungan antara awam dan developer friendly).
4. Format output Anda dalam Markdown. Gunakan heading (###), bullet points, dan sertakan contoh kode singkat jika relevan.
5. Jangan berikan salam pengantar atau penutup, langsung berikan panduan solusinya.
`;

    const response = await openai.chat.completions.create({
      model: "ox-alpha",
      messages: [
        { role: "system", content: "Anda adalah asisten AI yang ahli dalam audit website dan pengembangan web." },
        { role: "user", content: prompt }
      ]
    });

    const text = response.choices[0]?.message?.content || "Gagal mendapatkan respons dari model.";

    return NextResponse.json({ recommendations: text });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Gagal menghasilkan rekomendasi AI" }, { status: 500 });
  }
}
