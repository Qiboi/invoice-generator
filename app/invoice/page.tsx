'use client'

import { useState } from 'react'
import { calcTotals, Invoice, InvoiceComputed } from '@/lib/invoice'
import InvoiceForm from '@/components/invoice-form'
import InvoicePreview from '@/components/invoice-preview'
import ActionBar from '@/components/action-bar'
import { Company } from '@/lib/company'


const initialInvoice: Invoice = {
    invoice_number: 'INV-001',
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: new Date().toISOString().slice(0, 10),
    currency: 'IDR',
    bill_to: {
        name: 'Junferty Sabriani',
        company: 'PT Lahap Dahar',
        address: 'Jl. Anggrek No. 34, Jakarta',
        phone: '0812-9876-5432',
        email: 'junferty@gmail.com',
    },
    project: 'Beli bahan baku',
    items: [
        { id: '1', description: 'Ayam Potong Segar', quantity: 50, unit: 'kg', unit_price: 35000 },
        { id: '2', description: 'Bumbu Ayam Bakar Siap Pakai', quantity: 10, unit: 'kg', unit_price: 30000 },
        { id: '3', description: 'Arang Kayu', quantity: 5, unit: 'pack', unit_price: 40000 },
        { id: '4', description: 'Daun Pisang', quantity: 500, unit: 'lembar', unit_price: 500 },
    ],
    discount: 0,
    adjustments: 0,
    notes: '',
    payment_terms: 'Net 14',
}

const initialComapnyInfo: Company = {
    name: 'PT. SARR ADHIKARI COMPANY',
    address: 'Jalan Kungkung, Jakarta Selatan',
    phone: '(021) 12345678',
}

export default function InvoicePage() {
    const [invoice, setInvoice] = useState<Invoice>(initialInvoice)
    const [companyInfo, setCompanyInfo] = useState(initialComapnyInfo)
    const computedInvoice: InvoiceComputed = calcTotals(invoice, companyInfo)

    return (
        <div className="min-h-screen bg-neutral-50 print:bg-white print:pt-0">
            {/* top bar */}
            <div className="no-print border-b bg-white">
                <ActionBar
                    title='Create Invoice'
                    data={invoice}
                    setData={setInvoice}
                    storageKey="invoice:draft"
                />
            </div>

            {/* main content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-0 py-6 print:p-0 print:mx-0">
                <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">

                    {/* LEFT — editor */}
                    <aside className="no-print">
                        <div>
                            {/* <h2 className="text-sm font-medium mb-4">Invoice Details</h2> */}
                            <InvoiceForm invoice={invoice} companyInfo={companyInfo} setInvoice={setInvoice} setCompanyInfo={setCompanyInfo} />
                        </div>
                    </aside>

                    {/* RIGHT — preview canvas */}
                    {/* visual frame only, NOT scroll */}
                    <main className="flex justify-center print:block">
                        <div className="invoice-preview-frame">
                            <InvoicePreview invoice={computedInvoice} />
                        </div>
                    </main>

                </div>
            </div>
        </div>
    )
}
