"use client"
"use no memo"

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
import { IconChevronLeft, IconChevronRight, IconDotsVertical } from "@tabler/icons-react"

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

type DataTableProps = {
  data: InvoiceRow[]
  onDelete: (id: string, type: "invoice" | "kwitansi") => Promise<void>
}

function RowActions({
  row,
  onDelete,
}: {
  row: InvoiceRow
  onDelete: (id: string, type: "invoice" | "kwitansi") => Promise<void>
}) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      await onDelete(row.id, row.type)
      setOpen(false)
    } catch {
      // toast ditangani di parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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
              row.type === "invoice"
                ? `/dashboard/invoices/${row.id}`
                : `/dashboard/receipts/${row.id}`)
            }
          >
            View
          </DropdownMenuItem>

          {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}

          <DropdownMenuItem
            className="text-red-500"
            onClick={() => setOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data?</AlertDialogTitle>
            <AlertDialogDescription>
              Data {row.type === "invoice" ? "invoice" : "kwitansi"} ini akan
              dihapus permanen dan tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

const columnsBase: ColumnDef<InvoiceRow>[] = [
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
    header: () => <div>Amount</div>,
    cell: ({ row }) => (
      <div className="font-medium">
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
]

export function DataTable({ data, onDelete }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = React.useMemo<ColumnDef<InvoiceRow>[]>(
    () => [
      ...columnsBase,
      {
        id: "actions",
        cell: ({ row }) => (
          <RowActions row={row.original} onDelete={onDelete} />
        ),
      },
    ],
    [onDelete]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">
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
                  className="h-24 text-center"
                >
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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