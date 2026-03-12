import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://api-inventory.isavralabel.com/nonadeflorist'

function AdminSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${API_URL}/api/settings`)
      .then((res) => {
        const whatsapp = res.data.find(
          (item) => item.key === 'whatsapp_number',
        )
        if (whatsapp) {
          setWhatsappNumber(whatsapp.value)
        }
      })
      .catch(() => {
        // ignore, keep default empty state
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await axios.put(`${API_URL}/api/settings/whatsapp_number`, {
        value: whatsappNumber,
      })
      setMessage('Nomor WhatsApp berhasil disimpan.')
    } catch {
      setMessage('Gagal menyimpan nomor WhatsApp.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4" data-aos="fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Pengaturan Umum
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border bg-white/90 p-4 text-sm"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Nomor WhatsApp (tanpa +, contoh: 6281234567890)
          </label>
          <input
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-primary-200 focus:ring-2 disabled:bg-slate-100"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          {message && (
            <p className="text-xs text-slate-600">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={saving || loading}
            className="ml-auto rounded-full bg-primary-500 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-600 disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings

