/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import InvoicePreview from "@/components/invoice-preview"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function InvoiceDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()

    const [data, setData] = useState<any>(null)
    const [invoiceNumber, setInvoiceNumber] = useState("INV-XXXX")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await fetch(`/api/invoices/${id}`)

                if (!res.ok) throw new Error("Failed fetch")

                const json = await res.json()

                const synced = {
                    ...json,
                    computed: {
                        ...json.computed,
                        invoice_number: json.invoice_number,
                    },
                }

                setInvoiceNumber(synced.invoice_number)
                setData(synced)
            } catch (error) {
                console.error(error)
                toast.error("Gagal memuat invoice")
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchInvoice()
    }, [id])

    const handleExport = () => {
        window.print()
    }

    async function handleDelete(id: string, type: "invoice" | "receipt") {
        const loadingToast = toast.loading("Menghapus data...")

        try {
            const res = await fetch(
                `/api/${type === "invoice" ? "invoices" : "receipts"}/${id}`,
                {
                    method: "DELETE",
                }
            )

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.message)
            }

            toast.success(result.message || "Berhasil dihapus", {
                id: loadingToast,
            })

            setTimeout(() => {
                window.location.href = `/dashboard/${type === "invoice" ? "invoices" : "receipts"
                    }`
            }, 800)
        } catch (err: any) {
            toast.error(err.message || "Gagal menghapus data", {
                id: loadingToast,
            })
        }
    }

    if (loading) {
        return <div className="p-6">Loading...</div>
    }

    if (!data) {
        return <div className="p-6">Invoice tidak ditemukan</div>
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 print:p-0">
            <div className="flex items-center justify-between no-print">
                <div>
                    <h1 className="text-2xl font-bold">{data.invoice_number}</h1>
                    <p className="text-sm text-muted-foreground">Detail invoice</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        Kembali
                    </Button>

                    <Button onClick={handleExport}>Export PDF</Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Hapus</Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Hapus invoice?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Data yang dihapus tidak dapat dikembalikan. Pastikan Anda
                                    yakin.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(data._id, "invoice")}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-[223mm]">
                    <InvoicePreview
                        invoice={data.computed}
                        invoiceNumber={invoiceNumber}
                    />
                </div>
            </div>
        </div>
    )
}