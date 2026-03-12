import { useEffect, useState } from 'react'
import axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const API_URL = 'http://api-inventory.isavralabel.com/nonadeflorist'

function ProductManagement() {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    category_id: '',
    subcategory_id: '',
    name: '',
    price: '',
    description: '',
    is_active: true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const fetchAll = () => {
    axios.get(`${API_URL}/api/categories`).then((res) => setCategories(res.data))
    axios
      .get(`${API_URL}/api/subcategories`)
      .then((res) => setSubcategories(res.data))
    axios.get(`${API_URL}/api/products`).then((res) => setItems(res.data))
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value)
    })
    if (imageFile) {
      data.append('image', imageFile)
    }

    if (editingId) {
      const current = items.find((it) => it.id === editingId)
      if (current?.image_url && !imageFile) {
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

    setForm({
      category_id: '',
      subcategory_id: '',
      name: '',
      price: '',
      description: '',
      is_active: true,
    })
    setImageFile(null)
    setEditingId(null)
    fetchAll()
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      category_id: String(item.category_id),
      subcategory_id: item.subcategory_id ? String(item.subcategory_id) : '',
      name: item.name,
      price: String(item.price),
      description: item.description || '',
      is_active: !!item.is_active,
    })
    setImageFile(null)
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
      })
      setImageFile(null)
    }
    fetchAll()
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
              Upload foto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-600"
            />
          </div>
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

      <div className="rounded-2xl border bg-white/90 p-4 text-xs md:text-sm">
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="pb-2 text-left">Gambar</th>
              <th className="pb-2 text-left">Nama</th>
              <th className="pb-2 text-left">Kategori</th>
              <th className="pb-2 text-left">Harga</th>
              <th className="pb-2 text-left">Status</th>
              <th className="pb-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="rounded-xl bg-slate-50">
                <td className="rounded-l-xl px-2 py-2">
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
                <td className="py-2 text-slate-500" colSpan={4}>
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

