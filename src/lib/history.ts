"use client";

import { AnalysisResult } from "./scoring";

export interface HistoryItem {
  url: string;
  overallScore: number;
  timestamp: number;
}

const HISTORY_KEY = "ai_analyzer_history";

export function saveToHistory(result: AnalysisResult) {
  try {
    if (typeof window === "undefined") return;

    const historyData = localStorage.getItem(HISTORY_KEY);
    let history: HistoryItem[] = historyData ? JSON.parse(historyData) : [];

    // Check if URL already exists, if so, remove it to push the fresh one to top
    history = history.filter((item) => item.url !== result.url);

    const newItem: HistoryItem = {
      url: result.url,
      overallScore: result.overallScore,
      timestamp: Date.now(),
    };

    history.unshift(newItem); // Add to beginning

    // Keep only last 20 items to prevent bloat
    if (history.length > 20) {
      history = history.slice(0, 20);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history:", error);
  }
}

export function getHistory(): HistoryItem[] {
  try {
    if (typeof window === "undefined") return [];
    const historyData = localStorage.getItem(HISTORY_KEY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error("Failed to get history:", error);
    return [];
  }
}

export function clearHistory() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(HISTORY_KEY);
    }
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
}
