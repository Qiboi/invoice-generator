import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Receipt from "@/models/Receipt"
import { getNextReceiptNumber } from "@/lib/receipt-number"

export async function GET() {
    try {
        await connectDB()

        const receipts = await Receipt.find()
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json(receipts)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Gagal mengambil data kwitansi" },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        await connectDB()

        const body = await req.json()
        const receiptNumber = await getNextReceiptNumber()

        const { receipt, companyInfo, computed } = body

        const { receipt_number: _receiptNumber, ...receiptWithoutNumber } = receipt
        const { receipt_number: _computedReceiptNumber, ...computedWithoutNumber } =
            computed

        const newReceipt = await Receipt.create({
            receipt_number: receiptNumber,
            receipt: receiptWithoutNumber,
            companyInfo,
            computed: computedWithoutNumber,
        })

        return NextResponse.json(newReceipt, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Gagal menyimpan kwitansi" },
            { status: 500 }
        )
    }
}