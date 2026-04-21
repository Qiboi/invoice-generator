import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type SectionCardsProps = {
  totalRevenue: number
  totalInvoices: number
  unpaidInvoices: number
  totalCustomers: number
}

function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function SectionCards({
  totalRevenue,
  totalInvoices,
  unpaidInvoices,
  totalCustomers,
}: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatIDR(totalRevenue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Live</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Gabungan invoice dan kwitansi</div>
          <div className="text-muted-foreground">
            Total nominal dari seluruh dokumen
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Invoice</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalInvoices}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Live</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Invoice yang sudah dibuat</div>
          <div className="text-muted-foreground">
            Semua invoice tersimpan di database
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Unpaid Invoice</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {unpaidInvoices}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Live</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Invoice yang belum lunas</div>
          <div className="text-muted-foreground">
            Fokus koleksi pembayaran
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCustomers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Live</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Nama unik customer/penerima</div>
          <div className="text-muted-foreground">
            Diambil dari invoice dan kwitansi
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}