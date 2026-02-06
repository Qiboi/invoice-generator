'use client'

// import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'

export default function PdfExporter() {
    const exportPdf = () => {
        window.print()
    }

    return (
        <Button onClick={exportPdf} className="no-print">
            Export PDF
        </Button>
    )
}
