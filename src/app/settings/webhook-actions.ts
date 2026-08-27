"use server";

import { db } from "@/lib/db";
import { getUser } from "@/app/actions";
import crypto from "crypto";

export async function saveWebhookSettings(url: string, threshold: number) {
  const user = await getUser();
  const userId = user ? user.id : "anonymous";
  
  const data = db.read();
  const existingIndex = data.webhooks.findIndex(w => (w as any).userId === userId);
  
  if (existingIndex >= 0) {
    data.webhooks[existingIndex] = { ...data.webhooks[existingIndex], url, threshold };
  } else {
    data.webhooks.push({
      id: crypto.randomUUID(),
      url,
      threshold,
      ...({ userId } as any)
    });
  }
  
  db.write(data);
  return { success: true };
}

export async function getWebhookSettings() {
  const user = await getUser();
  const userId = user ? user.id : "anonymous";
  
  const data = db.read();
  const webhook = data.webhooks.find(w => (w as any).userId === userId);
  return webhook || null;
}
