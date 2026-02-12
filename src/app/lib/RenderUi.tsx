'use client"'

import React from "react"
import { z } from "zod"
import { PageLayout } from "../components/ui/PageLayout"
import { Section } from "../components/ui/Section"
import { Grid } from "../components/ui/Grid"
import { Navbar } from "../components/ui/Navbar"
import { Sidebar } from "../components/ui/Sidebar"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Modal } from "../components/ui/Modal"
import { Table } from "../components/ui/Table"
import { UISchema } from "../schema/UISchema"


const ComponentRegistry: Record<string, React.ElementType> = {
  PageLayout,
  Section,
  Grid,
  Navbar,
  Sidebar,
  Card,
  Button,
  Input,
  Modal,
  Table
}

type UIElement = z.infer<typeof UISchema>

export function renderUIElement(node: UIElement): React.ReactNode {
  if (!node || typeof node !== "object") return null

const { type } = node
const props = "props" in node ? node.props  : {}
const children = "children" in node ? node.children : []

  const Component = ComponentRegistry[type]

  if (!Component) {
    console.error(`Component "${type}" is not registered.`)
    return null
  }

  const renderedChildren =
    children?.map((child: UIElement, index: number) => (
      <React.Fragment key={index}>
        {renderUIElement(child)}
      </React.Fragment>
    )) ?? null

  return (
    <Component {...props}>
      {renderedChildren}
    </Component>
  )
}
