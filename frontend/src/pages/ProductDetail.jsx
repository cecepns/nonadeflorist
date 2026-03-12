import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../utils/apiConfig'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    setLoading(true)

    Promise.all([
      axios.get(`${API_URL}/api/public/products/${id}`),
      axios.get(`${API_URL}/api/public/settings`),
    ])
      .then(([productRes, settingsRes]) => {
        setProduct(productRes.data)
        setSettings(settingsRes.data)
      })
      .catch(() => {
        setProduct(null)
        setSettings(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleWhatsApp = () => {
    if (!product) return
    const whatsappNumber =
      settings?.whatsapp_number || '6281234567890'
    const text = `Halo Nonade Florist, saya ingin memesan produk:\n\n` +
      `Nama: ${product.name}\n` +
      `Harga: Rp ${Number(product.price).toLocaleString('id-ID')}\n\n` +
      `Link produk: ${window.location.href}`
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      text,
    )}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-slate-500">Memuat detail produk...</p>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-slate-500">Produk tidak ditemukan.</p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-xs font-medium text-slate-500 hover:text-primary-600"
      >
        ← Kembali
      </button>

      <div className="grid gap-8 md:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-3xl bg-slate-50 p-3">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
            {product.image_url && (
              <img
                src={`${API_URL}${product.image_url}`}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500">
              {product.category_name}
              {product.subcategory_name ? ` • ${product.subcategory_name}` : ''}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
              {product.name}
            </h1>
          </div>

          <p className="text-lg font-semibold text-primary-600">
            Rp {Number(product.price).toLocaleString('id-ID')}
          </p>

          <div className="prose prose-sm max-w-none text-slate-700 [&_p]:mb-2 [&_p:last-child]:mb-0">
            {product.description ? (
              <div
                // React Quill output
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p>Deskripsi belum tersedia.</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="rounded-full bg-primary-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
            >
              Checkout via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetail

