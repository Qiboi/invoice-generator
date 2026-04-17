import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Invoice from "@/models/Invoice"
import { getNextInvoiceNumber } from "@/lib/invoice-number"

export async function GET() {
    try {
        await connectDB()

        const invoices = await Invoice.find()
            .sort({ createdAt: -1 }) // terbaru di atas
            .lean()

        return NextResponse.json(invoices)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Gagal mengambil data invoice" },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        await connectDB()

        const body = await req.json()
        const invoiceNumber = await getNextInvoiceNumber()

        const { invoice, companyInfo, computed } = body

        const { invoice_number: _invoiceNumber, ...invoiceWithoutNumber } = invoice
        const { invoice_number: _computedInvoiceNumber, ...computedWithoutNumber } =
            computed

        const newInvoice = await Invoice.create({
            invoice_number: invoiceNumber,
            status: "draft",
            invoice: invoiceWithoutNumber,
            companyInfo,
            computed: computedWithoutNumber,
        })

        return NextResponse.json(newInvoice, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Gagal menyimpan invoice" },
            { status: 500 }
        )
    }
}