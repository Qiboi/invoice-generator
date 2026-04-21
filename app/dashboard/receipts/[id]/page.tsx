"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import ReceiptPreview from "@/components/receipt-preview"
import { type ReceiptComputed } from "@/lib/receipt"

type ReceiptDB = {
    _id: string
    receipt_number: string
    receipt: {
        receipt_number?: string
        received_from: string
        payment_for: string
        amount_numeric: number
        tax_percent: number
        place_of_issue: string
        date_of_issue: string
        recipient_name_printed: string
    }
    companyInfo: {
        name: string
        address: string
        phone: string
        bank_account?: string
    }
    computed: ReceiptComputed
}

function exportReceiptWithPrintSize() {
    const printPageSize = "315mm 100mm"
    const printMargin = "5mm"

    const styleId = "injected-print-page-size"
    const existing = document.getElementById(styleId)
    if (existing) existing.remove()

    const styleEl = document.createElement("style")
    styleEl.id = styleId

    const marginRule = printMargin ? `margin: ${printMargin};` : ""
    styleEl.textContent = `@page { size: ${printPageSize}; ${marginRule} }`

    document.head.appendChild(styleEl)

    const cleanup = () => {
        setTimeout(() => {
            const el = document.getElementById(styleId)
            if (el) el.remove()
        }, 100)
        window.removeEventListener("afterprint", cleanup)
    }

    window.addEventListener("afterprint", cleanup)

    const fallbackTimeout = setTimeout(() => {
        const el = document.getElementById(styleId)
        if (el) el.remove()
        window.removeEventListener("afterprint", cleanup)
    }, 30000)

    try {
        window.print()
    } finally {
        clearTimeout(fallbackTimeout)
    }
}

export default function ReceiptDetailPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()

    const [data, setData] = useState<ReceiptDB | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                const res = await fetch(`/api/receipts/${params.id}`)

                if (!res.ok) {
                    throw new Error("Gagal memuat kwitansi")
                }

                const json = await res.json()

                if (!json?.receipt_number || typeof json.receipt_number !== "string") {
                    throw new Error("Nomor kwitansi tidak valid")
                }

                const syncedComputed: ReceiptComputed = {
                    ...json.computed,
                    receipt_number: json.receipt_number,
                    companyInfo: json.companyInfo,
                }

                setData({
                    ...json,
                    computed: syncedComputed,
                })
            } catch (error) {
                console.error(error)
                toast.error("Gagal memuat detail kwitansi")
            } finally {
                setLoading(false)
            }
        }

        if (params.id) fetchReceipt()
    }, [params.id])

    if (loading) {
        return <div className="p-6">Loading...</div>
    }

    if (!data) {
        return <div className="p-6">Kwitansi tidak ditemukan</div>
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 print:p-0">
            <div className="flex items-center justify-between no-print">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {data.receipt_number}
                    </h1>
                    <p className="text-sm text-muted-foreground">Detail kwitansi</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        Kembali
                    </Button>

                    <Button onClick={exportReceiptWithPrintSize}>
                        Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="mx-auto print:mx-0">
                    <ReceiptPreview receipt={data.computed} />
                </div>
            </div>
        </div>
    )
}