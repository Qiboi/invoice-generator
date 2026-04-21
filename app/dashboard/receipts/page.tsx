"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Plus } from "lucide-react"

type ReceiptDB = {
    _id: string
    receipt_number: string
    computed: {
        received_from: string
        total_price: number
        date_of_issue: string
    }
}

function formatIDR(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value)
}

export default function ReceiptsPage() {
    const [data, setData] = useState<ReceiptDB[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const fetchData = async () => {
        try {
            const res = await fetch("/api/receipts")
            const json = await res.json()
            setData(json || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Kwitansi</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola semua kwitansi
                    </p>
                </div>

                <Link
                    href="/dashboard/receipts/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                    <Plus className="h-4 w-4" />
                    Buat Kwitansi
                </Link>
            </div>

            {/* TABLE */}
            <div className="border rounded-2xl bg-white">
                <div className="p-5 border-b flex justify-between">
                    <h2 className="font-semibold">Daftar Kwitansi</h2>

                    <button
                        onClick={fetchData}
                        className="text-sm text-muted-foreground flex items-center gap-1"
                    >
                        Refresh <ArrowUpRight className="h-4 w-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="p-6">Loading...</div>
                ) : data.length === 0 ? (
                    <div className="p-6 text-sm text-muted-foreground">
                        Belum ada kwitansi
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/40 text-muted-foreground">
                            <tr>
                                <th className="px-5 py-3">No</th>
                                <th className="px-5 py-3">Nomor</th>
                                <th className="px-5 py-3">Diterima dari</th>
                                <th className="px-5 py-3">Tanggal</th>
                                <th className="px-5 py-3">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((item, i) => (
                                <tr
                                    key={item._id}
                                    className="border-b hover:bg-muted/30 cursor-pointer"
                                    onClick={() =>
                                        router.push(`/dashboard/receipts/${item._id}`)
                                    }
                                >
                                    <td className="px-5 py-4">{i + 1}</td>

                                    <td className="px-5 py-4 font-medium">
                                        {item.receipt_number}
                                    </td>

                                    <td className="px-5 py-4">
                                        {item.computed?.received_from || "-"}
                                    </td>

                                    <td className="px-5 py-4">
                                        {item.computed?.date_of_issue || "-"}
                                    </td>

                                    <td className="px-5 py-4">
                                        {formatIDR(item.computed?.total_price || 0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}