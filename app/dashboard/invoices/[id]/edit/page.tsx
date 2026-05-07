/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import ActionBar from "@/components/action-bar"
import InvoiceForm from "@/components/invoice-form"
import InvoicePreview from "@/components/invoice-preview"
import { calcTotals, type Invoice, type InvoiceComputed } from "@/lib/invoice"
import type { Company } from "@/lib/company"

type InvoiceDB = {
    _id: string
    invoice_number: string
    invoice: Invoice
    companyInfo: Company
    computed: InvoiceComputed
}

const initialInvoice: Invoice = {
    invoice_number: "INV-XXXX",
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: new Date().toISOString().slice(0, 10),
    currency: "IDR",
    bill_to: {
        name: "",
        company: "",
        address: "",
        phone: "",
        email: "",
    },
    project: "",
    items: [],
    discount: 0,
    adjustments: 0,
    notes: "",
    payment_terms: "Net 14",
}

const initialCompanyInfo: Company = {
    name: "",
    address: "",
    phone: "",
    bank_account: "",
}

export default function EditInvoicePage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [invoice, setInvoice] = useState<Invoice>(initialInvoice)
    const [companyInfo, setCompanyInfo] = useState<Company>(initialCompanyInfo)
    const [invoiceNumber, setInvoiceNumber] = useState("INV-XXXX")

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await fetch(`/api/invoices/${params.id}`)

                if (!res.ok) {
                    throw new Error("Gagal memuat invoice")
                }

                const json: InvoiceDB = await res.json()

                setInvoice({
                    ...json.invoice,
                    invoice_number: json.invoice_number,
                })
                setCompanyInfo(json.companyInfo)
                setInvoiceNumber(json.invoice_number)
            } catch (error) {
                console.error(error)
                toast.error("Gagal memuat data invoice")
            } finally {
                setLoading(false)
            }
        }

        if (params.id) fetchInvoice()
    }, [params.id])

    const computedInvoice: InvoiceComputed = useMemo(() => {
        return calcTotals(invoice, companyInfo)
    }, [invoice, companyInfo])

    const handleExport = () => {
        window.print()
    }

    const handleSave = async () => {
        try {
            setSaving(true)

            const res = await fetch(`/api/invoices/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    invoice,
                    companyInfo,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data?.message || "Gagal menyimpan perubahan")
            }

            setInvoice({
                ...data.invoice,
                invoice_number: data.invoice_number,
            })
            setCompanyInfo(data.companyInfo)
            setInvoiceNumber(data.invoice_number)

            toast.success("Invoice berhasil diperbarui")
        } catch (error) {
            console.error(error)
            toast.error("Gagal menyimpan perubahan invoice")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="p-6">Loading...</div>
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 print:p-0">
            <ActionBar
                title="Edit Invoice"
                onSave={handleSave}
                onExport={handleExport}
                saving={saving}
            />

            <div className="flex items-center justify-between no-print">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{invoiceNumber}</h1>
                    <p className="text-sm text-muted-foreground">Perbarui data invoice</p>
                </div>

                <button
                    onClick={() => router.back()}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                    Kembali
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 items-start 2xl:grid-cols-[minmax(0,1fr)_auto]">
                <section className="min-w-0 w-full no-print">
                    <InvoiceForm
                        invoice={invoice}
                        companyInfo={companyInfo}
                        setInvoice={setInvoice}
                        setCompanyInfo={setCompanyInfo}
                    />
                </section>

                <main className="min-w-0 justify-self-end">
                    <InvoicePreview
                        invoice={computedInvoice}
                        invoiceNumber={invoiceNumber}
                    />
                </main>
            </div>
        </div>
    )
}