import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Invoice from "@/models/Invoice"
import { calcTotals } from "@/lib/invoice"

export async function GET(
    req: NextRequest,
    { params }: {
        params: Promise<{ id: string }>
    }) {
    try {
        await connectDB()
        const { id } = await params;

        const invoice = await Invoice.findById(id)

        if (!invoice) {
            return NextResponse.json(
                { message: "Invoice tidak ditemukan" },
                { status: 404 }
            )
        }

        return NextResponse.json(invoice)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Gagal mengambil invoice" },
            { status: 500 }
        )
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()

        const { id } = await params
        const body = await req.json()

        const invoice = body.invoice
        const companyInfo = body.companyInfo

        if (!invoice || !companyInfo) {
            return NextResponse.json(
                { message: "Data invoice tidak lengkap" },
                { status: 400 }
            )
        }

        const current = await Invoice.findById(id)

        if (!current) {
            return NextResponse.json(
                { message: "Invoice tidak ditemukan" },
                { status: 404 }
            )
        }

        const computed = calcTotals(invoice, companyInfo)

        const updated = await Invoice.findByIdAndUpdate(
            id,
            {
                invoice: {
                    ...invoice,
                    invoice_number: current.invoice_number,
                },
                companyInfo,
                computed,
            },
            { new: true }
        )

        return NextResponse.json(updated)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Gagal update invoice" },
            { status: 500 }
        )
    }
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()

        const { id } = await params
        const deleted = await Invoice.findByIdAndDelete(id)

        if (!deleted) {
            return NextResponse.json(
                { message: "Invoice tidak ditemukan" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            message: "Invoice berhasil dihapus",
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Gagal menghapus invoice" },
            { status: 500 }
        )
    }
}