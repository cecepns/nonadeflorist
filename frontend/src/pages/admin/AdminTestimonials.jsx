import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://api-inventory.isavralabel.com/nonadeflorist'

function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    customer_name: '',
    location: '',
    message: '',
    is_active: true,
    sort_order: 0,
  })
  const [editingId, setEditingId] = useState(null)

  const fetchData = () => {
    axios.get(`${API_URL}/api/testimonials`).then((res) => setItems(res.data))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm({
      customer_name: '',
      location: '',
      message: '',
      is_active: true,
      sort_order: 0,
    })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await axios.put(`${API_URL}/api/testimonials/${editingId}`, form)
    } else {
      await axios.post(`${API_URL}/api/testimonials`, form)
    }
    resetForm()
    fetchData()
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      customer_name: item.customer_name,
      location: item.location || '',
      message: item.message,
      is_active: !!item.is_active,
      sort_order: item.sort_order || 0,
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus testimoni ini?')) return
    await axios.delete(`${API_URL}/api/testimonials/${id}`)
    fetchData()
  }

  return (
    <div className="space-y-4" data-aos="fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Manajemen Testimoni Pelanggan
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border bg-white/90 p-4 text-sm"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Nama Pelanggan
            </label>
            <input
              value={form.customer_name}
              onChange={(e) => handleChange('customer_name', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Lokasi (kota)
            </label>
            <input
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Pesan Testimoni
          </label>
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Urutan tampil (sort order)
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) =>
                handleChange('sort_order', Number(e.target.value) || 0)
              }
              className="w-24 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            />
          </div>
          <label className="mt-5 flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-primary-500 focus:ring-primary-200"
            />
            Tampilkan di Home
          </label>
        </div>

        <div className="flex justify-end gap-2">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:border-slate-300"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            className="rounded-full bg-primary-500 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-600"
          >
            {editingId ? 'Update Testimoni' : 'Simpan Testimoni'}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border bg-white/90 p-4 text-xs md:text-sm">
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="pb-2 text-left">Nama</th>
              <th className="pb-2 text-left">Lokasi</th>
              <th className="pb-2 text-left">Pesan</th>
              <th className="pb-2 text-left">Status</th>
              <th className="pb-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="rounded-xl bg-slate-50">
                <td className="rounded-l-xl px-2 py-2">{item.customer_name}</td>
                <td className="px-2 py-2 text-slate-500">
                  {item.location || '-'}
                </td>
                <td className="px-2 py-2 max-w-xs">
                  <span className="line-clamp-2">{item.message}</span>
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
                <td className="py-2 text-slate-500" colSpan={5}>
                  Belum ada testimoni.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTestimonials

