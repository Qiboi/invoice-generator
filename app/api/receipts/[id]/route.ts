import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Receipt from "@/models/Receipt"

export async function GET(
    req: NextRequest,
    { params }: {
        params: Promise<{ id: string }>
    }) {
    try {
        await connectDB()

        const { id } = await params;
        const receipt = await Receipt.findById(id).lean()

        if (!receipt) {
            return NextResponse.json(
                { message: "Kwitansi tidak ditemukan" },
                { status: 404 }
            )
        }

        return NextResponse.json(receipt)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Gagal mengambil kwitansi" },
            { status: 500 }
        )
    }
}

export async function PUT(
    req: NextRequest,
    { params }: {
        params: Promise<{ id: string }>
    }) {
    try {
        await connectDB()

        const body = await req.json()
        const { receipt, companyInfo, computed } = body
        const { id } = await params;

        const { receipt_number: _receiptNumber, ...receiptWithoutNumber } = receipt
        const { receipt_number: _computedReceiptNumber, ...computedWithoutNumber } =
            computed

        const updated = await Receipt.findByIdAndUpdate(
            id,
            {
                receipt: receiptWithoutNumber,
                companyInfo,
                computed: computedWithoutNumber,
            },
            { new: true }
        )

        if (!updated) {
            return NextResponse.json(
                { message: "Kwitansi tidak ditemukan" },
                { status: 404 }
            )
        }

        return NextResponse.json(updated)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Gagal update kwitansi" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: {
        params: Promise<{ id: string }>
    }) {
    try {
        await connectDB()

        const { id } = await params;
        const deleted = await Receipt.findByIdAndDelete(id)

        if (!deleted) {
            return NextResponse.json(
                { message: "Kwitansi tidak ditemukan" },
                { status: 404 }
            )
        }

        return NextResponse.json({ message: "Kwitansi berhasil dihapus" })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Gagal menghapus kwitansi" },
            { status: 500 }
        )
    }
}