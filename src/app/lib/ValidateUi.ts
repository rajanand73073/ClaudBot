import { UISchema } from "../schema/UISchema"
import { z } from "zod"

export type UIPlan = z.infer<typeof UISchema>

export type ValidationResult =
  |{ success: true; data: UIPlan }
  | { success: false; error: z.ZodError }

export function validateUI(input: unknown): ValidationResult {
  const result = UISchema.safeParse(input)
 
  if (!result.success) {
    console.log("resultsuccess",result.error);
    
    return {
      success: false,
      error: result.error
    }
  }
  return {
    success: true,
    data: result.data
  }
}
