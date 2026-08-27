export type Category = "SEO" | "Performance" | "Accessibility" | "Security" | "Best Practices";

export interface AnalysisFinding {
  title: string;
  description: string;
  status: "pass" | "fail" | "warning";
  priority?: "Critical" | "High" | "Medium" | "Low";
}

export interface CategoryResult {
  score: number;
  findings: AnalysisFinding[];
}

export interface AnalysisResult {
  url: string;
  timestamp: string;
  overallScore: number;
  categories: {
    seo: CategoryResult;
    performance: CategoryResult;
    accessibility: CategoryResult;
    security: CategoryResult;
  };
  isFallback?: boolean;
  prdContext?: string;
}

export function calculateOverallScore(categories: AnalysisResult['categories']): number {
  const { seo, performance, accessibility, security } = categories;
  // Rata-rata sederhana untuk MVP
  const total = seo.score + performance.score + accessibility.score + security.score;
  return Math.round(total / 4);
}

export function getScoreStatus(score: number): { label: string; colorClass: string; bgClass: string } {
  if (score >= 90) return { label: "Excellent", colorClass: "text-green-500", bgClass: "bg-green-500" };
  if (score >= 80) return { label: "Good", colorClass: "text-blue-500", bgClass: "bg-blue-500" };
  if (score >= 60) return { label: "Needs Improvement", colorClass: "text-yellow-500", bgClass: "bg-yellow-500" };
  return { label: "Poor", colorClass: "text-red-500", bgClass: "bg-red-500" };
}
