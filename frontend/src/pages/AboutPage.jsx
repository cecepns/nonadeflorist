import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/apiConfig";

function AboutPage() {
  const [about, setAbout] = useState({
    subtitle: "About Us",
    title: "Studio buket modern dengan sentuhan personal.",
    paragraph_1:
      "Nonade Florist berfokus pada buket yang clean, airy, dan feminin. Kami mengutamakan pemilihan warna, tekstur, dan komposisi yang seimbang agar setiap rangkaian terasa hangat dan thoughtful.",
    paragraph_2:
      "Setiap buket dibuat secara made-to-order untuk memastikan bunga selalu fresh dan tetap selaras dengan cerita yang ingin Anda sampaikan — mulai dari momen romantis, ucapan selamat, hingga gesture kecil penuh perhatian.",
    highlights: [
      {
        title: "Signature Style",
        description:
          "Warna pastel lembut, wrapping minimalis, dan detail pita yang delicate.",
        variant: "primary",
      },
      {
        title: "Custom Request",
        description:
          "Bisa menyesuaikan palette warna, ukuran buket, hingga kartu ucapan personal.",
        variant: "accent",
      },
    ],
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/api/public/settings`)
      .then((res) => {
        if (res.data?.about) {
          setAbout((prev) => ({
            ...prev,
            ...res.data.about,
          }));
        }
      })
      .catch(() => {
        // keep defaults
      });
  }, []);

  const getHighlightClasses = (variant) => {
    if (variant === "accent") {
      return "rounded-2xl bg-accent-50/70 p-4";
    }
    return "rounded-2xl bg-primary-50/60 p-4";
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div
        className="grid gap-8 md:grid-cols-[1.1fr,0.9fr]"
        data-aos="fade-up"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500">
            {about.subtitle}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
            {about.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            {about.paragraph_1}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            {about.paragraph_2}
          </p>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          {about.highlights.map((item) => (
            <div key={item.title} className={getHighlightClasses(item.variant)}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600">
                {item.title}
              </p>
              <p className="mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutPage;

