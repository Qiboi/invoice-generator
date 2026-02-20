'use client'

import React from 'react'
import { Receipt } from '@/lib/receipt'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Company } from '@/lib/company'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type Props = {
    receipt: Receipt
    companyInfo: Company
    setReceipt: React.Dispatch<React.SetStateAction<Receipt>>
    setCompanyInfo: React.Dispatch<React.SetStateAction<Company>>
}

export default function ReceiptForm({ receipt, companyInfo, setReceipt, setCompanyInfo }: Props) {
    function update<K extends keyof Receipt>(key: K, value: Receipt[K]) {
        setReceipt(prev => ({ ...prev, [key]: value }))
    }

    const companyOptions: Company[] = [
        {
            name: 'PT. SARR ADHIKARI COMPANY',
            address: 'Jalan Kungkung No.12, Jakarta Selatan',
            phone: '(021) 12345678',
        },
        {
            name: 'CV. SELAMAT SENTOSA',
            address: 'Jl. Mawar No.3, Bandung',
            phone: '0812-3456-7890',
        },
    ]

    const onSelectCompany = (value: string) => {
        // find preset and merge into companyInfo (keep any custom fields)
        const preset = companyOptions.find(c => c.name === value)
        if (preset) {
            setCompanyInfo(prev => ({ ...prev, ...preset }))
        } else {
            setCompanyInfo(prev => ({ ...prev, name: value }))
        }
    }

    return (
        <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
            <div>
                <Label>Company</Label>

                <div className="mb-2">
                    <Select value={companyInfo.name} onValueChange={onSelectCompany}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih nama perusahaan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PT. SARR ADHIKARI COMPANY">PT. SARR ADHIKARI COMPANY</SelectItem>
                            <SelectItem value="CV. SELAMAT SENTOSA">CV. SELAMAT SENTOSA</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* <div className="grid grid-cols-1 gap-2">
                    <Input
                        placeholder="Alamat perusahaan"
                        value={companyInfo.address || ''}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                    />
                    <Input
                        placeholder="Telepon perusahaan"
                        value={companyInfo.phone || ''}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                    />
                </div> */}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Nomor Kwitansi</Label>
                    <Input
                        value={receipt.receipt_number}
                        onChange={(e) => update('receipt_number', e.target.value)}
                    />
                </div>

                <div>
                    <Label>Tanggal</Label>
                    <Input
                        type="date"
                        value={receipt.date_of_issue}
                        onChange={(e) => update('date_of_issue', e.target.value)}
                    />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <Label>Diterima dari</Label>
                    <Input
                        value={receipt.received_from}
                        onChange={(e) => update('received_from', e.target.value)}
                    />
                </div>

                <div>
                    <Label>Jumlah (Angka)</Label>
                    <Input
                        type="number"
                        min={0}
                        value={receipt.amount_numeric || ''}
                        onChange={(e) =>
                            update('amount_numeric', Number(e.target.value || 0))
                        }
                    />
                </div>
            </div>

            <div>
                <Label>Untuk Pembayaran</Label>
                <Textarea
                    value={receipt.payment_for}
                    onChange={(e) => update('payment_for', e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">

                <div>
                    <Label>Tempat Terbit</Label>
                    <Input
                        value={receipt.place_of_issue || ''}
                        onChange={(e) => update('place_of_issue', e.target.value)}
                    />
                </div>

                <div>
                    <Label>Nama Penerima (ttd)</Label>
                    <Input
                        value={receipt.recipient_name_printed || ''}
                        onChange={(e) =>
                            update('recipient_name_printed', e.target.value)
                        }
                    />
                </div>

                {/* <div>
                    <Label>Pajak (%)</Label>
                    <Input
                        type="number"
                        min={0}
                        value={receipt.tax_percent ?? 0}
                        onChange={(e) =>
                            update('tax_percent', Number(e.target.value || 0))
                        }
                    />
                </div> */}
            </div>


            {/* <div>
                <Label>Catatan (Opsional)</Label>
                <Textarea
                    value={receipt.notes || ''}
                    onChange={(e) => update('notes', e.target.value)}
                />
            </div> */}
        </div>
    )
}
