import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const SYSTEM_PROMPT = `
You are a UI Explanation AI.

Your job:
Explain UI plan decisions clearly.

Two modes:

1. If only a new plan is provided:
   - Explain layout choice
   - Explain component selection
   - Explain structure

2. If both previous plan and new plan are provided:
   - Explain what changed
   - Explain what was preserved
   - Explain why the changes were made
   - Be concise and structured

Rules:
- Plain text only.
- No markdown.
- No JSON.
`

export async function POST(req: Request) {
  try {
    const { prompt, newPlan, previousPlan } = await req.json()

    if (!prompt || !newPlan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const userContent = previousPlan
      ? `
User Request:
${prompt}

Previous Plan:
${JSON.stringify(previousPlan, null, 2)}

Updated Plan:
${JSON.stringify(newPlan, null, 2)}

Explain what changed and why.
`
      : `
User Request:
${prompt}

Generated Plan:
${JSON.stringify(newPlan, null, 2)}

Explain the reasoning behind this design.
`

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent }
      ]
    })

    const explanation = completion.choices?.[0]?.message?.content
    return NextResponse.json({ explanation })
  } catch (error) {
    console.error("Explainer Error:", error)
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    )
  }
}
