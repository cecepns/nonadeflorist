import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://api.kingcreativestudio.my.id/nonadeflorist'

function SubcategoryManagement() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [editingId, setEditingId] = useState(null)

  const fetchAll = () => {
    axios.get(`${API_URL}/api/categories`).then((res) => setCategories(res.data))
    axios.get(`${API_URL}/api/subcategories`).then((res) => setItems(res.data))
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await axios.put(`${API_URL}/api/subcategories/${editingId}`, {
        category_id: categoryId,
        name,
        slug,
      })
    } else {
      await axios.post(`${API_URL}/api/subcategories`, {
        category_id: categoryId,
        name,
        slug,
      })
    }
    setName('')
    setSlug('')
    setCategoryId('')
    setEditingId(null)
    fetchAll()
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setCategoryId(String(item.category_id))
    setName(item.name)
    setSlug(item.slug)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus sub category ini?')) return
    await axios.delete(`${API_URL}/api/subcategories/${id}`)
    if (editingId === id) {
      setEditingId(null)
      setCategoryId('')
      setName('')
      setSlug('')
    }
    fetchAll()
  }

  return (
    <div className="space-y-4" data-aos="fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Manajemen Sub Category
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-2xl border bg-white/90 p-4 text-sm md:grid-cols-[1.1fr,1.1fr,1.1fr,auto]"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
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
            Nama Sub Category
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Slug
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-full bg-primary-500 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-600"
          >
            {editingId ? 'Update' : 'Simpan'}
          </button>
        </div>
      </form>
      <div className="rounded-2xl border bg-white/90 p-4 text-xs md:text-sm">
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="pb-2 text-left">Category</th>
              <th className="pb-2 text-left">Nama</th>
              <th className="pb-2 text-left">Slug</th>
              <th className="pb-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="rounded-xl bg-slate-50">
                <td className="rounded-l-xl px-2 py-2">
                  {item.category_name}
                </td>
                <td className="px-2 py-2">{item.name}</td>
                <td className="px-2 py-2 text-slate-500">
                  {item.slug}
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
                <td className="py-2 text-slate-500" colSpan={3}>
                  Belum ada sub category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SubcategoryManagement

