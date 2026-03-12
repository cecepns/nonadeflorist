import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/apiConfig";

function ContactPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("6281234567890");
  const [operationalHours, setOperationalHours] = useState(
    "Senin – Minggu, 09.00 – 20.00 WIB"
  );

  useEffect(() => {
    axios
      .get(`${API_URL}/api/public/settings`)
      .then((res) => {
        if (res.data?.whatsapp_number) {
          setWhatsappNumber(res.data.whatsapp_number);
        }
        if (res.data?.operational_hours) {
          setOperationalHours(res.data.operational_hours);
        }
      })
      .catch(() => {
        // fallback sudah di-set lewat default state
      });
  }, []);

  const handleWhatsAppClick = () => {
    const base = "https://wa.me";
    const number = whatsappNumber.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      "Halo Nonade Florist, saya ingin konsultasi buket & custom order."
    );
    window.open(`${base}/${number}?text=${text}`, "_blank");
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div
        className="rounded-3xl border bg-white/80 p-6 shadow-sm md:p-8"
        data-aos="fade-up"
      >
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500">
            Contact Us
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
            Konsultasi buket & custom order.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Kirimkan detail momen, warna yang diinginkan, dan budget — kami akan
            bantu rekomendasikan buket yang paling pas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
          <form className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Nama
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
                placeholder="Nama lengkap"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  WhatsApp
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Email (opsional)
                </label>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
                  placeholder="email@contoh.com"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Detail permintaan
              </label>
              <textarea
                rows={4}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
                placeholder="Tuliskan jenis acara, warna yang diinginkan, dan budget."
              />
            </div>
            <button
              type="button"
              className="rounded-full bg-primary-500 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
              onClick={handleWhatsAppClick}
            >
              Kirim via WhatsApp
            </button>
          </form>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-primary-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600">
                Jam Operasional
              </p>
              <p className="mt-2">{operationalHours}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;

