/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import { Invoice } from '@/lib/invoice'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import InvoiceItemsTable from './invoice-items-table'
import { Button } from '@/components/ui/button'

type Props = {
    invoice: Invoice
    setInvoice: (v: Invoice) => void
}

export default function InvoiceForm({ invoice, setInvoice }: Props) {
    // small helpers to update nested fields
    const updateBillTo = (patch: Partial<Invoice['bill_to']>) =>
        setInvoice({ ...invoice, bill_to: { ...invoice.bill_to, ...patch } })

    const updateField = (k: keyof Invoice, value: any) =>
        setInvoice({ ...invoice, [k]: value } as Invoice)

    return (
        <Card className="w-full">
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Invoice Form</CardTitle>
                <div className="text-sm text-muted-foreground">Draft</div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* ---------- Invoice meta (number + dates) ---------- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1">Invoice number</span>
                        <Input
                            placeholder="INV-001"
                            value={invoice.invoice_number}
                            onChange={(e) => updateField('invoice_number', e.target.value)}
                        />
                    </label>

                    <div className="grid grid-cols-1 gap-3">
                        {/* <label className="flex flex-col">
                            <span className="text-xs text-muted-foreground mb-1">Issue date</span>
                            <Input
                                type="date"
                                value={invoice.issue_date}
                                onChange={(e) => updateField('issue_date', e.target.value)}
                            />
                        </label> */}

                        <label className="flex flex-col">
                            <span className="text-xs text-muted-foreground mb-1">Due date</span>
                            <Input
                                type="date"
                                value={invoice.due_date || ''}
                                onChange={(e) => updateField('due_date', e.target.value)}
                            />
                        </label>
                    </div>
                </div>

                {/* ---------- Bill to (customer) ---------- */}
                <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Bill to</div>

                    <div className="grid grid-cols-1 gap-2">
                        <Input
                            placeholder="Name (e.g. Raniandi)"
                            value={invoice.bill_to?.name || ''}
                            onChange={(e) => updateBillTo({ name: e.target.value })}
                        />
                        {/* <Input
                            placeholder="Company (optional)"
                            value={invoice.bill_to?.company || ''}
                            onChange={(e) => updateBillTo({ company: e.target.value })}
                        />
                        <Textarea
                            placeholder="Billing address"
                            rows={3}
                            value={invoice.bill_to?.address || ''}
                            onChange={(e) => updateBillTo({ address: e.target.value })}
                        />
                        <Input
                            placeholder="Phone (e.g. 0812-XXX)"
                            value={invoice.bill_to?.phone || ''}
                            onChange={(e) => updateBillTo({ phone: e.target.value })}
                        /> */}
                    </div>
                </div>

                {/* ---------- Items header + actions ---------- */}
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Items</div>
                    <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground mr-2">Currency: IDR</div>
                        {/* Add item control is inside InvoiceItemsTable by default.
                We keep a second add button for convenience */}
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
                                            description: '',
                                            quantity: 1,
                                            unit: '',
                                            unit_price: 0,
                                        },
                                    ],
                                })
                            }
                        >
                            + Add item
                        </Button>
                    </div>
                </div>

                {/* ---------- Items table (editable) ---------- */}
                <div>
                    <InvoiceItemsTable
                        items={invoice.items}
                        editable={true}
                        onChange={(next) => setInvoice({ ...invoice, items: next })}
                    />
                </div>

                {/* ---------- Notes & payment terms ---------- */}
                {/* <div className="grid grid-cols-1 gap-2">
                    <label className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1">Notes</span>
                        <Textarea
                            placeholder="Notes visible on invoice"
                            value={invoice.notes || ''}
                            rows={3}
                            onChange={(e) => updateField('notes', e.target.value)}
                        />
                    </label>

                    <label className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1">Payment terms</span>
                        <Input
                            placeholder="Net 14"
                            value={invoice.payment_terms || ''}
                            onChange={(e) => updateField('payment_terms', e.target.value)}
                        />
                    </label>
                </div> */}

                {/* ---------- compact summary (editable) ---------- */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>Tip: gunakan tombol <span className="font-medium">+ Add item</span> untuk menambah baris.</div>
                    <div className="flex items-center gap-2">
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                // quick convenience: copy preview totals to clipboard
                                try {
                                    const totals = `Subtotal: ${invoice.items.reduce(
                                        (s, it) => s + (it.quantity || 0) * (it.unit_price || 0),
                                        0
                                    )}`
                                    navigator.clipboard.writeText(totals)
                                    // small feedback could be toasts (sonner) if available
                                } catch { }
                            }}
                        >
                            Copy totals
                        </Button> */}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
