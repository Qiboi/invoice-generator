// lib/invoice.ts
import { Company } from "./company";

export type InvoiceItem = {
    id: string;
    description: string;
    quantity: number;
    unit?: string;
    unit_price: number;
    line_total?: number;
};

export type Invoice = {
    invoice_number: string;
    issue_date: string; // yyyy-mm-dd
    due_date?: string;
    currency: string; // "IDR"
    bill_to: {
        name: string;
        company?: string;
        address?: string;
        phone?: string;
        email?: string;
    };
    project?: string;
    items: InvoiceItem[];
    discount?: number;
    taxes?: { name?: string; rate?: number; amount?: number }[]; // rate = decimal (e.g. 0.1 for 10%)
    adjustments?: number;
    notes?: string;
    payment_terms?: string;
    status?: string;
    submitted_on?: string;
    // DO NOT rely on subtotal/total fields here — calcTotals will provide computed output
};

export type InvoiceComputed = Invoice & {
    items: (InvoiceItem & { line_total: number })[];
    company_info?: Company;
    subtotal: number;
    taxesAmount: number;
    total: number;
};

/**
 * calcTotals
 * - Returns InvoiceComputed (items with line_total + subtotal, taxesAmount, total)
 * - Taxes calculation rules:
 *   1) If invoice.taxes present and tax.amount provided -> sum amounts
 *   2) Else if invoice.taxes present and tax.rate provided -> sum subtotal * rate
 *   3) Else taxesAmount = 0
 */
export function calcTotals(invoice: Invoice, company: Company): InvoiceComputed {
    const itemsWithLine = (invoice.items || []).map((it) => {
        const line = Number(it.quantity || 0) * Number(it.unit_price || 0);
        return { ...it, line_total: Math.round(line) };
    });

    const subtotal = itemsWithLine.reduce((s, it) => s + (it.line_total || 0), 0);

    // compute taxesAmount robustly
    let taxesAmount = 0;
    if (Array.isArray(invoice.taxes) && invoice.taxes.length > 0) {
        // if any tax has explicit amount, sum amounts; otherwise use rate if present
        const hasAmount = invoice.taxes.some((t) => typeof t.amount === 'number');
        if (hasAmount) {
            taxesAmount = invoice.taxes.reduce((s, t) => s + (Number(t.amount) || 0), 0);
        } else {
            // use rate(s) -> sum subtotal * rate
            taxesAmount = invoice.taxes.reduce((s, t) => s + (Number(t.rate) ? subtotal * Number(t.rate) : 0), 0);
        }
    } else {
        taxesAmount = 0; // no taxes info
    }

    const discount = Number(invoice.discount || 0);
    const adjustments = Number(invoice.adjustments || 0);

    const totalRaw = subtotal - discount + adjustments + taxesAmount;
    const total = Math.round(totalRaw);

    return {
        ...invoice,
        company_info: company,
        items: itemsWithLine,
        subtotal: Math.round(subtotal),
        taxesAmount: Math.round(taxesAmount),
        total,
    };
}
