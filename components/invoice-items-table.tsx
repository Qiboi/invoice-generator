'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/format'
import clsx from 'clsx'

export type InvoiceItem = {
    id: string
    description: string
    quantity: number
    unit?: string
    unit_price: number
}

type Props = {
    items: InvoiceItem[]
    editable?: boolean
    onChange?: (items: InvoiceItem[]) => void
    onAdd?: () => void
    onRemove?: (id: string) => void
}

export default function InvoiceItemsTable({
    items,
    editable = true,
    onChange,
    onRemove,
}: Props) {
    const updateItem = (id: string, patch: Partial<InvoiceItem>) => {
        onChange?.(items.map(it => (it.id === id ? { ...it, ...patch } : it)))
    }

    const handleRemove = (id: string) => {
        if (onRemove) return onRemove(id)
        onChange?.(items.filter(i => i.id !== id))
    }

    return (
        <div className="w-full">
            <Table className="w-full border-collapse">
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-16 text-right">Qty</TableHead>
                        <TableHead className="w-20 text-right">Unit</TableHead>
                        <TableHead className="w-28 text-right">Unit price</TableHead>
                        <TableHead className="w-28 text-right">Total</TableHead>
                        {editable && <TableHead className="w-10" />}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {items.map((item, idx) => {
                        const lineTotal = (item.quantity || 0) * (item.unit_price || 0)

                        return (
                            <TableRow
                                key={item.id}
                                className={clsx(idx % 2 === 1 && 'bg-muted/10')}
                            >
                                {/* Description */}
                                <TableCell>
                                    {editable ? (
                                        <Input
                                            value={item.description}
                                            placeholder="Nama barang / jasa"
                                            onChange={(e) =>
                                                updateItem(item.id, { description: e.target.value })
                                            }
                                        />
                                    ) : (
                                        item.description || '-'
                                    )}
                                </TableCell>

                                {/* Qty */}
                                <TableCell className="text-right">
                                    {editable ? (
                                        <Input
                                            type="number"
                                            min={0}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(item.id, { quantity: Number(e.target.value || 0) })
                                            }
                                            className="w-16 text-right"
                                        />
                                    ) : (
                                        item.quantity
                                    )}
                                </TableCell>

                                {/* Unit */}
                                <TableCell className="text-right">
                                    {editable ? (
                                        <Input
                                            value={item.unit || ''}
                                            placeholder="kg"
                                            onChange={(e) =>
                                                updateItem(item.id, { unit: e.target.value })
                                            }
                                            className="w-16 text-right"
                                        />
                                    ) : (
                                        item.unit || '-'
                                    )}
                                </TableCell>

                                {/* Unit price */}
                                <TableCell className="text-right tabular-nums">
                                    {editable ? (
                                        <Input
                                            type="number"
                                            min={0}
                                            value={item.unit_price}
                                            onChange={(e) =>
                                                updateItem(item.id, {
                                                    unit_price: Number(e.target.value || 0),
                                                })
                                            }
                                            className="w-28 text-right"
                                        />
                                    ) : (
                                        formatRupiah(item.unit_price)
                                    )}
                                </TableCell>

                                {/* Total */}
                                <TableCell className="text-right font-medium tabular-nums whitespace-nowrap">
                                    {formatRupiah(lineTotal)}
                                </TableCell>

                                {/* Remove */}
                                {editable && (
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemove(item.id)}
                                            className="text-muted-foreground hover:text-red-600"
                                        >
                                            ✕
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
