import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { API_URL } from '../utils/apiConfig'

function ProductPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios
      .get(`${API_URL}/api/public/products`)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <header
        className="mb-6 flex flex-col items-start justify-between gap-3 md:mb-8 md:flex-row md:items-end"
        data-aos="fade-up"
      >
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
      </header>

      <div
        className="grid gap-5 md:grid-cols-3"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="group rounded-3xl border bg-white/70 p-3 shadow-sm transition hover:-translate-y-1 hover:border-primary-100 hover:shadow-md"
          >
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

