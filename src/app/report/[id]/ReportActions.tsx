"use client";

import { Share2, Download, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ReportActions() {
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleDownload = async () => {
    // Import html2pdf dynamically to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('report-content');
    if (!element) return;
    
    const opt = {
      margin:       0.5,
      filename:     `analysis-report.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0b0f19' },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex items-center space-x-3">
      <button 
        onClick={handleShare}
        className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
      >
        {shared ? <CheckCircle className="w-4 h-4 mr-2 text-teal-400" /> : <Share2 className="w-4 h-4 mr-2" />}
        {shared ? "Tersalin!" : "Bagikan Laporan"}
      </button>
      <button 
        onClick={handleDownload}
        className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Unduh PDF
      </button>
    </div>
  );
}
