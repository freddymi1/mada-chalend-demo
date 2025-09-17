import type React from "react"
import { Metadata } from "next"
import WithMenuLayoutClient from "@/components/admin/WithMenuLayoutClient"

export const metadata: Metadata = {
  title: "Mada Chaland - Dashboard Admin",
  description: "Tableau de bord d'administration de Mada Chaland",
}

export default function WithMenuLayout({ children }: { children: React.ReactNode }) {
  return <WithMenuLayoutClient>{children}</WithMenuLayoutClient>
}
