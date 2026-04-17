/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"
import { ArrowUpRight, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type InvoiceStatus = "draft" | "paid" | "unpaid" | "overdue"

type InvoiceData = {
    id: string
    number: string
    customer: string
    amount: number
    status: InvoiceStatus
    date: string
    due_date: string | null
}

function formatIDR(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value)
}

function statusClass(status: InvoiceStatus) {
    switch (status) {
        case "paid":
            return "bg-green-100 text-green-700 border-green-200"
        case "unpaid":
            return "bg-yellow-100 text-yellow-700 border-yellow-200"
        case "overdue":
            return "bg-red-100 text-red-700 border-red-200"
        case "draft":
            return "bg-gray-100 text-gray-700 border-gray-200"
        default:
            return "bg-gray-100 text-gray-700 border-gray-200"
    }
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<InvoiceData[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch("/api/invoices")
                const json = await res.json()

                const mapped: InvoiceData[] = json.map((inv: any) => ({
                    id: inv._id,
                    number: inv.invoice_number,
                    customer: inv.invoice?.bill_to?.name || "-",
                    amount: inv.computed?.total || 0,
                    status: inv.status || "draft",
                    date: new Date(inv.createdAt).toLocaleDateString("id-ID"),
                    due_date: inv.invoice?.due_date || null,
                }))

                setInvoices(mapped)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchInvoices()
    }, [])

    // ====== STATS ======
    const totalInvoice = invoices.length
    const paidCount = invoices.filter((i) => i.status === "paid").length
    const unpaidCount = invoices.filter((i) => i.status === "unpaid").length
    const overdueCount = invoices.filter((i) => i.status === "overdue").length
    const totalAmount = invoices.reduce((acc, item) => acc + item.amount, 0)

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            {/* HEADER */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola seluruh data invoice pada sistem.
                    </p>
                </div>

                <Link
                    href="/dashboard/invoices/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                    <Plus className="h-4 w-4" />
                    Buat Invoice
                </Link>
            </div>

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">Total Invoice</p>
                    <h2 className="mt-2 text-2xl font-bold">{totalInvoice}</h2>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">Total Nominal</p>
                    <h2 className="mt-2 text-2xl font-bold">{formatIDR(totalAmount)}</h2>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <h2 className="mt-2 text-2xl font-bold">{paidCount}</h2>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">Overdue</p>
                    <h2 className="mt-2 text-2xl font-bold">{overdueCount}</h2>
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-2xl border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b p-5">
                    <div>
                        <h2 className="text-lg font-semibold">Daftar Invoice</h2>
                        <p className="text-sm text-muted-foreground">
                            Menampilkan invoice terbaru dan status pembayarannya.
                        </p>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        Refresh
                        <ArrowUpRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-6 text-sm text-muted-foreground">
                            Loading...
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/40 text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-3">No</th>
                                    <th className="px-5 py-3">Invoice</th>
                                    <th className="px-5 py-3">Customer</th>
                                    <th className="px-5 py-3">Tanggal</th>
                                    <th className="px-5 py-3">Jatuh Tempo</th>
                                    <th className="px-5 py-3">Total</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {invoices.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => (router.push(`/dashboard/invoices/${item.id}`))}
                                        className="border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition"
                                    >
                                        <td className="px-5 py-4">{index + 1}</td>
                                        <td className="px-5 py-4 font-medium">{item.number}</td>
                                        <td className="px-5 py-4">{item.customer}</td>
                                        <td className="px-5 py-4">{item.date}</td>
                                        <td className="px-5 py-4">{item.due_date ?? "-"}</td>
                                        <td className="px-5 py-4">{formatIDR(item.amount)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusClass(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}