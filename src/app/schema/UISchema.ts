import { z } from "zod"
import {
  TableSchema,
  ModalSchema,
  InputSchema,
  ButtonSchema,
  CardSchema,
  SidebarSchema,
  NavbarSchema,
} from "./ComponentsSchema"


export const UISchema: z.ZodType<any> = z.lazy(() =>
  z.discriminatedUnion("type", [

    z.object({
      type: z.literal("PageLayout"),
      props: z.object({}).optional(),
      children: z.array(UISchema),
    }).strict(),

    z.object({
      type: z.literal("Section"),
      props: z.object({
        title: z.string().optional(),
      }).strict().optional(),
      children: z.array(UISchema),
    }).strict(),

    z.object({
      type: z.literal("Grid"),
      props: z.object({
        columns: z.number().min(1).max(4),
      }).strict(),
      children: z.array(UISchema),
    }).strict(),

    NavbarSchema,
    SidebarSchema,
    CardSchema,
    ButtonSchema,
    InputSchema,
    ModalSchema,
    TableSchema,
  ])
)

