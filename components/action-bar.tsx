"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Save, Download } from "lucide-react"

type ActionBarProps = {
    title: string
    onSave?: () => void
    onExport?: () => void
    saving?: boolean
}

export default function ActionBar({
    title,
    onSave,
    onExport,
    saving = false,
}: ActionBarProps) {
    return (
        <div className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3 shadow-sm no-print">
            {/* LEFT */}
            <div>
                <h1 className="text-lg font-semibold">{title}</h1>
                <p className="text-xs text-muted-foreground">
                    Kelola dan generate invoice
                </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
                {onExport && (
                    <Button variant="outline" onClick={onExport}>
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