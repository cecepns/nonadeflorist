import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://api-inventory.isavralabel.com/nonadeflorist'

function CategoryManagement() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [editingId, setEditingId] = useState(null)

  const fetchData = () => {
    axios.get(`${API_URL}/api/categories`).then((res) => setItems(res.data))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await axios.put(`${API_URL}/api/categories/${editingId}`, { name, slug })
    } else {
      await axios.post(`${API_URL}/api/categories`, { name, slug })
    }
    setName('')
    setSlug('')
    setEditingId(null)
    fetchData()
  }

  const handleEdit = (cat) => {
    setEditingId(cat.id)
    setName(cat.name)
    setSlug(cat.slug)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus category ini?')) return
    await axios.delete(`${API_URL}/api/categories/${id}`)
    if (editingId === id) {
      setEditingId(null)
      setName('')
      setSlug('')
    }
    fetchData()
  }

  return (
    <div className="space-y-4" data-aos="fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Manajemen Category
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-2xl border bg-white/90 p-4 text-sm md:grid-cols-[1.2fr,1.2fr,auto]"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Nama Category
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
              <th className="pb-2 text-left">Nama</th>
              <th className="pb-2 text-left">Slug</th>
              <th className="pb-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((cat) => (
              <tr key={cat.id} className="rounded-xl bg-slate-50">
                <td className="rounded-l-xl px-2 py-2">{cat.name}</td>
                <td className="px-2 py-2 text-slate-500">{cat.slug}</td>
                <td className="rounded-r-xl px-2 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleEdit(cat)}
                    className="mr-2 text-[11px] font-medium text-primary-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="text-[11px] font-medium text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-2 text-slate-500" colSpan={2}>
                  Belum ada category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryManagement

