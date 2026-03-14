import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { API_URL } from "../utils/apiConfig";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/home-image.jpg";
import whyChooseUsImage from "../assets/why-choose-us.jpg";

function HomePage() {
  const [testimonials, setTestimonials] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [whyImageUrl, setWhyImageUrl] = useState("");
  const [heroContent, setHeroContent] = useState({
    badge: "Nonade Florist",
    title: "Buket bunga kurasi",
    highlight: "untuk setiap momen manis.",
    description:
      "Buket Bunga • Papan Bunga • Standing Flower Grand Opening • Wisuda • Wedding • Duka Cita • Flower Box • Hampers Unik • Dibuat dengan bunga segar & kualitas terbaik",
  });
  const [quickSection, setQuickSection] = useState({
    badge: "Pilihan cepat",
    title: "Temukan buket sesuai momennya",
    cards: [
      {
        badge: "Handmade & Custom",
        title: "Rangkaian sesuai cerita Anda",
        description:
          "Setiap rangkaian dibuat manual dengan detail & bisa request warna, tema, dan budget sesuai kebutuhan Anda.",
        variant: "primary",
      },
      {
        badge: "Same Day Delivery Sumedang",
        title: "Kirim di hari yang sama",
        description:
          "Pesan hari ini, kirim hari ini. Layanan cepat untuk surprise, ucapan, dan kebutuhan mendadak.",
        variant: "neutral",
      },
      {
        badge: "Bunga Segar & Premium Quality",
        title: "Tampilan elegan & tahan lama",
        description:
          "Menggunakan bunga fresh & material premium agar tampil elegan, rapi, dan tahan lebih lama.",
        variant: "accent",
      },
    ],
  });
  const [whySection, setWhySection] = useState({
    badge: "Kenapa Nonade?",
    title: "Detail kecil yang membuat buket terasa lebih thoughtful.",
    bullets: [
      {
        title: "Konsultasi palette warna:",
        description: "sesuaikan suasana acara dan preferensi penerima.",
      },
      {
        title: "Kartu ucapan handwritten:",
        description:
          "pesan pendek yang ditulis rapi menambah sentuhan personal.",
      },
      {
        title: "Packaging yang fotogenik:",
        description:
          "setiap buket dirancang siap difoto tanpa perlu diatur ulang.",
      },
    ],
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/api/public/testimonials`)
      .then((res) => setTestimonials(res.data))
      .catch(() => setTestimonials([]));

    axios
      .get(`${API_URL}/api/public/products`)
      .then((res) => setProducts(res.data.slice(0, 9)))
      .catch(() => setProducts([]));

    axios
      .get(`${API_URL}/api/public/banners`)
      .then((res) => setBanners(res.data))
      .catch(() => setBanners([]));

    axios
      .get(`${API_URL}/api/public/quotes`)
      .then((res) => setQuotes(res.data))
      .catch(() => setQuotes([]));

    axios
      .get(`${API_URL}/api/public/settings`)
      .then((res) => {
        if (res.data?.home_hero) {
          const { image_url, ...heroRest } = res.data.home_hero;
          setHeroContent((prev) => ({ ...prev, ...heroRest }));
          if (image_url) {
            setHeroImageUrl(image_url);
          }
        }
        if (res.data?.home_quick) {
          setQuickSection((prev) => ({ ...prev, ...res.data.home_quick }));
        }
        if (res.data?.home_why) {
          const { image_url, ...whyRest } = res.data.home_why;
          setWhySection((prev) => ({ ...prev, ...whyRest }));
          if (image_url) {
            setWhyImageUrl(image_url);
          }
        }
      })
      .catch(() => {
        // keep defaults
      });
  }, []);

  const getQuickCardClasses = (variant) => {
    if (variant === "accent") {
      return "rounded-3xl border border-accent-100 bg-accent-50/40 p-4 shadow-sm";
    }
    if (variant === "neutral") {
      return "rounded-3xl border border-slate-100 bg-white p-4 shadow-sm";
    }
    return "rounded-3xl border border-primary-100 bg-primary-50/40 p-4 shadow-sm";
  };

  return (
    <div>
      {/* TOP BANNER SLIDER */}
      {banners.length > 0 && (
        <section
          className="mt-4 mb-6 rounded-lg shadow-sm md:p-5"
        >
          <div className="relative mx-auto max-w-6xl px-4 md:px-0">
            <button
              type="button"
              className="banner-prev absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-primary-200 bg-white/95 text-primary-600 shadow-sm hover:bg-primary-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="banner-next absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-primary-200 bg-white/95 text-primary-600 shadow-sm hover:bg-primary-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <Swiper
              className="banner-swiper"
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{
                prevEl: '.banner-prev',
                nextEl: '.banner-next',
              }}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              loop
              spaceBetween={12}
            >
              {banners.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <div className="overflow-hidden rounded-2xl">
                    {banner.link_url ? (
                      <a
                        href={banner.link_url}
                        target={
                          banner.link_url.startsWith('http') ? '_blank' : undefined
                        }
                        rel={
                          banner.link_url.startsWith('http') ? 'noreferrer' : undefined
                        }
                      >
                        <img
                          src={`${API_URL}${banner.image_url}`}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </a>
                    ) : (
                      <img
                        src={`${API_URL}${banner.image_url}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 flex flex-col gap-10 pb-16 pt-10 md:flex-row md:items-center md:pb-20 md:pt-16">
        <div className="md:w-3/5" data-aos="fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500">
            {heroContent.badge}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl md:text-[2.7rem] md:leading-[1.15]">
            {heroContent.title}
            <span className="block text-primary-500">
              {heroContent.highlight}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
            {heroContent.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs md:text-sm">
            <button
              type="button"
              className="rounded-full bg-primary-500 px-5 py-2 font-medium text-white shadow-sm hover:bg-primary-600"
              onClick={() => {
                window.location.href = "/products";
              }}
            >
              Lihat koleksi buket
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-5 py-2 font-medium text-slate-700 hover:border-primary-200 hover:text-primary-600"
              onClick={() => {
                window.location.href = "/contact";
              }}
            >
              Konsultasi custom order
            </button>
          </div>
        </div>

        <div className="max-w-lg" data-aos="fade-left">
          <img
            src={heroImageUrl ? `${API_URL}${heroImageUrl}` : heroImage}
            alt="Hero Image"
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      </section>

      {/* HIGHLIGHT KATEGORI */}
      <section
        className="mx-auto max-w-6xl px-4 mb-14 space-y-6"
        data-aos="fade-up"
        data-aos-delay="80"
      >
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-500">
              {quickSection.badge}
            </p>
            <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
              {quickSection.title}
            </h2>
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-3">
          {quickSection.cards.map((card) => (
            <div key={card.title} className={getQuickCardClasses(card.variant)}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">
                {card.badge}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {card.title}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* KOLEKSI PRODUK */}
      <section
        className="mx-auto max-w-6xl px-4 mb-16 space-y-6 border-t border-slate-100 pt-10"
        data-aos="fade-up"
        data-aos-delay="90"
      >
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500">
              Koleksi Produk Nonadeflorist
            </p>
            <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
              Beragam pilihan buket bunga, papan bunga, standing flower &amp;
              hampers siap dikirim ke seluruh Indonesia.
            </h2>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group rounded-3xl border bg-white/80 p-3 shadow-sm transition hover:-translate-y-1 hover:border-primary-100 hover:shadow-md"
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-primary-50/40">
                  {product.image_url ? (
                    <img
                      src={`${API_URL}${product.image_url}`}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </div>
              </Link>
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {product.category_name}
                  {product.subcategory_name
                    ? ` • ${product.subcategory_name}`
                    : ""}
                </p>
                <h3 className="text-sm font-semibold text-slate-900">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-primary-600">
                  Rp {Number(product.price).toLocaleString("id-ID")}
                </p>
              </div>
              <div className="mt-3">
                <Link
                  to={`/products/${product.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary-600"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Lihat selengkapnya</span>
                </Link>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-slate-500">
              Produk akan tampil di sini setelah Anda menambahkannya dari Admin
              Panel.
            </p>
          )}
        </div>
      </section>

      {/* MINI GALLERY / WHY CHOOSE US */}
      <section
        className="mx-auto max-w-6xl px-4 mb-16 grid gap-8 border-t border-slate-100 pt-10 md:grid-cols-[1.1fr,0.9fr]"
        data-aos="fade-up"
        data-aos-delay="120"
      >
        <div className="w-full h-96 flex justify-center items-center rounded-3xl overflow-hidden">
          <img
            src={whyImageUrl ? `${API_URL}${whyImageUrl}` : whyChooseUsImage}
            alt="Why Choose Us"
            className="w-full h-full object-cover object-bottom"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500">
            {whySection.badge}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900 md:text-xl">
            {whySection.title}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 md:text-base">
            {whySection.bullets.map((item) => (
              <li key={item.title}>
                <span className="font-semibold text-slate-800">
                  {item.title}
                </span>{" "}
                {item.description}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* QUOTE PEMILIK */}
      {quotes.length > 0 && (
        <section
          className="mx-auto max-w-6xl px-4 mb-10 rounded-3xl bg-primary-50/60 border border-primary-100 px-4 py-8 text-slate-900 md:px-8 md:py-10"
          data-aos="fade-up"
        >
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500">
                Dari Pemilik Nonade Florist
              </p>
              <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
                Sedikit pesan hangat untuk kamu yang mampir.
              </h2>
            </div>
          </div>

          <div className="relative">
            {quotes.length > 1 && (
              <>
                <button
                  type="button"
                    className="quote-prev absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border border-primary-200 bg-white/95 text-primary-600 shadow-sm hover:bg-primary-50 md:flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                    className="quote-next absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-primary-200 bg-white/95 text-primary-600 shadow-sm hover:bg-primary-50 md:flex"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <Swiper
              className="quote-swiper pb-12"
              modules={[Navigation, Pagination, Autoplay]}
              navigation={
                quotes.length > 1
                  ? {
                      prevEl: ".quote-prev",
                      nextEl: ".quote-next",
                    }
                  : undefined
              }
              pagination={{ clickable: true }}
              loop={quotes.length > 1}
              autoplay={
                quotes.length > 1
                  ? {
                      delay: 5000,
                      disableOnInteraction: false,
                    }
                  : undefined
              }
              spaceBetween={18}
              slidesPerView={1}
            >
              {quotes.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="h-full rounded-3xl bg-white p-6 text-sm shadow-sm md:p-7">
                    {!!item.author && item.author !== "Pemilik Nonade Florist" && (
                      <p className="text-xs uppercase tracking-[0.18em] text-primary-500">
                        {item.author}
                      </p>
                    )}
                    <p className="mt-3 text-base leading-relaxed text-slate-800">
                      “{item.message}”
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* TESTIMONI PELANGGAN */}
      <section
        className="mx-auto max-w-6xl px-4 mb-20 rounded-3xl bg-slate-50 px-4 py-8 md:px-8 md:py-10 overflow-x-hidden"
        data-aos="fade-up"
      >
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600">
              Testimoni Pelanggan
            </p>
            <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
              Cerita manis dari penerima buket Nonade Florist.
            </h2>
          </div>
        </div>

        {testimonials.length > 0 ? (
          <div className="relative">
            {testimonials.length > 0 && (
              <>
                <button
                  type="button"
                  className="testimonial-prev absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border border-primary-200 bg-white/95 text-primary-600 shadow-sm hover:bg-primary-50 md:flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="testimonial-next absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-primary-200 bg-white/95 text-primary-600 shadow-sm hover:bg-primary-50 md:flex"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <Swiper
              className="testimonial-swiper"
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{
                prevEl: ".testimonial-prev",
                nextEl: ".testimonial-next",
              }}
              pagination={{ clickable: true }}
              loop
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              spaceBetween={18}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 3, spaceBetween: 22 },
              }}
            >
              {testimonials.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="h-full rounded-3xl bg-white p-6 text-sm shadow-sm md:p-7">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {item.location || "Pelanggan"}
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {item.customer_name}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                      “{item.message}”
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Testimoni akan tampil di sini setelah Anda menambahkannya dari Admin
            Panel.
          </p>
        )}
      </section>
    </div>
  );
}

export default HomePage;
