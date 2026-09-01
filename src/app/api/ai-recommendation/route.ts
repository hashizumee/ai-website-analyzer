import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { analysisResult } = await req.json();

    if (!analysisResult) {
      return NextResponse.json({ error: "Analysis result is required" }, { status: 400 });
    }

    // Menggunakan API Key Gemini dari environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured in .env" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Prepare a condensed version of findings to send to AI
    const issuesToFix: any[] = [];
    for (const [category, data] of Object.entries(analysisResult.categories)) {
      const categoryData = data as any;
      categoryData.findings.forEach((finding: any) => {
        // Hanya kirimkan maksimum 10 issue yang fail ke AI untuk menghemat token
        if (issuesToFix.length < 10 && (finding.status === "fail" || finding.status === "warning")) {
          issuesToFix.push({ category, ...finding });
        }
      });
    }

    if (issuesToFix.length === 0) {
      return NextResponse.json({ recommendations: "Tidak ada masalah signifikan yang ditemukan. Website Anda dalam kondisi sangat baik!" });
    }

    // Batasi PRD hingga 2000 karakter maksimal untuk menghemat token NaraRouter
    const prdText = analysisResult.prdContext ? analysisResult.prdContext.substring(0, 2000) : "";
    const prdSection = prdText 
      ? `\nKonteks Tambahan (PRD / Deskripsi Aplikasi, Dibatasi):\n"${prdText}"\n\nInstruksi Tambahan: Harap evaluasi juga apakah metrik dan temuan di atas sudah sejalan dengan Konteks PRD ini.`
      : "";

    const prompt = `
Anda adalah seorang pakar Website (SEO, Performance, Security, Accessibility).
Berikut adalah daftar masalah teknis dari website ${analysisResult.url} (Overall Score: ${analysisResult.overallScore}/100):

${JSON.stringify(issuesToFix, null, 2)}
${prdSection}

Tugas Anda:
1. Analisis masalah di atas.
2. Kelompokkan masalah berdasarkan prioritas (Critical, High, Medium, Low).
3. Berikan rekomendasi langkah demi langkah cara memperbaikinya dengan bahasa Indonesia yang jelas (gabungan antara awam dan developer friendly).
4. Format output Anda dalam Markdown. Gunakan heading (###), bullet points, dan sertakan contoh kode singkat jika relevan.
5. Jangan berikan salam pengantar atau penutup, langsung berikan panduan solusinya.
`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Anda adalah asisten AI yang ahli dalam audit website dan pengembangan web."
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text() || "Gagal mendapatkan respons dari model.";

    return NextResponse.json({ recommendations: text });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Gagal menghasilkan rekomendasi AI" }, { status: 500 });
  }
}
