import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://api-inventory.isavralabel.com/nonadeflorist'

function AdminBanners() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    link_url: '',
    is_active: true,
    sort_order: 0,
  })
  const [editingId, setEditingId] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const fetchData = () => {
    axios.get(`${API_URL}/api/banners`).then((res) => setItems(res.data))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm({
      link_url: '',
      is_active: true,
      sort_order: 0,
    })
    setEditingId(null)
    setImageFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('link_url', form.link_url)
    formData.append('is_active', form.is_active ? '1' : '0')
    formData.append('sort_order', String(form.sort_order || 0))
    if (imageFile) {
      formData.append('image', imageFile)
    }

    if (editingId) {
      const current = items.find((it) => it.id === editingId)
      if (current?.image_url) {
        formData.append('image_url', current.image_url)
      }
      await axios.put(`${API_URL}/api/banners/${editingId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    } else {
      await axios.post(`${API_URL}/api/banners`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    resetForm()
    fetchData()
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      link_url: item.link_url || '',
      is_active: !!item.is_active,
      sort_order: item.sort_order || 0,
    })
    setImageFile(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus banner ini?')) return
    await axios.delete(`${API_URL}/api/banners/${id}`)
    fetchData()
  }

  return (
    <div className="space-y-4" data-aos="fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Manajemen Banner Homepage
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border bg-white/90 p-4 text-sm"
      >
        <div className="grid gap-3 md:grid-cols-[1.1fr,1.1fr,0.8fr]">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Gambar Banner
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                setImageFile(file || null)
              }}
              className="w-full text-xs"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Rekomendasi rasio 16:9 atau 21:9.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Link URL (opsional)
            </label>
            <input
              value={form.link_url}
              onChange={(e) => handleChange('link_url', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
              placeholder="contoh: /products atau https://wa.me/..."
            />
          </div>
          <div className="flex items-end">
            <div className="w-full">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Urutan tampil (sort order)
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  handleChange('sort_order', Number(e.target.value) || 0)
                }
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="mt-5 flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-primary-500 focus:ring-primary-200"
            />
            Tampilkan di Homepage
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
            {editingId ? 'Update Banner' : 'Simpan Banner'}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border bg-white/90 p-4 text-xs md:text-sm">
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="pb-2 text-left">Preview</th>
              <th className="pb-2 text-left">Link</th>
              <th className="pb-2 text-left">Status</th>
              <th className="pb-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="rounded-xl bg-slate-50">
                <td className="px-2 py-2 text-slate-500">
                  {item.image_url ? (
                    <img
                      src={`${API_URL}${item.image_url}`}
                      alt=""
                      className="h-12 w-32 rounded-md object-cover"
                    />
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-2 py-2 text-slate-500">
                  {item.link_url || '-'}
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
                  Belum ada banner.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminBanners

