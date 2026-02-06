import { Invoice } from "@/lib/invoice";

export const initialInvoice: Invoice = {
    invoice_number: 'LKP-02-03012025',
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: '',
    currency: 'IDR',
    bill_to: {
        name: 'Raniandi',
        company: 'PT Lahap Kalap',
        address: 'Jl. Anggrek No. 34, Jakarta',
        phone: '0812-9876-5432',
        email: ''
    },
    project: 'Beli bahan baku',
    items: [
        { id: '1', description: 'Ayam Potong Segar', quantity: 50, unit: 'Kg', unit_price: 35000 },
        { id: '2', description: 'Bumbu Ayam Bakar Siap Pakai', quantity: 10, unit: 'kg', unit_price: 30000 },
        { id: '3', description: 'Arang Kayu', quantity: 5, unit: 'pack', unit_price: 40000 },
        { id: '4', description: 'Daun Pisang', quantity: 500, unit: 'lembar', unit_price: 500 }
    ],
    // subtotal: undefined,
    discount: 0,
    taxes: [],
    adjustments: 0,
    // total: undefined,
    notes: '',
    payment_terms: 'Net 15'
}
