import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://api.kingcreativestudio.my.id/nonadeflorist'

function AdminAboutImages() {
  const [items, setItems] = useState([])
  const [file, setFile] = useState(null)
  const [sortOrder, setSortOrder] = useState(0)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const fetchData = () => {
    axios.get(`${API_URL}/api/about-images`).then((res) => setItems(res.data))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setMessage('Silakan pilih gambar terlebih dahulu.')
      return
    }
    setSaving(true)
    setMessage('')
    try {
      const data = new FormData()
      data.append('image', file)
      data.append('sort_order', String(sortOrder || 0))
      await axios.post(`${API_URL}/api/about-images`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setFile(null)
      setSortOrder(0)
      fetchData()
      setMessage('Gambar berhasil ditambahkan.')
    } catch {
      setMessage('Gagal menambahkan gambar.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus gambar ini?')) return
    await axios.delete(`${API_URL}/api/about-images/${id}`)
    fetchData()
  }

  return (
    <div className="space-y-4" data-aos="fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Manajemen Gambar About
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border bg-white/90 p-4 text-sm"
      >
        <div className="grid gap-3 md:grid-cols-[1.5fr,0.5fr]">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Upload gambar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-600"
            />
            {file && (
              <div className="mt-2 inline-block overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-24 w-32 object-cover"
                />
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Urutan tampil (sort order)
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          {message && (
            <p className="text-xs text-slate-600">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="ml-auto rounded-full bg-primary-500 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-600 disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : 'Tambah Gambar'}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border bg-white/90 p-4 text-xs md:text-sm">
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="pb-2 text-left">Preview</th>
              <th className="pb-2 text-left">Sort</th>
              <th className="pb-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="rounded-xl bg-slate-50">
                <td className="rounded-l-xl px-2 py-2">
                  <img
                    src={`${API_URL}${item.image_url}`}
                    alt=""
                    className="h-16 w-20 rounded-md object-cover"
                  />
                </td>
                <td className="px-2 py-2">
                  {item.sort_order}
                </td>
                <td className="rounded-r-xl px-2 py-2 text-right">
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
                  Belum ada gambar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminAboutImages

