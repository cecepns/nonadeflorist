function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div
        className="grid gap-8 md:grid-cols-[1.1fr,0.9fr]"
        data-aos="fade-up"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500">
            About Us
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
            Studio buket modern dengan sentuhan personal.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            Nonade Florist berfokus pada buket yang clean, airy, dan feminin.
            Kami mengutamakan pemilihan warna, tekstur, dan komposisi yang
            seimbang agar setiap rangkaian terasa hangat dan thoughtful.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            Setiap buket dibuat secara made-to-order untuk memastikan bunga
            selalu fresh dan tetap selaras dengan cerita yang ingin Anda
            sampaikan — mulai dari momen romantis, ucapan selamat, hingga
            gesture kecil penuh perhatian.
          </p>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <div className="rounded-2xl bg-primary-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600">
              Signature Style
            </p>
            <p className="mt-2">
              Warna pastel lembut, wrapping minimalis, dan detail pita yang
              delicate.
            </p>
          </div>
          <div className="rounded-2xl bg-accent-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-700">
              Custom Request
            </p>
            <p className="mt-2">
              Bisa menyesuaikan palette warna, ukuran buket, hingga kartu ucapan
              personal.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage

