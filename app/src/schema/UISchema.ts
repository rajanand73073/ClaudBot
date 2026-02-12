import { z } from "zod";
import {
  TableSchema,
  ModalSchema,
  InputSchema,
  ButtonSchema,
  CardSchema,
  SidebarSchema,
  NavbarSchema,
} from "./ComponentsSchema";
export type UIElement =
  | {
      type: "PageLayout"
      children: UIElement[]
    }
  | {
      type: "Section"
      props?: { title?: string }
      children: UIElement[]
    }
  | {
      type: "Grid"
      props: { columns: number }
      children: UIElement[]
    }
  | z.infer<typeof NavbarSchema>
  | z.infer<typeof SidebarSchema>
  | z.infer<typeof CardSchema>
  | z.infer<typeof ButtonSchema>
  | z.infer<typeof InputSchema>
  | z.infer<typeof ModalSchema>
  | z.infer<typeof TableSchema>


export const UISchema: z.ZodType<UIElement> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z
      .object({
        type: z.literal("PageLayout"),
        children: z.array(UISchema),
      })
      .strict(),

    z
      .object({
        type: z.literal("Section"),
        props: z
          .object({
            title: z.string().optional(),
          })
          .strict()
          .optional(),
        children: z.array(UISchema),
      })
      .strict(),

    z
      .object({
        type: z.literal("Grid"),
        props: z
          .object({
            columns: z.number().min(1).max(4),
          })
          .strict(),
        children: z.array(UISchema),
      })
      .strict(),

    NavbarSchema,
    SidebarSchema,
    CardSchema,
    ButtonSchema,
    InputSchema,
    ModalSchema,
    TableSchema,
  ]),
);
