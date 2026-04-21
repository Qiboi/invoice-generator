"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Save, Download } from "lucide-react"

type ActionBarProps = {
    title: string
    onSave?: () => void
    onExport?: () => void
    saving?: boolean
    printPageSize?: string | null
    printMargin?: string | null
}

export default function ActionBar({
    title,
    onSave,
    onExport,
    saving = false,
    printPageSize = null,
    printMargin = null,
}: ActionBarProps) {
    const handleExport = () => {
        if (!onExport) return

        if (!printPageSize) {
            onExport()
            return
        }

        const styleId = "injected-print-page-size"
        const existing = document.getElementById(styleId)
        if (existing) existing.remove()

        const styleEl = document.createElement("style")
        styleEl.id = styleId

        const marginRule = printMargin ? `margin: ${printMargin};` : ""
        styleEl.textContent = `@page { size: ${printPageSize}; ${marginRule} }`

        document.head.appendChild(styleEl)

        const cleanup = () => {
            setTimeout(() => {
                const el = document.getElementById(styleId)
                if (el) el.remove()
            }, 100)
            window.removeEventListener("afterprint", cleanup)
        }

        window.addEventListener("afterprint", cleanup)

        const fallbackTimeout = setTimeout(() => {
            const el = document.getElementById(styleId)
            if (el) el.remove()
            window.removeEventListener("afterprint", cleanup)
        }, 30000)

        try {
            onExport()
        } finally {
            clearTimeout(fallbackTimeout)
        }
    }

    return (
        <div className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3 shadow-sm no-print">
            <div>
                <h1 className="text-lg font-semibold">{title}</h1>
                <p className="text-xs text-muted-foreground">
                    Kelola dan generate dokumen
                </p>
            </div>

            <div className="flex items-center gap-2">
                {onExport && (
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                )}

                {onSave && (
                    <Button onClick={onSave} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Simpan
                    </Button>
                )}
            </div>
        </div>
    )
}