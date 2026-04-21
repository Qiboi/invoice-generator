"use client"

import React, { useMemo, useState, useEffect } from "react"
import ReceiptForm from "@/components/receipt-form"
import ReceiptPreview from "@/components/receipt-preview"
import ActionBar from "@/components/action-bar"
import { Receipt, calcReceipt } from "@/lib/receipt"
import { Company } from "@/lib/company"
import { toast } from "sonner"

const defaultReceipt: Receipt = {
    receipt_number: "AUTO",
    received_from: "PT Maju Jaya Sejahtera",
    payment_for: "Pembelian bahan baku ayam potong segar",
    amount_numeric: 2500000,
    tax_percent: 0,
    place_of_issue: "Bandung",
    date_of_issue: new Date().toISOString().slice(0, 10),
    recipient_name_printed: "Junferty Sabriani",
}

const initialComapnyInfo: Company = {
    name: "PT. SARR ADHIKARI COMPANY",
    address:
        "Komp. Permata Biru Blok AD Baru, No. 18, Kelurahaan Cinunuk, Kec. Cileunyi, Kab. Bandung, Jawa Barat.",
    phone: "0821-3018-2901",
}

export default function CreateReceiptPage() {
    const [receipt, setReceipt] = useState<Receipt>(defaultReceipt)
    const [companyInfo, setCompanyInfo] = useState(initialComapnyInfo)
    const [saving, setSaving] = useState(false)

    const computed = useMemo(
        () => calcReceipt(receipt, companyInfo),
        [receipt, companyInfo]
    )

    useEffect(() => {
        localStorage.setItem(
            "receipt:draft",
            JSON.stringify({ receipt, companyInfo })
        )
    }, [receipt, companyInfo])

    useEffect(() => {
        const saved = localStorage.getItem("receipt:draft")
        if (!saved) return

        try {
            const parsed = JSON.parse(saved)
            if (parsed.receipt) setReceipt(parsed.receipt)
            if (parsed.companyInfo) setCompanyInfo(parsed.companyInfo)
        } catch (error) {
            console.error(error)
        }
    }, [])

    const handleSave = async () => {
        try {
            setSaving(true)

            const res = await fetch("/api/receipts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    receipt,
                    companyInfo,
                    computed,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data?.message || "Gagal menyimpan kwitansi")
            }

            if (data?.receipt_number) {
                setReceipt((prev) => ({
                    ...prev,
                    receipt_number: data.receipt_number,
                }))
            }

            localStorage.setItem(
                "receipt:draft",
                JSON.stringify({ receipt, companyInfo })
            )

            toast.success("Kwitansi berhasil disimpan")
        } catch (error) {
            console.error(error)
            toast.error("Gagal menyimpan kwitansi")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 print:p-0">
            <ActionBar
                title="Create Receipt"
                onSave={handleSave}
                onExport={() => window.print()}
                saving={saving}
                printPageSize="315mm 100mm"
                printMargin="5mm"
            />

            <div className="grid grid-cols-1 gap-6">
                <div className="mx-auto print:mx-0">
                    <ReceiptPreview receipt={computed} />
                </div>

                <div className="no-print">
                    <ReceiptForm
                        receipt={receipt}
                        companyInfo={companyInfo}
                        setReceipt={setReceipt}
                        setCompanyInfo={setCompanyInfo}
                    />
                </div>
            </div>
        </div>
    )
}