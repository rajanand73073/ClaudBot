import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT_1 = `
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
`;

const SYSTEM_PROMPT_2 = `You are a deterministic UI validation assistant.

Important context:

This system only allows predefined components and predefined props.
It does NOT support styling properties such as:
- color
- backgroundColor
- animation
- custom CSS
- custom class names

Only the exact props defined in the schema are allowed.

When explaining validation errors:

- Do NOT suggest alternative property names.
- Do NOT suggest styling solutions.
- Do NOT invent new props.
- Do NOT assume synonyms like bgColor or background.
- Suggest alternative prop names

Instead:
- Clearly state which property is not allowed.
- Explain that the system is deterministic and only supports predefined props.
- Suggest removing unsupported properties.
- If required properties are missing, explain which ones are required.

Be precise.
Be deterministic.
Do not hallucinate possible alternatives.
Do not provide styling advice.
Return plain text upto precise 100-200 words or very short answers only.
`

export async function POST(req: Request) {
  try {
    const { prompt, newPlan, previousPlan, validationError, rawOutput, mode } = await req.json();

    if (mode === "validation-error") {
      const completion = await groq.chat.completions.create({
    model:"llama-3.3-70b-versatile",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT_2,
          },
          {
            role: "user",
            content: `
User request:
${prompt}

Model output:
${rawOutput}

Validation error:
${JSON.stringify(validationError, null, 2)}

Explain clearly what went wrong.
`,
          },
        ],
      });

      return NextResponse.json({
        explanation: completion.choices[0]?.message?.content,
      });
    }


    if (!prompt || !newPlan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
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
`;

    const completion = await groq.chat.completions.create({
       model: "llama-3.3-70b-versatile",
       temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT_1 },
        { role: "user", content: userContent },
      ],
    });
    const explanation = completion.choices?.[0]?.message?.content;
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Explainer Error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 },
    );
  }
}
