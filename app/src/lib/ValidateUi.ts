import { UISchema } from "../schema/UISchema"
import { z } from "zod"


//  Infer TypeScript type from schema
export type UIPlan = z.infer<typeof UISchema>


export function validateUI(input: unknown): UIPlan | undefined {
  try {
    const result = UISchema.safeParse(input)
    if (!result.success) {
      const formattedErrors = result.error.issues
      console.error(formattedErrors)
      return undefined
    }
    return result.data
  } catch (error) {
    console.error("Validation error:", error)
    return undefined
  }
}
