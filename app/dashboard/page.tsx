"use client"

import { useState } from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

type InvoiceData = {
  id: number
  number: string
  type: "invoice" | "kwitansi"
  customer: string
  amount: number
  status: "unpaid" | "paid" | "overdue"
  date: string
  due_date: string | null
  items: number
}

const sampleData: InvoiceData[] = [
  {
    id: 1,
    number: "INV-2026-001",
    type: "invoice",
    customer: "PT. Maju Jaya",
    amount: 1250000,
    status: "unpaid",
    date: "2026-02-20",
    due_date: "2026-03-20",
    items: 3,
  },
  {
    id: 2,
    number: "KW-2026-001",
    type: "kwitansi",
    customer: "Budi Santoso",
    amount: 250000,
    status: "paid",
    date: "2026-02-25",
    due_date: null,
    items: 1,
  },
  {
    id: 3,
    number: "INV-2026-002",
    type: "invoice",
    customer: "CV. Sukses Selalu",
    amount: 3500000,
    status: "paid",
    date: "2026-01-30",
    due_date: "2026-02-28",
    items: 5,
  },
  {
    id: 4,
    number: "INV-2026-003",
    type: "invoice",
    customer: "Toko Indah",
    amount: 980000,
    status: "overdue",
    date: "2025-12-15",
    due_date: "2026-01-15",
    items: 2,
  },
  {
    id: 5,
    number: "KW-2026-002",
    type: "kwitansi",
    customer: "Sari Alam",
    amount: 500000,
    status: "paid",
    date: "2026-02-10",
    due_date: null,
    items: 1,
  },
  {
    id: 6,
    number: "INV-2026-004",
    type: "invoice",
    customer: "PT. Berkah Abadi",
    amount: 420000,
    status: "unpaid",
    date: "2026-02-28",
    due_date: "2026-03-30",
    items: 2,
  },
]

export default function Page() {
  const [data] = useState<InvoiceData[]>(sampleData)

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />

        {/* Jika mau aktifkan chart, buka comment ini */}
        {/* <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div> */}

        <DataTable data={data} />
      </div>
    </div>
  )
}