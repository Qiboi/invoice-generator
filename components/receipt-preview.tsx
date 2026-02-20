/* components/receipt-preview.tsx */
'use client'
import { ReceiptComputed } from '@/lib/receipt'
import { formatRupiah } from '@/lib/format'
import { formatDateToDDMMYYYY } from '@/lib/format'

export type ReceiptPreviewProps = { receipt: ReceiptComputed }

export default function ReceiptPreview({ receipt }: ReceiptPreviewProps) {
    // safe fallback untuk terbilang
    const terbilangText = (receipt.amount_in_words || '').toLocaleUpperCase()

    console.log('Rendering ReceiptPreview with receipt:', receipt)

    return (
        <div className="w-full overflow-x-auto">
            <div className="bg-black/4 p-6 rounded-xl print:bg-transparent print:p-0 print:rounded-none">
                <div
                    id="receipt-preview"
                    className="relative box-border bg-white text-black font-sans text-sm"
                    style={{
                        // paper size (matches printPageSize "315mm 100mm")
                        width: '315mm',
                        minHeight: '100mm',
                        // use same padding as printMargin (5mm) so preview content aligns with printable area
                        padding: '5mm 10mm',
                        boxSizing: 'border-box',
                    }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-black pb-2">
                        <div>
                            <div className="text-lg font-bold">{receipt.companyInfo?.name}</div>
                            <div className="text-xs text-gray-600">{receipt.companyInfo?.address}</div>
                            <div className="text-xs text-gray-600">{receipt.companyInfo?.phone}</div>
                        </div>

                        <div className="text-right">
                            <div className="text-3xl font-semibold">KUITANSI</div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className='col-span-2 space-y-4'>
                            <div className="font-semibold">Nomor: {receipt.receipt_number}</div>
                            <div className='flex items-center gap-2 text-lg'>
                                <div>
                                    <div>Sudah terima dari</div>
                                    <div>Untuk pembayaran</div>
                                    <div>Banyaknya uang</div>
                                </div>
                                <div>
                                    <div>:</div>
                                    <div>:</div>
                                    <div>:</div>
                                </div>
                                <div className='font-semibold'>
                                    <div>{receipt.received_from.toLocaleUpperCase()}</div>
                                    <div>{receipt.payment_for.toLocaleUpperCase()}</div>
                                    <div>{terbilangText}</div>
                                </div>
                            </div>
                            {/* <div className="text-sm">
                                Sudah terima dari: <span className="font-semibold"></span>
                            </div>
                            <div className="text-sm">
                                Untuk pembayaran: <span className="font-semibold">{receipt.payment_for}</span>
                            </div>
                            <div className="text-sm">
                                Banyaknya uang: <span className="font-semibold">{terbilangText}</span>
                            </div> */}
                            {/* <div>
                                <div className="text-[10px] text-gray-500">Jumlah (angka)</div>
                                <div className="text-lg font-semibold">{formatRupiah(receipt.amount_numeric)}</div>
                            </div> */}
                            {/* <div className="text-[10px] text-gray-500">PPN</div> */}
                            {/* <div className="text-lg font-semibold">
                                {receipt.tax_percent ? `${receipt.tax_percent}%` : ''}
                                {receipt.tax_amount ? ` (${formatRupiah(receipt.tax_amount)})` : ''}
                            </div> */}
                            <div>
                                <div className="text-[10px] text-gray-500">Total</div>
                                <div className="text-xl font-semibold">{formatRupiah(receipt.total_price)}</div>
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='absolute bottom-20 right-10 print:bottom-7 print:right-0 pointer-events-none'>
                                <div className="flex flex-col items-end">
                                    <div className='font-semibold'>{receipt.place_of_issue || ''}, {receipt.date_of_issue ? formatDateToDDMMYYYY(receipt.date_of_issue) : ''}</div> 
                                    <div className="mb-20">Penerima,</div>
                                    <div className="font-semibold">{receipt.recipient_name_printed || ''}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer: place & signature
              - preview: absolute with bottom = padding (5mm)
              - print: globals.css @media print will override .receipt-footer -> position: fixed; bottom: 0mm
          */}
                </div>
            </div>
        </div>
    )
}