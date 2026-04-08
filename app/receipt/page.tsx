'use client'

import React, { useMemo, useState, useEffect } from 'react'
import ReceiptForm from '@/components/receipt-form'
import ReceiptPreview from '@/components/receipt-preview'
import { Receipt, calcReceipt } from '@/lib/receipt'
import ActionBar from '@/components/action-bar'
import { Company } from '@/lib/company'

const defaultReceipt: Receipt = {
    receipt_number: '001/KW-SARR/IV/2026',
    received_from: 'PT Maju Jaya Sejahtera',
    payment_for: 'Pembelian bahan baku ayam potong segar',
    amount_numeric: 2500000,
    tax_percent: 0,
    place_of_issue: 'Bandung',
    date_of_issue: new Date().toISOString().slice(0, 10), // auto today (yyyy-mm-dd)
    recipient_name_printed: 'Junferty Sabriani',
}

const initialComapnyInfo: Company = {
    name: 'PT. SARR ADHIKARI COMPANY',
    address: 'Komp. Permata Biru Blok AD Baru, No. 18, Kelurahaan Cinunuk, Kec. Cileunyi, Kab. Bandung, Jawa Barat.',
    phone: '0821-3018-2901',
}

export default function ReceiptPage() {
    const [receipt, setReceipt] = useState<Receipt>(defaultReceipt)
    const [companyInfo, setCompanyInfo] = useState(initialComapnyInfo)

    // auto compute
    const computed = useMemo(() => calcReceipt(receipt, companyInfo), [receipt, companyInfo])

    // autosave draft
    useEffect(() => {
        localStorage.setItem('receipt:draft', JSON.stringify(receipt))
    }, [receipt])

    // load draft once
    useEffect(() => {
        const loadDraft = async () => {
            const saved = localStorage.getItem('receipt:draft')
            if (saved) {
                const parsed = JSON.parse(saved)
                setReceipt(parsed)
            }
        }
        loadDraft()
    }, [])

    return (
        <div className="space-y-6">
            <div className="no-print border-b bg-white">
                <ActionBar
                    title='Create Receipt'
                    data={receipt}
                    setData={setReceipt}
                    storageKey="receipt:draft"
                    exportLabel="Export PDF"
                    printPageSize="315mm 100mm"
                    printMargin="5mm 5mm"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="grid grid-cols-1 gap-6">
                    <div className='mx-auto print:mx-0'>
                        <ReceiptPreview receipt={computed} />
                    </div>
                    <div className='no-print'>
                        <ReceiptForm receipt={receipt} companyInfo={companyInfo} setReceipt={setReceipt} setCompanyInfo={setCompanyInfo} />
                    </div>
                </div>
            </div>
        </div>
    )
}
