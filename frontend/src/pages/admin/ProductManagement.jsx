import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const API_URL = 'https://api-inventory.isavralabel.com/nonadeflorist'
const DEBOUNCE_MS = 1500

function ProductManagement() {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [items, setItems] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('sort_order_asc')
  const [form, setForm] = useState({
    category_id: '',
    subcategory_id: '',
    name: '',
    price: '',
    description: '',
    is_active: true,
    sort_order: 0,
  })
  const [imageFiles, setImageFiles] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingImages, setEditingImages] = useState([])

  const fetchProducts = useCallback(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    params.set('sort', sortBy)
    axios
      .get(`${API_URL}/api/products?${params.toString()}`)
      .then((res) => setItems(res.data))
  }, [searchTerm, sortBy])

  const fetchMeta = useCallback(() => {
    axios.get(`${API_URL}/api/categories`).then((res) => setCategories(res.data))
    axios
      .get(`${API_URL}/api/subcategories`)
      .then((res) => setSubcategories(res.data))
  }, [])

  useEffect(() => {
    fetchMeta()
  }, [fetchMeta])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value)
    })
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        data.append('images', file)
      })
    }

    try {
      if (editingId) {
        const current = items.find((it) => it.id === editingId)
        if (current?.image_url && imageFiles.length === 0) {
          data.append('image_url', current.image_url)
        }
        await axios.put(`${API_URL}/api/products/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await axios.post(`${API_URL}/api/products`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Terjadi kesalahan.'
      alert(`Gagal menyimpan product: ${msg}`)
      return
    }

    setForm({
      category_id: '',
      subcategory_id: '',
      name: '',
      price: '',
      description: '',
      is_active: true,
      sort_order: 0,
    })
    setImageFiles([])
    setEditingId(null)
    setEditingProduct(null)
    setEditingImages([])
    fetchProducts()
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    axios.get(`${API_URL}/api/products/${item.id}`).then((res) => {
      const data = res.data
      setEditingProduct(data)
      setEditingImages(data.images || [])
      setForm({
        category_id: String(data.category_id),
        subcategory_id: data.subcategory_id ? String(data.subcategory_id) : '',
        name: data.name,
        price: String(data.price),
        description: data.description || '',
        is_active: !!data.is_active,
        sort_order: data.sort_order ?? 0,
      })
      setImageFiles([])
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus product ini?')) return
    await axios.delete(`${API_URL}/api/products/${id}`)
    if (editingId === id) {
      setEditingId(null)
      setForm({
        category_id: '',
        subcategory_id: '',
        name: '',
        price: '',
        description: '',
        is_active: true,
        sort_order: 0,
      })
      setImageFiles([])
      setEditingProduct(null)
      setEditingImages([])
    }
    fetchProducts()
  }

  return (
    <div className="space-y-4" data-aos="fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Manajemen Product
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border bg-white/90 p-4 text-sm"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Category
            </label>
            <select
              value={form.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            >
              <option value="">Pilih category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Sub Category
            </label>
            <select
              value={form.subcategory_id}
              onChange={(e) => handleChange('subcategory_id', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            >
              <option value="">Opsional</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.category_name} — {sub.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Nama Product
            </label>
            <input
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              No. urut
            </label>
            <input
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(e) =>
                handleChange('sort_order', Number(e.target.value) || 0)
              }
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Harga (Rp)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Upload foto (bisa lebih dari satu)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setImageFiles(Array.from(e.target.files || []))
              }
              className="w-full text-xs text-slate-600"
            />
            {imageFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {imageFiles.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-20 w-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {editingProduct && (
            <div className="md:col-span-2 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Gambar saat ini
              </p>
              <div className="flex flex-wrap gap-3">
                {editingImages.map((img) => {
                  const isMain =
                    editingProduct.image_url &&
                    editingProduct.image_url === img.image_url
                  return (
                    <div
                      key={img.id}
                      className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={`${API_URL}${img.image_url}`}
                        alt={editingProduct.name}
                        className="h-20 w-24 object-cover"
                      />
                      {isMain && (
                        <span className="absolute left-1 top-1 rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-medium text-white">
                          Utama
                        </span>
                      )}
                      <div className="flex gap-1 p-1">
                        {!isMain && (
                          <button
                            type="button"
                            onClick={async () => {
                              const res = await axios.put(
                                `${API_URL}/api/products/${editingId}/main-image`,
                                { image_id: img.id },
                              )
                              setEditingProduct(res.data)
                              setEditingImages(res.data.images || [])
                            }}
                            className="flex-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-primary-600 ring-1 ring-primary-200 hover:bg-primary-50"
                          >
                            Jadikan utama
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await axios.delete(
                              `${API_URL}/api/products/${editingId}/images/${img.id}`,
                            )
                            setEditingProduct(res.data)
                            setEditingImages(res.data.images || [])
                          }}
                          className="flex-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-red-500 ring-1 ring-red-200 hover:bg-red-50"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )
                })}
                {editingImages.length === 0 && (
                  <p className="text-[11px] text-slate-500">
                    Belum ada gambar tersimpan untuk product ini.
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 pt-5">
            <input
              id="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-primary-500 focus:ring-primary-200"
            />
            <label
              htmlFor="is_active"
              className="text-xs text-slate-600"
            >
              Tampilkan di halaman product
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Deskripsi (React Quill)
          </label>
          <div className="rounded-2xl border border-slate-200 bg-white">
            <ReactQuill
              theme="snow"
              value={form.description}
              onChange={(value) => handleChange('description', value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-primary-500 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-600"
          >
            {editingId ? 'Update Product' : 'Simpan Product'}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Cari product (nama, kategori)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 sm:max-w-xs"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
        >
          <option value="sort_order_asc">Urutkan: No. urut naik</option>
          <option value="sort_order_desc">Urutkan: No. urut turun</option>
          <option value="id_desc">Urutkan: Terbaru</option>
          <option value="id_asc">Urutkan: Terlama</option>
        </select>
      </div>

      <div className="rounded-2xl border bg-white/90 p-4 text-xs md:text-sm">
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="pb-2 text-left">No.</th>
              <th className="pb-2 text-left">Gambar</th>
              <th className="pb-2 text-left">Nama</th>
              <th className="pb-2 text-left">Kategori</th>
              <th className="pb-2 text-left">Harga</th>
              <th className="pb-2 text-left">Status</th>
              <th className="pb-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="rounded-xl bg-slate-50">
                <td className="rounded-l-xl px-2 py-2 text-slate-500">
                  {item.sort_order ?? idx + 1}
                </td>
                <td className="px-2 py-2">
                  {item.image_url ? (
                    <img
                      src={`${API_URL}${item.image_url}`}
                      alt={item.name}
                      className="h-12 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <span className="text-slate-400">No image</span>
                  )}
                </td>
                <td className="px-2 py-2">{item.name}</td>
                <td className="px-2 py-2 text-slate-600">
                  {item.category_name}
                  {item.subcategory_name ? ` • ${item.subcategory_name}` : ''}
                </td>
                <td className="px-2 py-2 font-medium text-primary-600">
                  Rp {Number(item.price).toLocaleString('id-ID')}
                </td>
                <td className="px-2 py-2">
                  {item.is_active ? (
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-600">
                      Aktif
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      Draft
                    </span>
                  )}
                </td>
                <td className="rounded-r-xl px-2 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="mr-2 text-[11px] font-medium text-primary-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-[11px] font-medium text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-2 text-slate-500" colSpan={6}>
                  Belum ada product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductManagement

