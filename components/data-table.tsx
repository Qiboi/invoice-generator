"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import {
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ================= TYPES =================
export type InvoiceRow = {
  id: string
  number: string
  type: "invoice" | "kwitansi"
  customer: string
  amount: number
  status: "draft" | "paid" | "unpaid" | "overdue"
  date: string
  due_date: string | null
  items: number
}

// ================= COLUMNS =================
const columns: ColumnDef<InvoiceRow>[] = [
  {
    accessorKey: "number",
    header: "Number",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.type === "invoice" ? "Invoice" : "Kwitansi"}
      </Badge>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        Rp {row.original.amount.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => row.original.due_date ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      if (status === "paid") {
        return <Badge className="bg-green-600 text-white">Paid</Badge>
      }
      if (status === "overdue") {
        return <Badge variant="destructive">Overdue</Badge>
      }
      if (status === "draft") {
        return <Badge variant="outline">Draft</Badge>
      }
      return <Badge variant="secondary">Unpaid</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
            (window.location.href =
              row.original.type === "invoice"
                ? `/dashboard/invoices/${row.original.id}`
                : `/dashboard/receipts/${row.original.id}`)
            }
          >
            View
          </DropdownMenuItem>

          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-red-500">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// ================= COMPONENT =================
export function DataTable({ data }: { data: InvoiceRow[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">
      {/* TABLE */}
      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <IconChevronLeft />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <IconChevronRight />
        </Button>
      </div>
    </div>
  )
}