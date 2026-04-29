/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { DataTable, type InvoiceRow } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

type DashboardStats = {
  totalRevenue: number
  totalInvoices: number
  unpaidInvoices: number
  totalCustomers: number
}

function computeStats(rows: InvoiceRow[]): DashboardStats {
  const totalRevenue = rows.reduce((sum, row) => sum + row.amount, 0)

  const invoiceRows = rows.filter((row) => row.type === "invoice")
  const totalInvoices = invoiceRows.length
  const unpaidInvoices = invoiceRows.filter(
    (row) => row.status === "unpaid" || row.status === "overdue"
  ).length

  const totalCustomers = new Set(
    rows.map((row) => row.customer).filter(Boolean)
  ).size

  return {
    totalRevenue,
    totalInvoices,
    unpaidInvoices,
    totalCustomers,
  }
}

export default function Page() {
  const [data, setData] = useState<InvoiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalInvoices: 0,
    unpaidInvoices: 0,
    totalCustomers: 0,
  })

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true)

      const [invoiceRes, receiptRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch("/api/receipts"),
      ])

      const [invoices, receipts] = await Promise.all([
        invoiceRes.json(),
        receiptRes.json(),
      ])

      const invoiceRows: InvoiceRow[] = (invoices || []).map((item: any) => ({
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

      const receiptRows: InvoiceRow[] = (receipts || []).map((item: any) => ({
        id: String(item._id),
        number: item.receipt_number,
        type: "kwitansi",
        customer:
          item.computed?.received_from || item.receipt?.received_from || "-",
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

      setData(merged)
      setStats(computeStats(merged))
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      toast.error("Gagal memuat dashboard")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const handleDelete = useCallback(
    async (id: string, type: "invoice" | "kwitansi") => {
      const loadingToast = toast.loading("Menghapus data...")

      try {
        const endpoint =
          type === "invoice"
            ? `/api/invoices/${id}`
            : `/api/receipts/${id}`

        const res = await fetch(endpoint, {
          method: "DELETE",
        })

        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.message || "Gagal menghapus data")
        }

        setData((prev) => {
          const next = prev.filter((item) => item.id !== id)
          setStats(computeStats(next))
          return next
        })

        toast.success(result.message || "Berhasil dihapus", {
          id: loadingToast,
        })
      } catch (error: any) {
        toast.error(error.message || "Gagal menghapus data", {
          id: loadingToast,
        })
        throw error
      }
    },
    []
  )

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
            <DataTable data={data} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  )
}