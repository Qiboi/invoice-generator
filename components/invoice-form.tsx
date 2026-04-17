/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from "react"
import { Invoice } from "@/lib/invoice"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InvoiceItemsTable from "./invoice-items-table"
import { Button } from "@/components/ui/button"
import { Textarea } from "./ui/textarea"
import { Company } from "@/lib/company"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Props = {
    invoice: Invoice
    companyInfo: Company
    setInvoice: (v: Invoice) => void
    setCompanyInfo: React.Dispatch<React.SetStateAction<Company>>
}

export default function InvoiceForm({
    invoice,
    companyInfo,
    setInvoice,
    setCompanyInfo,
}: Props) {
    const updateBillTo = (patch: Partial<Invoice["bill_to"]>) =>
        setInvoice({ ...invoice, bill_to: { ...invoice.bill_to, ...patch } })

    const updateField = (k: keyof Invoice, value: any) =>
        setInvoice({ ...invoice, [k]: value } as Invoice)

    const companyOptions: Company[] = [
        {
            name: "PT. SARR ADHIKARI COMPANY",
            address:
                "Komp. Permata Biru Blok AD Baru, No. 18, Kelurahaan Cinunuk, Kec. Cileunyi, Kab. Bandung, Jawa Barat.",
            phone: "0821-3018-2901",
            bank_account: "BNI 2039890073 a/n PT. SARR ADHIKARI COMPANY",
        },
        {
            name: "CV. ARUNA KARYA GROUP",
            address:
                "Komp. Permata Biru Blok AD Baru, No. 18, Kelurahaan Cinunuk, Kec. Cileunyi, Kab. Bandung, Jawa Barat.",
            phone: "0821-3018-2901",
            bank_account: "BNI 203959001 a/n CV. ARUNA KARYA GROUP",
        },
    ]

    return (
        <Card className="w-full">
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Invoice Form</CardTitle>
                <div className="text-sm text-muted-foreground">Draft</div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <div className="text-sm font-medium">Invoice Info</div>

                    <div className="grid gap-3">
                        <label className="flex flex-col space-y-2">
                            <span className="text-xs text-muted-foreground">
                                Company Info
                            </span>

                            <Select
                                value={companyInfo.name}
                                onValueChange={(value) => {
                                    const preset = companyOptions.find((c) => c.name === value)

                                    if (preset) {
                                        setCompanyInfo((prev) => ({
                                            ...prev,
                                            ...preset,
                                        }))
                                    } else {
                                        setCompanyInfo((prev) => ({
                                            ...prev,
                                            name: value,
                                        }))
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select company" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companyOptions.map((c) => (
                                        <SelectItem key={c.name} value={c.name}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </label>

                        <div className="text-xs text-muted-foreground space-y-1 border rounded-md p-3 bg-muted/30">
                            <div>{companyInfo.address}</div>
                            <div>{companyInfo.phone}</div>
                            <div>{companyInfo.bank_account}</div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground mb-1">
                                Invoice number
                            </span>
                            <Input
                                value={invoice.invoice_number || "Auto generated"}
                                readOnly
                                className="bg-muted"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label className="flex flex-col">
                                <span className="text-xs text-muted-foreground mb-1">
                                    Issue date
                                </span>
                                <Input
                                    type="date"
                                    value={invoice.issue_date || ""}
                                    onChange={(e) => updateField("issue_date", e.target.value)}
                                />
                            </label>

                            <label className="flex flex-col">
                                <span className="text-xs text-muted-foreground mb-1">
                                    Due date
                                </span>
                                <Input
                                    type="date"
                                    value={invoice.due_date || ""}
                                    onChange={(e) => updateField("due_date", e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                    <div className="text-sm font-medium">Bill to</div>

                    <div className="grid gap-2">
                        <Input
                            placeholder="Customer name"
                            value={invoice.bill_to?.name || ""}
                            onChange={(e) => updateBillTo({ name: e.target.value })}
                        />

                        <Textarea
                            placeholder="Billing address"
                            rows={3}
                            value={invoice.bill_to?.address || ""}
                            onChange={(e) => updateBillTo({ address: e.target.value })}
                        />

                        <Input
                            placeholder="Phone"
                            value={invoice.bill_to?.phone || ""}
                            onChange={(e) => updateBillTo({ phone: e.target.value })}
                        />

                        <Input
                            placeholder="Email"
                            value={invoice.bill_to?.email || ""}
                            onChange={(e) => updateBillTo({ email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Items</div>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                                setInvoice({
                                    ...invoice,
                                    items: [
                                        ...(invoice.items || []),
                                        {
                                            id: crypto.randomUUID(),
                                            description: "",
                                            quantity: 1,
                                            unit: "",
                                            unit_price: 0,
                                        },
                                    ],
                                })
                            }
                        >
                            + Add item
                        </Button>
                    </div>

                    <InvoiceItemsTable
                        items={invoice.items}
                        editable={true}
                        onChange={(next) => setInvoice({ ...invoice, items: next })}
                    />
                </div>

                <div className="text-xs text-muted-foreground pt-2">
                    Tip: gunakan tombol <span className="font-medium">+ Add item</span>{" "}
                    untuk menambah baris.
                </div>
            </CardContent>
        </Card>
    )
}