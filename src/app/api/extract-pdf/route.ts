import { NextResponse } from "next/server";
import * as pdfParseModule from "pdf-parse";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Some versions of pdf-parse export the function as default, some as the module itself
    const pdf = (pdfParseModule as any).default || pdfParseModule;
    const data = await pdf(buffer);
    
    return NextResponse.json({ text: data.text });
  } catch (error: any) {
    console.error("PDF Extraction error:", error);
    return NextResponse.json({ error: "Failed to extract PDF" }, { status: 500 });
  }
}
