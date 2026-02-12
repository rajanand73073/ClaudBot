import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import { validateUI } from "../../lib/ValidateUi"
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const SYSTEM_PROMPT = `
You are a deterministic UI Planner AI.

Your task:
Convert user UI requests into a structured JSON UI plan.

STRICT RULES:
- Output ONLY valid JSON.
- No markdown.
- No explanation.
- No comments.
- No backticks.
- No JSX.
- Do NOT invent components.
- Only use allowed components.

IMPORTANT:
If a previous UI plan is provided:
- Modify the existing plan incrementally.
- Preserve existing components unless explicitly told to remove them.
- Do NOT regenerate the entire layout.
- Only apply the requested changes.
- Maintain structure consistency.

Allowed Components:
- PageLayout
- Section
- Grid
- Navbar
- Sidebar
- Card
- Button
- Input
- Modal
- Table

IMPORTANT:
Every component that requires props MUST include them.
If a component requires props and they are missing, the output will be rejected.

Component Requirements (MANDATORY):

Navbar:
{
  "type": "Navbar",
  "props": {
    "title": "string"
  }
}

Grid:
{
  "type": "Grid",
  "props": {
    "columns": number (1-4)
  },
  "children": [...]
}

Card:
{
  "type": "Card",
  "props": {
    "title": "string",
    "content": "string"
  }
}

DO NOT omit required props.
DO NOT leave props undefined.

`

/**
 * Extract pure JSON safely from LLM output
 */
function extractJSON(text: string): string {
  const firstBrace = text.indexOf("{")
  const lastBrace = text.lastIndexOf("}")
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("Invalid JSON returned by model")
  }
  return text.slice(firstBrace, lastBrace + 1)
}

export async function POST(req: Request) {
  try {
    const { prompt, previousPlan } = await req.json()

    const messages:any  = [
      { role: "system", content: SYSTEM_PROMPT }
    ]

    if (previousPlan) {
      messages.push({
        role: "assistant",
        content: JSON.stringify(previousPlan)
      })
    }

    messages.push({
      role: "user",
      content: prompt
    })

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages
    })

    const rawOutput:string = completion.choices?.[0]?.message?.content as string
    const cleanedJSON = extractJSON(rawOutput)
    const parsed = JSON.parse(cleanedJSON)
    const validatedPlan = validateUI(parsed)
    return NextResponse.json({ plan: validatedPlan })
  } catch (error) {
    console.error("Planner Error:", error)
    return NextResponse.json(
      { error: "Failed to generate UI plan" },
      { status: 500 }
    )
  }
}
