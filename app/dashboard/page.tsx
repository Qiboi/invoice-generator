/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useMemo, useState } from "react"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

type DashboardRow = {
  id: string
  number: string
  type: "invoice" | "kwitansi"
  customer: string
  amount: number
  status: "draft" | "paid" | "unpaid" | "overdue"
  date: string
  due_date: string | null
  items: number
}

type DashboardStats = {
  totalRevenue: number
  totalInvoices: number
  unpaidInvoices: number
  totalCustomers: number
}

export default function Page() {
  const [data, setData] = useState<DashboardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalInvoices: 0,
    unpaidInvoices: 0,
    totalCustomers: 0,
  })

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [invoiceRes, receiptRes] = await Promise.all([
          fetch("/api/invoices"),
          fetch("/api/receipts"),
        ])

        const [invoices, receipts] = await Promise.all([
          invoiceRes.json(),
          receiptRes.json(),
        ])

        const invoiceRows: DashboardRow[] = (invoices || []).map((item: any) => ({
          id: String(item._id),
          number: item.invoice_number,
          type: "invoice",
          customer: item.invoice?.bill_to?.name || "-",
          amount: item.computed?.total || 0,
          status: item.status || "draft",
          date:
            item.computed?.issue_date ||
            item.invoice?.issue_date ||
            new Date(item.createdAt).toISOString().slice(0, 10),
          due_date: item.computed?.due_date || item.invoice?.due_date || null,
          items: item.computed?.items?.length || item.invoice?.items?.length || 0,
        }))

        const receiptRows: DashboardRow[] = (receipts || []).map((item: any) => ({
          id: String(item._id),
          number: item.receipt_number,
          type: "kwitansi",
          customer: item.computed?.received_from || item.receipt?.received_from || "-",
          amount: item.computed?.total_price || 0,
          status: "paid",
          date:
            item.computed?.date_of_issue ||
            item.receipt?.date_of_issue ||
            new Date(item.createdAt).toISOString().slice(0, 10),
          due_date: null,
          items: 1,
        }))

        const merged = [...invoiceRows, ...receiptRows].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

        const totalRevenue = merged.reduce((sum, row) => sum + row.amount, 0)
        const totalInvoices = invoiceRows.length
        const unpaidInvoices = invoiceRows.filter(
          (row) => row.status === "unpaid" || row.status === "overdue"
        ).length

        const totalCustomers = new Set(
          merged.map((row) => row.customer).filter(Boolean)
        ).size

        setData(merged)
        setStats({
          totalRevenue,
          totalInvoices,
          unpaidInvoices,
          totalCustomers,
        })
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const tableData = useMemo(() => data, [data])

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards
          totalRevenue={stats.totalRevenue}
          totalInvoices={stats.totalInvoices}
          unpaidInvoices={stats.unpaidInvoices}
          totalCustomers={stats.totalCustomers}
        />

        <div className="px-4 lg:px-6">
          {loading ? (
            <div className="rounded-2xl border bg-background p-6 text-sm text-muted-foreground">
              Loading dashboard...
            </div>
          ) : (
            <DataTable data={tableData} />
          )}
        </div>
      </div>
    </div>
  )
}