import { z } from "zod"


export const NavbarSchema = z.object({
  type: z.literal("Navbar"),
  props: z.object({
    title: z.string()
  }).strict()
})

export const SidebarSchema = z.object({
  type: z.literal("Sidebar"),
  props: z.object({
    items: z.array(z.string())
  }).strict()
})

export const CardSchema = z.object({
  type: z.literal("Card"),
  props: z.object({
    title: z.string(),
    content: z.string()
  }).strict()
})

export const ButtonSchema = z.object({
  type: z.literal("Button"),
  props: z.object({
    label: z.string()
  }).strict()
})

export const InputSchema = z.object({
  type: z.literal("Input"),
  props: z.object({
    placeholder: z.string()
  }).strict()
})

export const ModalSchema = z.object({
  type: z.literal("Modal"),
  props: z.object({
    title: z.string(),
    content: z.string()
  }).strict()
})

export const TableSchema = z.object({
  type: z.literal("Table"),
  props: z.object({
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string()))
  }).strict()
})
