// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { ArrowRight, FileText, Feather, Printer, FileText as ReceiptIcon } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-slate-900">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: Hero text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="inline-block bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">Demo</span>
              <span className="text-sm text-muted-foreground">Invoice & Kwitansi generator</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Buat invoice dan kwitansi profesional, cepat — langsung unduh PDF.
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl">
              Generator sederhana yang print-ready. Isi data di form, lihat preview, lalu ekspor ke PDF — tersedia template A4 untuk invoice dan ukuran kwitansi khusus.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Link href="/invoice" className="w-full sm:w-auto">
                <Button aria-label="Go to invoice builder" className="inline-flex items-center gap-2">
                  Mulai Buat Invoice
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <Link href="/receipts" className="w-full sm:w-auto">
                <Button variant="outline" aria-label="Go to receipt builder" className="inline-flex items-center gap-2">
                  Mulai Buat Kwitansi
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-6">
              <div className="text-sm text-muted-foreground">
                <div>Template: A4 untuk invoice • Kwitansi custom-size</div>
                <div>Export: Save as PDF (browser)</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual / Illustration or preview */}
          <div className="flex justify-center lg:justify-end">
            {/* Replace with actual screenshot or SVG in public/ */}
            <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
              <Image
                src="/assets/hero.jpg"
                alt="Invoice & receipt sample preview"
                width={760}
                height={540}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-18">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <CardTitle>
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-indigo-600" />
                <span>Export cepat ke PDF</span>
              </div>
            </CardTitle>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Preview yang siap dicetak dan tombol Export yang memanggil fitur Print/Save as PDF. Tersedia A4 untuk invoice dan ukuran kwitansi khusus untuk kwitansi.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardTitle>
              <div className="flex items-center gap-3">
                <Feather size={20} className="text-indigo-600" />
                <span>Template & kustomisasi</span>
              </div>
            </CardTitle>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Edit detail klien/perusahaan, tambahkan baris item, sesuaikan notes dan instruksi pembayaran. Pilih perusahaan untuk auto-fill alamat & nomor telepon.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardTitle>
              <div className="flex items-center gap-3">
                <Printer size={20} className="text-indigo-600" />
                <span>Print-safe & mobile friendly</span>
              </div>
            </CardTitle>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Print CSS dan layout menjaga tampilan saat disimpan sebagai PDF. Dukungan custom page size untuk kwitansi.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}