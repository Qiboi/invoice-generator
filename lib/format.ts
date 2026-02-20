// lib/format.ts
export const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    })
        .format(value)
        // replace normal spaces with non-breaking space to avoid line-wrapping in print/PDF
        .replace(/\s/g, '\u00A0')

export function formatDateToDDMMYYYY(dateStr: string): string {
    if (!dateStr) return ''

    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr // fallback kalau format tidak sesuai

    const [year, month, day] = parts
    return `${day}-${month}-${year}`
}