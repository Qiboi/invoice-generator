// lib/format.ts
export const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    })
        .format(value)
        // replace normal spaces with non-breaking space to avoid line-wrapping in print/PDF
        .replace(/\s/g, '\u00A0')
