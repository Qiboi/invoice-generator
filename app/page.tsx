// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { ArrowRight, FileText, Feather, Printer } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-slate-900">
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: Hero text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="inline-block bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">Demo</span>
              <span className="text-sm text-muted-foreground">Invoice generator</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Buat invoice profesional, cepat — langsung unduh PDF.
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl">
              Generator invoice sederhana dan print-ready. Isi data di form, lihat preview A4, lalu unduh PDF.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Link href="/invoice" className="w-full sm:w-auto">
                <Button aria-label="Go to invoice builder" className="inline-flex items-center gap-2">
                  Mulai Buat Invoice
                  <ArrowRight size={16} />
                </Button>
              </Link>

              {/* <a href="#features" className="w-full sm:w-auto">
                <Button variant="ghost" className="inline-flex items-center gap-2">
                  Lihat Fitur
                </Button>
              </a> */}
            </div>

            <div className="flex items-center gap-6 pt-6">
              <div className="text-sm text-muted-foreground">
                <div>Template: A4 Print-ready</div>
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
                alt="Invoice sample preview"
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
                Preview A4 yang siap dicetak dan tombol Export yang memanggil fitur Print/Save as PDF.
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
                Edit detail klien, tambahkan baris item, sesuaikan notes dan payment instructions.
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
                Print CSS dan layout A4 yang menjaga tampilan saat disimpan sebagai PDF.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="max-w-7xl mx-auto px-6 py-8 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/assets/logo.png" alt="logo" width={40} height={40} className="rounded" />
            <div>
              <div className="font-medium">{process.env.NEXT_PUBLIC_COMPANY_NAME || 'Nama Perusahaan'}</div>
              <div>{process.env.NEXT_PUBLIC_COMPANY_ADDRESS}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="/invoice" className="underline">Buat Invoice</a>
            <a href="#" className="underline">Dokumentasi</a>
          </div>
        </div>
      </footer> */}
    </main>
  )
}
