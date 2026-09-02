import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import crypto from "crypto";
import { db } from "@/lib/db";
import { getUser } from "@/app/actions";
import { calculateOverallScore, AnalysisResult, CategoryResult, AnalysisFinding } from "@/lib/scoring";

export async function POST(req: Request) {
  try {
    const { url, prdContext, isDeepCrawl, apiKey } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (validUrl.protocol !== "http:" && validUrl.protocol !== "https:") {
      return NextResponse.json({ error: "Only HTTP/HTTPS protocols are supported" }, { status: 400 });
    }

    // Call Google PageSpeed Insights API
    const psiApiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    psiApiUrl.searchParams.append("url", validUrl.toString());
    psiApiUrl.searchParams.append("strategy", "desktop");
    psiApiUrl.searchParams.append("category", "performance");
    psiApiUrl.searchParams.append("category", "accessibility");
    psiApiUrl.searchParams.append("category", "best-practices");
    psiApiUrl.searchParams.append("category", "seo");
    
    // Use user-provided API key first, then fallback to env
    const activeApiKey = apiKey || process.env.GOOGLE_PAGESPEED_API_KEY;
    if (activeApiKey) {
      psiApiUrl.searchParams.append("key", activeApiKey);
    }

    const psiResponse = await fetch(psiApiUrl.toString());
    if (!psiResponse.ok) {
      console.warn("PageSpeed API Error or Quota Exceeded.");
      return NextResponse.json(
        { error: "Limit penggunaan API Google PageSpeed telah tercapai. Silakan coba beberapa saat lagi atau masukkan API Key di menu Pengaturan." },
        { status: 429 }
      );
    }

    const psiData = await psiResponse.json();
    const lh = psiData.lighthouseResult;

    if (!lh || !lh.categories) {
      return NextResponse.json({ error: "Invalid response from PageSpeed API" }, { status: 500 });
    }

    // Helper to map audit results to findings
    const mapAuditsToFindings = (auditRefs: any[]): AnalysisFinding[] => {
      const findings: AnalysisFinding[] = [];
      
      auditRefs?.forEach((ref: any) => {
        const audit = lh.audits[ref.id];
        if (!audit) return;
        
        // Skip audits that are not applicable or don't have a score/scoreDisplayMode
        if (audit.scoreDisplayMode === "notApplicable" || audit.scoreDisplayMode === "informative") return;

        let status: "pass" | "fail" | "warning" = "pass";
        let priority: "Critical" | "High" | "Medium" | "Low" | undefined = undefined;

        if (audit.score !== null) {
          if (audit.score < 0.5) {
            status = "fail";
            priority = ref.weight > 3 ? "Critical" : "High";
          } else if (audit.score < 0.9) {
            status = "warning";
            priority = ref.weight > 2 ? "High" : "Medium";
          }
        }

        // Only include warnings or fails, or heavily weighted passes to keep payload manageable
        if (status !== "pass" || ref.weight > 3) {
          findings.push({
            title: audit.title,
            description: audit.description.split(" [Learn more]")[0],
            status,
            priority
          });
        }
      });
      return findings.sort((a, b) => (a.status === "fail" ? -1 : 1));
    };

    const seoResult: CategoryResult = {
      score: Math.round(lh.categories.seo.score * 100),
      findings: mapAuditsToFindings(lh.categories.seo.auditRefs)
    };

    const performanceResult: CategoryResult = {
      score: Math.round(lh.categories.performance.score * 100),
      findings: mapAuditsToFindings(lh.categories.performance.auditRefs)
    };

    const accessibilityResult: CategoryResult = {
      score: Math.round(lh.categories.accessibility.score * 100),
      findings: mapAuditsToFindings(lh.categories.accessibility.auditRefs)
    };

    // Lighthouse 'Best Practices' maps closely to our 'Security' & Code Quality checks
    const securityResult: CategoryResult = {
      score: Math.round(lh.categories['best-practices'].score * 100),
      findings: mapAuditsToFindings(lh.categories['best-practices'].auditRefs)
    };

    const categories = {
      seo: seoResult,
      performance: performanceResult,
      accessibility: accessibilityResult,
      security: securityResult
    };

    let overallScore = calculateOverallScore(categories);

    let crawledPages: string[] = [];
    if (isDeepCrawl) {
      try {
        const pageRes = await fetch(validUrl.toString());
        const html = await pageRes.text();
        const $ = cheerio.load(html);
        
        const links = new Set<string>();
        $('a').each((_, el) => {
          const href = $(el).attr('href');
          if (href) {
            try {
              const fullUrl = new URL(href, validUrl.toString());
              if (fullUrl.hostname === validUrl.hostname && fullUrl.pathname !== validUrl.pathname) {
                links.add(fullUrl.pathname);
              }
            } catch (e) {}
          }
        });
        
        crawledPages = Array.from(links).slice(0, 5); // Ambil maks 5 halaman
        
        // Simulasikan pengurangan performa jika ada banyak halaman (untuk efek Deep Crawl)
        if (crawledPages.length > 0) {
          overallScore = Math.max(0, overallScore - 2); // Penalty ringan
          categories.seo.findings.unshift({
            title: "Deep Crawl Discovered Pages",
            description: `Ditemukan ${crawledPages.length} sub-halaman: ${crawledPages.join(', ')}`,
            status: "pass",
            priority: "Low"
          });
        }
      } catch (err) {
        console.warn("Deep crawl failed:", err);
      }
    }

    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      url: validUrl.toString(),
      timestamp: new Date().toISOString(),
      overallScore,
      categories,
      prdContext: prdContext || "",
      crawledPages: crawledPages.length > 0 ? crawledPages : undefined
    };

    // Save to DB
    const data = db.read();
    data.reports.push({
      id: result.id as string,
      url: result.url,
      overallScore: result.overallScore,
      categories: result.categories,
      prdContext: result.prdContext,
      crawledPages: result.crawledPages,
      isFallback: false,
      createdAt: result.timestamp
    });
    
    // Webhook Logic
    const user = await getUser();
    const userId = user ? user.id : "anonymous";
    const webhook = data.webhooks.find(w => (w as any).userId === userId);
    
    if (webhook && webhook.url && result.overallScore < webhook.threshold) {
      try {
        await fetch(webhook.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `⚠️ **Website Analysis Alert**\nURL: ${result.url}\nScore: **${result.overallScore}** (Threshold: ${webhook.threshold})\nView Report: https://your-domain.com/report/${result.id}`
          })
        });
      } catch (err) {
        console.warn("Failed to trigger webhook", err);
      }
    }
    
    db.write(data);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
