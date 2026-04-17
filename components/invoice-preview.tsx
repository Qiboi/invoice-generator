/* invoice-preview.tsx */
"use client"

import React from "react"
import { formatRupiah } from "@/lib/format"
import { InvoiceComputed } from "@/lib/invoice"

export type InvoicePreviewProps = {
    invoice: InvoiceComputed
    invoiceNumber: string
}

export default function InvoicePreview({
    invoice,
    invoiceNumber,
}: InvoicePreviewProps) {
    return (
        <div className="w-full overflow-x-auto">
            <div className="bg-black/4 p-6 rounded-xl print:bg-transparent print:p-0 print:rounded-none">
                <div
                    id="invoice-preview"
                    className="relative box-border bg-white text-black font-sans text-sm"
                    style={{
                        width: "210mm",
                        minHeight: "287mm",
                        padding: "20mm",
                        boxSizing: "border-box",
                    }}
                >
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="col-span-2">
                            <div className="text-2xl font-bold">
                                {invoice.company_info?.name}
                            </div>
                            <div className="text-xs text-gray-600">
                                <div>{invoice.company_info?.address}</div>
                                <div>{invoice.company_info?.phone}</div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-2xl font-bold">Invoice</div>
                            <div className="text-xs">
                                <div>{invoiceNumber}</div>
                                <div>Submitted on {invoice.issue_date}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <div className="text-[10px] uppercase text-gray-500">
                                Invoice for
                            </div>
                            <div className="text-sm font-semibold">{invoice.bill_to.name}</div>
                            <div className="text-xs">{invoice.bill_to.address}</div>
                            <div className="text-xs">Phone : {invoice.bill_to.phone}</div>
                            <div className="text-xs">Email : {invoice.bill_to.email}</div>
                        </div>

                        <div className="text-right">
                            <div className="text-[10px] uppercase text-gray-500">
                                Due date
                            </div>
                            <div className="text-sm font-semibold">{invoice.due_date}</div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse mb-5">
                            <thead>
                                <tr>
                                    <th className="text-left text-[11px] pr-2 pb-2 border-b border-gray-200">
                                        Description
                                    </th>
                                    <th className="text-right text-[11px] px-2 pb-2 border-b border-gray-200">
                                        Qty
                                    </th>
                                    <th className="text-right text-[11px] px-2 pb-2 border-b border-gray-200">
                                        Unit
                                    </th>
                                    <th className="text-right text-[11px] px-2 pb-2 border-b border-gray-200">
                                        Unit price
                                    </th>
                                    <th className="text-right text-[11px] px-2 pb-2 border-b border-gray-200">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, idx) => (
                                    <tr
                                        key={item.id}
                                        className={idx % 2 === 1 ? "bg-gray-50" : ""}
                                        style={{ pageBreakInside: "avoid" }}
                                    >
                                        <td className="py-2 align-top text-[11px] pr-2">
                                            {item.description}
                                        </td>
                                        <td className="py-2 align-top text-[11px] px-2 text-right">
                                            {item.quantity}
                                        </td>
                                        <td className="py-2 align-top text-[11px] px-2 text-right">
                                            {item.unit}
                                        </td>
                                        <td className="py-2 align-top text-[11px] px-2 text-right">
                                            {formatRupiah(item.unit_price)}
                                        </td>
                                        <td className="py-2 align-top text-[11px] px-2 text-right">
                                            {formatRupiah(item.line_total || 0)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-full flex justify-end">
                        <div className="w-1/3">
                            <div className="flex justify-between mb-1 text-sm">
                                <span>Subtotal</span>
                                <span className="font-semibold">
                                    {formatRupiah(invoice.subtotal || 0)}
                                </span>
                            </div>

                            <div className="flex justify-between border-t border-gray-300 pt-2 text-sm font-semibold">
                                <span>Total</span>
                                <span>{formatRupiah(invoice.total || 0)}</span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="invoice-footer absolute text-xs text-gray-600"
                        style={{
                            bottom: "20mm",
                            left: "20mm",
                            right: "20mm",
                        }}
                    >
                        Payment instructions :{" "}
                        {invoice.company_info?.bank_account
                            ? invoice.company_info.bank_account
                            : "Please transfer to our bank account at BCA 123-456-7890 a/n PT. SARR ADHIKARI COMPANY"}
                    </div>
                </div>
            </div>
        </div>
    )
}