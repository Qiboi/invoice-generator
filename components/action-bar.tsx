/* eslint-disable @typescript-eslint/no-explicit-any */
// components/action-bar.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type ActionBarProps = {
    title: string;
    data?: any
    setData?: React.Dispatch<React.SetStateAction<any>>
    storageKey?: string
    showSave?: boolean
    showLoad?: boolean
    showClear?: boolean
    showExport?: boolean
    exportLabel?: string
    /** new: custom @page size string, e.g. '315mm 100mm' */
    printPageSize?: string | null
    /** new: optional margin for injected @page (e.g. '5mm') */
    printMargin?: string | null
}

export default function ActionBar({
    title,
    data,
    setData,
    storageKey = 'draft',
    showSave = false,
    showLoad = false,
    showClear = false,
    showExport = true,
    exportLabel = 'Export PDF',
    printPageSize = null,
    printMargin = null,
}: ActionBarProps) {
    const router = useRouter()
    const pathname = usePathname() || '/'

    const saveDraft = () => {
        try {
            if (typeof window === 'undefined') return
            localStorage.setItem(storageKey, JSON.stringify(data))
            alert('Draft tersimpan secara lokal.')
        } catch (e) {
            console.error(e)
            alert('Gagal menyimpan draft.')
        }
    }

    const loadDraft = () => {
        try {
            if (typeof window === 'undefined') return
            const raw = localStorage.getItem(storageKey)
            if (!raw) {
                alert('Tidak ada draft tersimpan.')
                return
            }
            const parsed = JSON.parse(raw)
            if (setData) {
                setData(parsed)
                alert('Draft dimuat.')
            } else {
                alert('Draft ditemukan — namun halaman tidak menerima load otomatis.')
                console.log('Loaded draft:', parsed)
            }
        } catch (e) {
            console.error(e)
            alert('Gagal memuat draft.')
        }
    }

    const clearDraft = () => {
        if (!confirm('Reset form dan hapus draft lokal?')) return
        try {
            if (typeof window === 'undefined') return
            localStorage.removeItem(storageKey)
            router.refresh()
        } catch (e) {
            console.error(e)
            alert('Gagal menghapus draft.')
        }
    }

    const exportPdf = () => {
        // If no custom page size requested, just print
        if (!printPageSize) {
            window.print()
            return
        }

        // Inject temporary @page rule
        const styleId = 'injected-print-page-size'
        // remove existing if any
        const existing = document.getElementById(styleId)
        if (existing) existing.remove()

        const styleEl = document.createElement('style')
        styleEl.id = styleId

        // build rule, include margin override if provided
        const marginRule = printMargin ? `margin: ${printMargin};` : ''
        styleEl.textContent = `@page { size: ${printPageSize}; ${marginRule} }`

        document.head.appendChild(styleEl)

        // cleanup handler after print
        const cleanup = () => {
            // small timeout to ensure print dialog finished in browsers that delay afterprint
            setTimeout(() => {
                const el = document.getElementById(styleId)
                if (el) el.remove()
            }, 100)
            window.removeEventListener('afterprint', cleanup)
        }

        window.addEventListener('afterprint', cleanup)

        // some browsers may not fire afterprint reliably; set fallback removal
        const fallbackTimeout = setTimeout(() => {
            const el = document.getElementById(styleId)
            if (el) el.remove()
            window.removeEventListener('afterprint', cleanup)
        }, 1000 * 30) // 30s fallback

        // call print (this typically blocks UI until print dialog handled)
        try {
            window.print()
        } finally {
            // clear fallback timer; cleanup will remove style via afterprint or fallback
            clearTimeout(fallbackTimeout)
        }
    }

    // active state helpers
    const isInvoiceActive = pathname.startsWith('/invoice')
    const isReceiptActive = pathname.startsWith('/receipt') || pathname.startsWith('/receipt')

    return (
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Title */}
            <h1 className="text-lg font-semibold">{title}</h1>

            {/* Center navigation (no-print) */}
            <div className="no-print flex items-center gap-4">
                <nav aria-label="Document navigation" className="flex items-center gap-2">
                    <Link
                        href="/invoice"
                        className={`text-sm px-3 py-1 rounded-md transition-colors ${isInvoiceActive ? 'text-indigo-600 bg-indigo-50' : 'text-muted-foreground hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        aria-current={isInvoiceActive ? 'page' : undefined}
                    >
                        Invoice
                    </Link>

                    <Link
                        href="/receipt"
                        className={`text-sm px-3 py-1 rounded-md transition-colors ${isReceiptActive ? 'text-indigo-600 bg-indigo-50' : 'text-muted-foreground hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        aria-current={isReceiptActive ? 'page' : undefined}
                    >
                        Kwitansi
                    </Link>
                </nav>
            </div>

            {/* Action */}
            <div className="no-print flex items-center justify-end gap-3">
                {showSave && (
                    <Button variant="secondary" onClick={saveDraft} aria-label="Save draft">
                        Save draft
                    </Button>
                )}

                {showLoad && (
                    <Button variant="ghost" onClick={loadDraft} aria-label="Load draft">
                        Load draft
                    </Button>
                )}

                {showExport && (
                    <Button onClick={exportPdf} aria-label="Export as PDF">
                        {exportLabel}
                    </Button>
                )}

                {showClear && (
                    <Button variant="destructive" onClick={clearDraft} aria-label="Reset draft">
                        Reset
                    </Button>
                )}
            </div>
        </div>
    )
}