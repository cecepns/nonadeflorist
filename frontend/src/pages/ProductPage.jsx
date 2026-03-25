import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { ShoppingBag, Search } from 'lucide-react'
import { API_URL } from '../utils/apiConfig'

const DEBOUNCE_MS = 1500

function ProductPage() {
  const [products, setProducts] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    axios
      .get(`${API_URL}/api/public/products?${params.toString()}`)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
  }, [searchTerm])

  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [searchInput])

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <header
        className="mb-6 flex flex-col items-start justify-between gap-3 md:mb-8 md:flex-row md:items-end"
        data-aos="fade-up"
      >
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500">
            Koleksi
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
            Buket pilihan Nonade Florist
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Pilih dari kategori curated kami, dengan kombinasi warna lembut dan
            wrapping minimalis.
          </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white/90 py-2 pl-10 pr-3 text-sm outline-none ring-primary-200 placeholder:text-slate-400 focus:ring-2"
            />
          </div>
        </div>
      </header>

      <div
        className="grid gap-5 md:grid-cols-3"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="group rounded-3xl border bg-white/70 p-3 shadow-sm transition hover:-translate-y-1 hover:border-primary-100 hover:shadow-md"
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
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {product.category_name}
                  {product.subcategory_name ? ` • ${product.subcategory_name}` : ''}
                </p>
                <h3 className="text-sm font-semibold text-slate-900">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-primary-600">
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </p>
              </div>
            </Link>
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
            Belum ada produk aktif. Silakan tambahkan dari Admin Panel.
          </p>
        )}
      </div>
    </section>
  )
}

export default ProductPage

