import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Invoice from "@/models/Invoice"

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> 
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