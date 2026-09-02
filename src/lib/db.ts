import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'local-database.json');

export interface User {
  id: string;
  email: string;
  password?: string;
  name?: string;
}

export interface AnalysisReportRecord {
  id: string;
  url: string;
  overallScore: number;
  categories: any;
  findings?: any;
  prdContext?: string;
  crawledPages?: string[];
  isFallback: boolean;
  createdAt: string;
  userId?: string;
}

export interface WebhookSetting {
  id: string;
  url: string;
  threshold: number;
}

export interface DbSchema {
  users: User[];
  reports: AnalysisReportRecord[];
  webhooks: WebhookSetting[];
}

function initDb(): DbSchema {
  if (!fs.existsSync(dbPath)) {
    const initial: DbSchema = { users: [], reports: [], webhooks: [] };
    try {
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
    } catch (err) {
      console.warn("Failed to create local DB file (Read-only file system?):", err);
    }
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch {
    return { users: [], reports: [], webhooks: [] };
  }
}

function saveDb(data: DbSchema) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn("Failed to write to local DB (Read-only file system?):", err);
  }
}

export const db = {
  read: initDb,
  write: saveDb,
};
