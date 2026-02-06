'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Invoice } from '@/lib/invoice'

type Props = {
    invoice: Invoice
    setInvoice: (inv: Invoice) => void
    storageKey?: string
}

/**
 * Simple action bar:
 * - Save draft -> localStorage
 * - Load draft -> localStorage
 * - Export -> window.print()
 * - Reset -> confirm then reset to empty (caller must pass initial state)
 */
export default function ActionBar({ invoice, setInvoice, storageKey = 'invoice:draft' }: Props) {
    const router = useRouter()

    const saveDraft = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(invoice))
            alert('Draft tersimpan secara lokal.')
        } catch (e) {
            console.error(e)
            alert('Gagal menyimpan draft.')
        }
    }

    const loadDraft = () => {
        const raw = localStorage.getItem(storageKey)
        if (!raw) {
            alert('Tidak ada draft tersimpan.')
            return
        }
        try {
            const parsed = JSON.parse(raw) as Invoice
            setInvoice(parsed)
            alert('Draft dimuat.')
        } catch (e) {
            console.error(e)
            alert('Gagal memuat draft.')
        }
    }

    const clearDraft = () => {
        if (!confirm('Reset form dan hapus draft lokal?')) return
        localStorage.removeItem(storageKey)
        // naive reset: refresh page to initial state — this keeps things simple
        router.refresh()
    }

    const exportPdf = () => {
        window.print()
    }

    return (
        <div className="no-print flex items-center justify-end gap-3">
            {/* <Button variant="secondary" onClick={saveDraft} aria-label="Save invoice draft">Save draft</Button> */}
            {/* <Button variant="ghost" onClick={loadDraft} aria-label="Load invoice draft">Load draft</Button> */}
            <Button onClick={exportPdf} aria-label="Export invoice as PDF">Export PDF</Button>
            {/* <Button variant="destructive" onClick={clearDraft} aria-label="Reset invoice form">Reset</Button> */}
        </div>
    )
}
