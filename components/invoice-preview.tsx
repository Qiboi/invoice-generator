/* invoice-preview.tsx */
'use client'

import React from 'react'
import { formatRupiah } from '@/lib/format'
import { InvoiceComputed } from '@/lib/invoice'

export type InvoicePreviewProps = {
    invoice: InvoiceComputed
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
    return (
        <div id="invoice-preview" className="invoice">

            {/* HEADER */}
            <div className="invoice-header">
                <div>
                    <div className="invoice-company">
                        {process.env.NEXT_PUBLIC_COMPANY_NAME}
                    </div>
                    <div className="invoice-company-info">
                        <div>{process.env.NEXT_PUBLIC_COMPANY_ADDRESS}</div>
                        <div>{process.env.NEXT_PUBLIC_COMPANY_PHONE}</div>
                    </div>
                </div>

                <div className="invoice-title">
                    <h1>Invoice</h1>
                    <div className="invoice-submitted">
                        Submitted on {invoice.issue_date}
                    </div>
                </div>
            </div>

            {/* META */}
            <div className="invoice-meta">
                <div>
                    <div className="invoice-meta-title">Invoice for</div>
                    <div className="invoice-meta-value">{invoice.bill_to.name}</div>
                </div>

                <div>
                    <div className="invoice-meta-title">Invoice #</div>
                    <div className="invoice-meta-value">{invoice.invoice_number}</div>
                </div>

                <div>
                    <div className="invoice-meta-title">Due date</div>
                    <div className="invoice-meta-value">{invoice.due_date}</div>
                </div>
            </div>

            {/* ITEMS TABLE */}
            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map(item => (
                        <tr key={item.id}>
                            <td>{item.description}</td>
                            <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right' }}>{formatRupiah(item.unit_price)}</td>
                            <td style={{ textAlign: 'right' }}>{formatRupiah(item.line_total || 0)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TOTALS */}
            <div className="invoice-summary">
                <div className="invoice-summary-row">
                    <span>Subtotal</span>
                    <span>{formatRupiah(invoice.subtotal || 0)}</span>
                </div>

                <div className="invoice-summary-row invoice-summary-total">
                    <span>Total</span>
                    <span>{formatRupiah(invoice.total || 0)}</span>
                </div>

                <div className="invoice-summary-grand">
                    {formatRupiah(invoice.total || 0)}
                </div>
            </div>

            {/* FOOTER */}
            <div className="invoice-footer">
                Payment instructions: {process.env.NEXT_PUBLIC_COMPANY_BANK}
            </div>
        </div>
    )
}
