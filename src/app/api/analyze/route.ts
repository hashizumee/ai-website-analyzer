import { NextResponse } from "next/server";
import { calculateOverallScore, AnalysisResult, CategoryResult, AnalysisFinding } from "@/lib/scoring";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

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
    
    // Optional API key to prevent rate limiting
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (apiKey) {
      psiApiUrl.searchParams.append("key", apiKey);
    }

    const psiResponse = await fetch(psiApiUrl.toString());
    if (!psiResponse.ok) {
      const err = await psiResponse.json();
      return NextResponse.json({ error: `PageSpeed API Error: ${err.error?.message || psiResponse.statusText}` }, { status: 400 });
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

    const overallScore = calculateOverallScore(categories);

    const result: AnalysisResult = {
      url: validUrl.toString(),
      timestamp: new Date().toISOString(),
      overallScore,
      categories
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
