import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/app/actions";

export async function GET() {
  const user = await getUser();
  const data = db.read();
  
  // Filter by user if logged in, otherwise just show all or show nothing?
  // Since it's an MVP, let's show all reports if not logged in, or just user's reports.
  let reports = data.reports;
  
  if (user) {
    reports = data.reports.filter(r => r.userId === user.id);
  } else {
    // If not logged in, maybe only show reports that don't belong to any user?
    reports = data.reports.filter(r => !r.userId);
  }

  // Sort by latest
  reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(reports);
}

export async function DELETE() {
  const user = await getUser();
  const data = db.read();
  
  if (user) {
    data.reports = data.reports.filter(r => r.userId !== user.id);
  } else {
    data.reports = data.reports.filter(r => r.userId);
  }
  
  db.write(data);
  return NextResponse.json({ success: true });
}
