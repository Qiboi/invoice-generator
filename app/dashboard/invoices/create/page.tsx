"use client"

import { useState } from "react"
import { calcTotals, type Invoice, type InvoiceComputed } from "@/lib/invoice"
import InvoiceForm from "@/components/invoice-form"
import InvoicePreview from "@/components/invoice-preview"
import ActionBar from "@/components/action-bar"
import type { Company } from "@/lib/company"
import { toast } from "sonner"

const initialInvoice: Invoice = {
    invoice_number: "INV-XXXX",
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: new Date().toISOString().slice(0, 10),
    currency: "IDR",
    bill_to: {
        name: "Junferty Sabriani",
        company: "PT Lahap Dahar",
        address: "Jl. Anggrek No. 34, Jakarta",
        phone: "0812-9876-5432",
        email: "junferty@gmail.com",
    },
    project: "Beli bahan baku",
    items: [
        {
            id: "1",
            description: "Ayam Potong Segar",
            quantity: 50,
            unit: "kg",
            unit_price: 35000,
        },
        {
            id: "2",
            description: "Bumbu Ayam Bakar Siap Pakai",
            quantity: 10,
            unit: "kg",
            unit_price: 30000,
        },
        {
            id: "3",
            description: "Arang Kayu",
            quantity: 5,
            unit: "pack",
            unit_price: 40000,
        },
        {
            id: "4",
            description: "Daun Pisang",
            quantity: 500,
            unit: "lembar",
            unit_price: 500,
        },
    ],
    discount: 0,
    adjustments: 0,
    notes: "",
    payment_terms: "Net 14",
}

const initialCompanyInfo: Company = {
    name: "PT. SARR ADHIKARI COMPANY",
    address:
        "Komp. Permata Biru Blok AD Baru, No. 18, Kelurahaan Cinunuk, Kec. Cileunyi, Kab. Bandung, Jawa Barat.",
    phone: "0821-3018-2901",
    bank_account: "BNI 2039890073 a/n PT. SARR ADHIKARI COMPANY",
}

export default function CreateInvoicePage() {
    const [invoice, setInvoice] = useState<Invoice>(initialInvoice)
    const [companyInfo, setCompanyInfo] = useState<Company>(initialCompanyInfo)
    const [saving, setSaving] = useState(false)

    const computedInvoice: InvoiceComputed = calcTotals(invoice, companyInfo)

    const handleExport = () => {
        window.print()
    }

    const handleSave = async () => {
        try {
            setSaving(true)

            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    invoice,
                    companyInfo,
                    computed: computedInvoice,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data?.message || "Gagal menyimpan invoice")
            }

            if (data?.invoice_number) {
                setInvoice((prev) => ({
                    ...prev,
                    invoice_number: data.invoice_number,
                }))
            }

            toast.success("Invoice berhasil disimpan")
        } catch (err) {
            console.error(err)
            toast.error("Gagal menyimpan invoice")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 print:p-0">
            <ActionBar
                title="Create Invoice"
                onSave={handleSave}
                onExport={handleExport}
                saving={saving}
            />

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
                        invoiceNumber={invoice.invoice_number}
                    />
                </main>
            </div>
        </div>
    )
}