import { Company } from "./company"

// lib/receipt.ts
export type Receipt = {
    receipt_number: string
    received_from: string
    payer_company?: string
    payment_for: string
    amount_numeric: number
    tax_percent?: number // 10 means 10%
    tax_amount?: number
    total_price?: number
    amount_in_words?: string
    place_of_issue?: string
    date_of_issue?: string
    recipient_name_printed?: string
    notes?: string
    issued_by?: string
    signature_image?: string
}

export type ReceiptComputed = Receipt & {
    companyInfo?: Company
    tax_amount: number
    total_price: number
    amount_in_words: string
}

export function calcReceipt(receipt: Receipt, company: Company): ReceiptComputed {
    const amount = Math.round(Number(receipt.amount_numeric || 0))

    let taxAmount = 0
    if (typeof receipt.tax_amount === 'number') {
        taxAmount = Math.round(receipt.tax_amount)
    } else if (typeof receipt.tax_percent === 'number') {
        taxAmount = Math.round((amount * receipt.tax_percent) / 100)
    } else {
        taxAmount = 0
    }

    const total = Math.round(amount + taxAmount)
    const words = receipt.amount_in_words && receipt.amount_in_words.trim().length > 0
        ? receipt.amount_in_words
        : terbilang(total) + ' RUPIAH'

    return {
        ...receipt,
        companyInfo: company,
        amount_numeric: amount,
        tax_amount: taxAmount,
        total_price: total,
        amount_in_words: words,
    }
}

/** terbilang: convert number -> Indonesian words (works up to trillions) */
export function terbilang(n: number): string {
    if (n === 0) return 'nol'
    const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']
    const scales = ['', 'ribu', 'juta', 'miliar', 'triliun']

    function underThousand(num: number): string {
        let s = ''
        const hundreds = Math.floor(num / 100)
        const tensUnits = num % 100
        if (hundreds > 0) {
            if (hundreds === 1) s += 'seratus'
            else s += units[hundreds] + ' ratus'
        }
        if (tensUnits > 0) {
            if (s) s += ' '
            if (tensUnits < 20) {
                if (tensUnits < 10) s += units[tensUnits]
                else if (tensUnits === 10) s += 'sepuluh'
                else if (tensUnits === 11) s += 'sebelas'
                else s += units[tensUnits % 10] + ' belas'
            } else {
                const tens = Math.floor(tensUnits / 10)
                const unit = tensUnits % 10
                if (tens === 1) s += 'sepuluh' // handled earlier but keep safe
                else s += units[tens] + ' puluh'
                if (unit > 0) s += ' ' + units[unit]
            }
        }
        return s
    }

    const outParts: string[] = []
    let scale = 0
    let rest = Math.abs(n)

    while (rest > 0) {
        const chunk = rest % 1000
        if (chunk) {
            let chunkWords = underThousand(chunk)
            // special rule: 1 ribu -> "seribu"
            if (scale === 1 && chunk === 1) {
                chunkWords = 'seribu'
            }
            outParts.unshift(chunkWords + (scales[scale] ? ' ' + scales[scale] : ''))
        }
        rest = Math.floor(rest / 1000)
        scale++
    }

    const result = (n < 0 ? 'minus ' : '') + outParts.join(' ').trim()
    // normalize spaces
    return result.replace(/\s+/g, ' ').trim()
}
