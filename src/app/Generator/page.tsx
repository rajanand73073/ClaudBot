"use client"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { motion } from "framer-motion"
import { renderUIElement } from "../lib/RenderUi"

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [plan, setPlan] = useState<any | null>(null)
  const [explanation, setExplanation] = useState("")
  const [versions, setVersions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function sanitizePrompt(input: string) {
    return input.trim()
  }

  async function handleGenerate() {
    const cleanPrompt = sanitizePrompt(prompt)

    if (!cleanPrompt) return

    setLoading(true)
    setError("")

    try {
      const previousPlan =
        versions.length > 0 ? versions[versions.length - 1] : null

      const planRes = await axios.post("/api/plan", {
        prompt: cleanPrompt,
        previousPlan
      })

      if (!planRes.data || !planRes.data.plan) {
        throw new Error("Planner did not return a valid plan")
      }

      const newPlan = planRes.data.plan

      if (typeof newPlan !== "object" || !newPlan.type) {
        throw new Error("Invalid plan structure")
      }

      // Save new version
      setVersions((prev) => [...prev, newPlan])
      setPlan(newPlan)

      const explainRes = await axios.post("/api/explain", {
        prompt: cleanPrompt,
        newPlan,
        previousPlan
      })

      if (explainRes.data?.explanation) {
        setExplanation(explainRes.data.explanation)
      } else {
        setExplanation("No explanation generated.")
      }

      setPrompt("")
    } catch (err) {
      const axiosError = err as AxiosError<any>

      if (axiosError.response) {
        setError(
          axiosError.response.data?.error ||
            "Server error occurred."
        )
      } else if (axiosError.request) {
        setError("Network error. Please try again.")
      } else {
        setError(err instanceof Error ? err.message : "Unexpected error.")
      }
    } finally {
      setLoading(false)
    }
  }

  function handleRollback(index: number) {
    const selected = versions[index]
    setPlan(selected)
    setVersions(versions.slice(0, index + 1))
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">

      {/* 🔹 TOP INPUT BAR */}
      <div className="border-b bg-white px-6 py-4 shadow-sm">
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
          <p className="text-red-600 text-sm mt-2 max-w-6xl mx-auto">
            {error}
          </p>
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
<div className="flex-1 flex justify-center overflow-auto p-10">

<div className="w-full max-w-6xl bg-gray-100 rounded-3xl p-12 shadow-inner">
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
    </div>
  )
}
