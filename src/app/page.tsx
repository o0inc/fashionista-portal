"use client";  // ✅ Must be the first line (No spaces above!)

import { useEffect } from "react";
import { testOpenAIConnection } from "@/lib/openai";

export default function Home() {
  useEffect(() => {
    testOpenAIConnection();  // 🔥 Calls OpenAI API on page load
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>🚀 Fashionista Portal</h1>
      <p>🔥 OpenAI Test Triggered! Check Console Logs.</p>
    </div>
  );
}
