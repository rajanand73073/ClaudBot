"use client"

import { useState } from "react"
import axios, { AxiosError } from "axios"
import { renderUIElement } from "../app/lib/RenderUi"

type UIElement = any

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [versions, setVersions] = useState<UIElement[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const [explanation, setExplanation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentPlan =
    currentIndex >= 0 ? versions[currentIndex] : null

  /**
   * Generate or Modify Plan
   */
  const handleGenerate = async () => {
    if (!prompt.trim()) return

    try {
      setIsLoading(true)
      setError(null)

      const previousPlan =
        currentIndex >= 0 ? versions[currentIndex] : null

      // 🔥 Planner Call
      const plannerRes = await axios.post("/api/plan", {
        prompt,
        previousPlan
      })

      const newPlan = plannerRes.data.plan

      // 🔥 Prevent history branching corruption
      setVersions(prev => {
        const base = prev.slice(0, currentIndex + 1)
        return [...base, newPlan]
      })

      setCurrentIndex(prev => prev + 1)

      // 🔥 Explainer Call
      const explainRes = await axios.post("/api/explain", {
        prompt,
        newPlan,
        previousPlan
      })

      setExplanation(explainRes.data.explanation)

      setPrompt("")
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.error ||
          err.message ||
          "Something went wrong"
        )
      } else {
        setError("Unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Rollback to specific version
   */
  const handleRollback = (index: number) => {
    setCurrentIndex(index)
    setExplanation("Rolled back to selected version.")
  }

  /**
   * Reset Everything
   */
  const handleReset = () => {
    setVersions([])
    setCurrentIndex(-1)
    setExplanation("")
    setPrompt("")
    setError(null)
  }

  return (
    <div className="p-6 space-y-6">

      {/* Prompt Section */}
      <div className="flex gap-2">
        <input
          className="border px-3 py-2 w-full rounded"
          placeholder="Describe your UI..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Version History */}
      {versions.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {versions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleRollback(index)}
              className={`px-3 py-1 rounded text-sm ${
                index === currentIndex
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
            >
              Version {index}
            </button>
          ))}
        </div>
      )}

      {/* Rendered UI */}
      <div className="border p-4 min-h-[300px] bg-white rounded">
        {currentPlan
          ? renderUIElement(currentPlan)
          : "No UI generated yet."}
      </div>

      {/* Explanation Section */}
      {explanation && (
        <div className="bg-gray-50 p-4 rounded text-sm">
          <h3 className="font-semibold mb-2">
            Explanation
          </h3>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  )
}
