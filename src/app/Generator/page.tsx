"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";
import { renderUIElement } from "../lib/RenderUi";

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<any | null>(null);
  const [explanation, setExplanation] = useState("");
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;
    setLoading(true);
    setError("");
    try {
      const previousPlan = versions.length > 0 ? versions[versions.length - 1] : null;

      const planRes = await axios.post("/api/plan", {
        prompt: cleanPrompt,
        previousPlan,
      });
      
      console.log("planRes",planRes.data.plan.data)
    

      const newPlan = planRes.data.plan.data;
        if (!newPlan) {
          throw new Error("Planner returned malformed response.");
}

      setVersions((prev) => [...prev, newPlan]);
      setPlan(newPlan);
      const explainRes = await axios.post("/api/explain", {
        prompt: cleanPrompt,
        newPlan,
        previousPlan,
      });

      if (explainRes.data?.explanation) {
        setExplanation(explainRes.data.explanation);
      } else {
        setExplanation("No explanation generated.");
      }

      setPrompt("");
    } catch (err) {
      const axiosError = err as AxiosError<any>;
     if (axiosError.response) {
    const data = axiosError.response.data

  if (data.details) {
    try {
      const explainRes = await axios.post("/api/explain", {
        mode: "validation-error",
        prompt: cleanPrompt,
        validationError: data.details,
        rawOutput: data.rawOutput
      })

      setError(explainRes.data.explanation)

    } catch (explainErr) {
      setError("Validation failed, and explanation could not be generated.")
    }
  } else {
    setError(data.error || "Planner failed.")
  }}
}
finally {
      setLoading(false);
    }
  }

  function handleRollback(index: number) {
    const selected = versions[index];
    setPlan(selected);
    setVersions(versions.slice(0, index + 1));
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* 🔹 TOP INPUT BAR */}
      <div className="relative border-b bg-white px-6 py-4 shadow-sm">
        <div className="absolute right-6 top-4 flex gap-3 items-center">
          {versions.length > 1 && (
            <>
              {versions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setPlan(versions[index]);
                  }}
                  className="text-xs border-0 px-3 py-1 rounded-full text-black hover:bg-gray-200 hover:text-pink-600"
                >
                  v{index + 1}
                </button>
              ))}
            </>
          )}
        </div>

        <div className="max-w-6xl mx-auto flex gap-4 items-center">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe or modify your UI..."
            className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-900"
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            onClick={handleGenerate}
            className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Generate"}
          </motion.button>
        </div>

       {error && (
         <div className="bg-red-50 border border-red-200 text-red-700 text-sm mt-4 p-4 rounded-lg whitespace-pre-wrap">
           {error}
             </div>
)}

      </div>

      {/* 🔹 MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-96 bg-white border-r flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              AI Explanation
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
            {explanation || "Explanation will appear here..."}
          </div>

          {versions.length > 1 && (
            <div className="p-4 border-t">
              <h3 className="text-xs font-semibold text-gray-600 mb-2">
                Versions
              </h3>
              <div className="flex flex-wrap gap-2">
                {versions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleRollback(index)}
                    className="text-xs px-3 py-1 bg-pink-100 rounded-full hover:bg-pink-200"
                  >
                    v{index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PREVIEW PANEL */}
        <div className="w-full max-w-6xl bg-gray-100 rounded-3xl p-12 shadow-inner overflow-auto">
          {plan ? (
            <motion.div
              key={JSON.stringify(plan)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {renderUIElement(plan)}
            </motion.div>
          ) : (
            <div className="text-gray-600 text-center mt-20">
              Your UI preview will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
